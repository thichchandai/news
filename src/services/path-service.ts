"use server";
import { getToken } from "./token-service";

interface Response {
  status: boolean;
  message: string;
}

async function addLink(form: any): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/path`, {
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
    return { status: false, message: "Error" };
  }
}

async function getPath(): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/path`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return JSON.parse(error);
  }
}

async function deletePath(id: number): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/path/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return JSON.parse(error);
  }
}

async function offPath(id: number, link: String): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/path/off`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, link }),
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return JSON.parse(error);
  }
}

async function fakePath(id: number, link: string): Promise<Response> {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/path/fake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, link }),
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    return JSON.parse(error);
  }
}

export { addLink, getPath, deletePath, offPath, fakePath };
