import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "./services/get-user-me-loader";

export async function middleware(req: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = req.nextUrl.pathname;
  if (!currentPath.startsWith("/auth/login") && !user.status)
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (currentPath.startsWith("/auth/login") && user.status)
    return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
