import { deleteToken, getToken } from "./token-service";
async function getUserMeLoader() {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    return { status: response.ok, ...res };
  } catch (error: any) {
    await deleteToken();
    return { status: false, error };
  }
}

export { getUserMeLoader };
