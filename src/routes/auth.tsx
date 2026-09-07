import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — ShopKart" },
      {
        name: "description",
        content: "Log in to ShopKart to track orders, save your wishlist and check out faster.",
      },
      { property: "og:title", content: "Login or Sign Up — ShopKart" },
      {
        property: "og:description",
        content: "Access your ShopKart account to track orders and save favourites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created!");
          navigate({ to: "/" });
        } else {
          toast.success("Check your email to confirm your account.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-brand px-4 py-4 text-brand-foreground">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Link to="/" aria-label="Back to home">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold">
            {session ? "Your account" : mode === "login" ? "Login" : "Create account"}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        {session ? (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="text-base font-semibold text-card-foreground">{session.user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-5 w-full rounded-md border border-border py-2.5 text-sm font-semibold text-foreground"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Sign in to track orders, save favourites and check out faster.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {mode === "signup" && (
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gold py-3 text-sm font-bold text-gold-foreground disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={busy}
              className="w-full rounded-md border border-border py-2.5 text-sm font-semibold text-foreground disabled:opacity-60"
            >
              Continue with Google
            </button>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "login" ? "New to ShopKart?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-brand"
              >
                {mode === "login" ? "Create an account" : "Login"}
              </button>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
