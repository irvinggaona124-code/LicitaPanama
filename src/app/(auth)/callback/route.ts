import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if organization onboarding is completed
        const { data: org } = await supabase
          .from("organizations")
          .select("onboarding_completed")
          .eq("owner_user_id", user.id)
          .single();

        if (!org || !org.onboarding_completed) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return to login with error if exchange failed
  return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
}
