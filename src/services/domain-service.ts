"use server";

import { getToken } from "./token-service";

interface Domain {
  name: string;
}

interface Response {
  status: boolean;
  message: string;
}

async function addDomain(form: Domain): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/domain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return { status: false, message: JSON.stringify(error.message) };
  }
}

async function getDomain(): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/domain`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return { status: false, message: JSON.stringify(error.message) };
  }
}

async function deleteDomain(id: number): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/domain/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return { status: false, message: JSON.stringify(error.message) };
  }
}

export { addDomain, getDomain, deleteDomain };
