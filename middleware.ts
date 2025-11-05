export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/inbox/:path*", "/analytics/:path*"],
};
