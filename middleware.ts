import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all public paths except: api, _next, static files, admin, portal, supplier,
    // reset-password, set-password, and konsulenter (static SEO pages — Danish only)
    "/((?!api|_next|_vercel|.*\\..*|admin|portal|supplier|reset-password|set-password|konsulenter).*)",
  ],
};
