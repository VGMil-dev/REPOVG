import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rutas protegidas
  if (!user && pathname.startsWith("/(protected)")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Rutas de admin solo para profesor
  if (pathname.includes("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (profile?.rol !== "profesor") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirección a Onboarding si no ha terminado
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isOnboardingPath = pathname.startsWith("/onboarding");

  if (user && (isProtectedPath || isOnboardingPath || pathname === "/login")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_step, rol")
      .eq("id", user.id)
      .single();

    // Si no ha completado el onboarding y no está en una página de onboarding
    if (profile && profile.onboarding_step === 0 && !isOnboardingPath) {
      return NextResponse.redirect(new URL("/onboarding/mision-1", request.url));
    }

    // Si ya completó el onboarding e intenta entrar a onboarding, al dashboard
    if (profile && profile.onboarding_step >= 3 && isOnboardingPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Si ya está autenticado y va al login
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}
