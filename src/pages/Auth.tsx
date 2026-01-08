import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import heroImage from "@/assets/hero-discover.jpg";
import { cn } from "@/lib/utils";
import { Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Welcome! Let's set up your profile.",
        });
        // Auto sign-in usually occurs, check session or assume success
        // For Supabase, if email confirmation is off, they are signed in.
        // If on, they need to confirm.
        // Assuming development flow or handling session:
        navigate("/profile?setup=true");
      }
    } catch (err: any) {
      toast({
        title: "Authentication error",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setSocialLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast({
        title: `Unable to sign in with ${provider}`,
        description: err?.message ?? "Something went wrong with OAuth.",
        variant: "destructive",
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Brand + context */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sun className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-xl text-foreground">Conscious</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Elevate what you <span className="text-gradient">read, watch & listen</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md">
              Mindful Muse Finder curates culturally resonant books, conscious cinema, and
              consciousness-expanding music tailored to your mood, activity, and region.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-border max-w-md">
            <img
              src={heroImage}
              alt="Mindful content discovery"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs md:text-sm text-primary-foreground">
              <p className="font-medium">
                "What you consume shapes who you become. Choose consciously."
              </p>
            </div>
          </div>
        </div>

        {/* Right: Auth card */}
        <Card className="w-full max-w-md mx-auto shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              {isSignIn ? "Welcome back" : "Create your conscious profile"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isSignIn
                ? "Sign in to continue your mindful content journey."
                : "Register to save your preferences, favourites, and templates."}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  required
                />
              </div>
              <Button
                type="submit"
                className={cn("w-full mt-2", "gradient-primary text-primary-foreground")}
                disabled={loading}
              >
                {loading ? "Please wait..." : isSignIn ? "Login" : "Register"}
              </Button>
            </form>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin("facebook")}
              >
                <span className="text-[#1877F2] text-lg font-bold">f</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin("google")}
              >
                <span className="text-lg font-bold text-[#EA4335]">G</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2"
                disabled={!!socialLoading}
                onClick={() => handleSocialLogin("apple")}
              >
                <span className="text-xl font-semibold"></span>
              </Button>
            </div>

            <div className="text-center text-xs md:text-sm text-muted-foreground">
              {isSignIn ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Register now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary hover:underline font-medium"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
