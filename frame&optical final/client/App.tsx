import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Redirects common mis-cased or variant admin paths to canonical routes
function RouteNormalizer({ validRoutes }: { validRoutes: string[] }) {
  const loc = useLocation();
  const path = loc.pathname || "/";
  const normalized = path.toLowerCase();

  // Helper: strip non-alphanum to match common variants like /AdminLogin -> adminlogin
  const compact = (p: string) => p.replace(/[^a-z0-9]/g, "");

  const map: Record<string, string> = {
    "adminlogin": "/admin/login",
    "adminlogin/": "/admin/login",
    "admindashboard": "/admin/dashboard",
    "admin-dashboard": "/admin/dashboard",
    "admin": "/admin",
    "admin/": "/admin",
  };

  const c = compact(normalized);
  if (map[c] && map[c] !== path) {
    return <Navigate to={map[c]} replace />;
  }

  // If normalized exactly matches a valid route (case-diff), redirect to lowercase
  if (validRoutes.includes(normalized) && normalized !== path) {
    return <Navigate to={normalized} replace />;
  }

  // Not a known route -> redirect to home to avoid 404s in preview/subpath environments
  if (!path.startsWith("/admin")) {
    return <Navigate to="/" replace />;
  }
  return <NotFound />;
}

const queryClient = new QueryClient();

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ChatWidget from "@/components/site/ChatWidget";
import AdminRuntime from "@/components/site/AdminRuntime";

function ChatWidgetGuard() {
  const loc = useLocation();
  if (loc.pathname.startsWith("/admin")) return null;
  return <ChatWidget />;
}

function AnchorScrollManager() {
  const getOffset = () => {
    const header = document.querySelector("header");
    const h = header instanceof HTMLElement ? header.offsetHeight : 0;
    return h || 96; // fallback if header not yet measurable
  };

  const scrollToId = (id: string, delay = 0) => {
    if (!id) return;
    const el = document.getElementById(id.replace(/^#/, ""));
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - getOffset();
    window.setTimeout(() => window.scrollTo({ top, behavior: "smooth" }), delay);
  };

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href || href === "#") return;
      e.preventDefault();
      const id = href.replace(/^#/, "");
      scrollToId(id, 0);
      // also update URL hash for shareability
      const url = new URL(window.location.href);
      url.hash = `#${id}`;
      history.replaceState(history.state, "", url.toString());
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const authed = typeof window !== "undefined" && localStorage.getItem("authUser");
  if (!authed) return <Navigate to="/admin/login" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <AnchorScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />

          {/* Normalize common incorrect/capitalized admin paths to the correct ones */}
          <Route
            path="*"
            element={<RouteNormalizer validRoutes={["/", "/admin/login", "/admin/dashboard"]} />}
          />
        </Routes>
        <Footer />
        <ChatWidgetGuard />
        <AdminRuntime />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
