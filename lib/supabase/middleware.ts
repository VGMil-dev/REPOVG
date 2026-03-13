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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
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

  // Rutas públicas que no requieren sesión
  const isPublicPath = pathname === "/login" || 
                       pathname === "/register" || 
                       pathname === "/" ||
                       pathname.startsWith("/api/auth");

  // Si no hay usuario y no es una ruta pública, redirigir al login
  if (!user && !isPublicPath) {
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
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/checkout");
  const isOnboardingPath = pathname.startsWith("/onboarding");

  if (user && (isProtectedPath || isOnboardingPath || pathname === "/login")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_step, rol")
      .eq("id", user.id)
      .single();

    if (profile) {
      // 1. Profesor: Siempre a /admin si intenta entrar a login o onboarding
      if (profile.rol === "profesor") {
        if (isOnboardingPath || pathname === "/login" || pathname === "/") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return supabaseResponse;
      }

      // 2. Estudiante/Externo: Si no ha completado onboarding, forzarlo
      if (profile.onboarding_step < 3) {
        if (!isOnboardingPath) {
          // Exalumno y Externo: Redirigir a pago si es el primer login
          if ((profile.rol === "exalumno" || profile.rol === "externo") && profile.onboarding_step === 0 && pathname !== "/checkout") {
             return NextResponse.redirect(new URL("/checkout", request.url));
          }
          return NextResponse.redirect(new URL("/onboarding/mision-1", request.url));
        }
        return supabaseResponse;
      }

      // 3. Redirección desde checkout si ya no aplica
      if (pathname === "/checkout" && (profile.rol === "profesor" || profile.rol === "estudiante" || profile.onboarding_step > 0)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. Ya completó onboarding e intenta volver: al dashboard
      if (profile.onboarding_step >= 3 && isOnboardingPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 4. Redirección estándar desde login
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      // Si hay usuario pero NO hay perfil (ej: error de sincronización)
      // No redirigimos al login todavía para evitar bucles, dejamos que el layout lo maneje
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}
