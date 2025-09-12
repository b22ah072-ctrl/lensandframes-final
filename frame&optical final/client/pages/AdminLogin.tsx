import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem("authUser");
    if (authed) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const storedUser = localStorage.getItem("adminUsername") || "user1";
      const storedPass = localStorage.getItem("adminPassword") || "root";
      if (username === storedUser && password === storedPass) {
        localStorage.setItem("authUser", username);
        toast.success("Welcome back");
        navigate("/admin/dashboard", { replace: true });
      } else {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[60vh] sm:min-h-[80vh] bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/80 shadow-xl">
          <div className="relative h-24 bg-[#980404]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#980404] to-[#b30606] opacity-90" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F4831fa9ad687427b9a1f1e60e3ebd1e7?format=webp&width=800"
                alt="Lens & Frame logo"
                className="h-10 w-auto"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fe8eafd03a90142ed8cfde299911116e2?format=webp&width=800"
                alt="Lens & Frame Optics"
                className="hidden sm:block h-7 w-auto opacity-90"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
            <p className="text-white/70 mt-1 text-sm">
              Use your administrator credentials to continue.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-white/80">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#980404]"
                  placeholder="Username"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-sm text-white/80">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#980404]"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button
                disabled={loading}
                className={cn(
                  "w-full bg-[#980404] text-white hover:bg-[#880404] rounded-xl h-11",
                  loading ? "opacity-80 cursor-not-allowed" : "",
                )}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
