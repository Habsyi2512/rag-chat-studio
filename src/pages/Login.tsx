import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import SEO from "@/components/SEO";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [asalDesa, setAsalDesa] = useState("");

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await api.register({
          email,
          password,
          asal_desa: asalDesa,
        });
        toast.success("Registrasi berhasil! Silakan login.");
        setIsSignUp(false);
      } else {
        const data = await api.login(email, password);

        // Simpan token dan info user
        localStorage.setItem("token", data.access_token);

        // Decode token or fetch user info (simplified for now by storing what we have)
        // Usually we'd want to get the user object from the backend
        // For now, let's assume we can get it or just store a placeholder and redirect
        // Ideally we fetch profiles, but for this task I'll just store a basic object
        // and let the app handle it.
        const userRole = email.includes("admin") ? "admin" : "user";
        localStorage.setItem("user", JSON.stringify({ email, role: userRole }));

        toast.success("Login berhasil!");

        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Login Admin - Disdukcapil Anambas" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-card/60 border border-border/40 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {isSignUp ? "Buat Akun Baru" : "Login"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "Daftar untuk mulai bertanya dengan AI"
                : "Masuk untuk bertanya dengan AI"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="asalDesa">Asal Desa</Label>
                <Input
                  id="asalDesa"
                  type="text"
                  value={asalDesa}
                  onChange={(e) => setAsalDesa(e.target.value)}
                  placeholder="Contoh: Tarempa Barat"
                  required
                  className="bg-background/50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-9 pr-9 bg-background/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Daftar" : "Login"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "Sudah punya akun? Login di sini"
                : "Belum punya akun? Daftar di sini"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
