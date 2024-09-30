"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserMeLoader } from "./get-user-me-loader";
interface LoginForm {
  email: string;
  password: string;
}

interface Response {
  status: boolean;
  message: string;
}

const config = {
  maxAge: 60 * 60 * 11,
  path: "/",
  domain: process.env.NEXT_PUBLIC_HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
};

async function login(form: LoginForm): Promise<Response> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const res = await response.json();
    if (response.ok) {
      cookies().set("jwt", res.message, config);
      const user = await getUserMeLoader();
      if (user.status) cookies().set("user", JSON.stringify(user.message));
    }
    return { status: response.ok, ...res };
  } catch (error: any) {
    return { status: false, message: JSON.stringify(error.message) };
  }
}

async function logout() {
  try {
    await cookies().delete("jwt");
  } catch (error: any) {
    console.log(error);
  }
  revalidatePath("/auth/login");
  redirect(`/auth/login`);
}

export { login, logout };
