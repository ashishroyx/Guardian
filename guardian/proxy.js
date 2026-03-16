import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes are protected. 
// Routes NOT in this list will be public (like your homepage).
const isProtectedRoute = createRouteMatcher([
  
  "/about(.*)",
  "/dashboard(.*)",
  "/gallary(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the user is trying to access a protected route
  if (isProtectedRoute(req)) {
    // 3. This will automatically redirect unauthenticated users to your /sign-in page
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};