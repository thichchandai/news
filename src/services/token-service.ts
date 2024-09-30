import { cookies } from "next/headers";

export async function getToken() {
  const authToken = cookies().get("jwt")?.value;
  return authToken;
}

export async function deleteToken() {
  try {
    cookies().delete("jwt");
  } catch (error) {
    console.log("error token", error);
  }
}
