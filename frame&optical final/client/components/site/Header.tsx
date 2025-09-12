import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Collection", href: "#collection" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reflect mobile menu state on body to coordinate overlays (e.g., chat)
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileOpen);
    window.dispatchEvent(new CustomEvent("nav:open", { detail: { open: mobileOpen } }));
    return () => {
      document.body.classList.remove("nav-open");
      window.dispatchEvent(new CustomEvent("nav:open", { detail: { open: false } }));
    };
  }, [mobileOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, []);

  const smoothScrollTo = (hash: string, opts?: { offset?: number; delay?: number }) => {
    const id = (hash || '').replace(/^#/, '');
    const el = document.getElementById(id);
    const offset = opts?.offset ?? 72;
    const delay = opts?.delay ?? 120;
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.setTimeout(() => window.scrollTo({ top, behavior: 'smooth' }), delay);
    } else {
      window.location.hash = `#${id}`;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors text-white",
        "bg-[#980404] backdrop-blur border-b border-white/10",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo('#home', { offset: 72, delay: 0 });
          }}
          className="brand-container flex items-center gap-3 font-extrabold tracking-tight"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F4831fa9ad687427b9a1f1e60e3ebd1e7?format=webp&width=800"
            alt="Lens & Frame logo"
            className="h-8 sm:h-12 w-auto"
          />

          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fe8eafd03a90142ed8cfde299911116e2?format=webp&width=800"
            alt="Lens & Frame wordmark"
            className="h-7 sm:h-9 md:h-11 w-auto"
          />
        </a>
        {!isAdmin && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="relative text-neutral-300 hover:text-white transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#900404] after:transition-all hover:after:w-full"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <div className="hidden sm:block">
              <Button asChild className="bg-white text-neutral-900 hover:bg-[#900404] hover:text-white">
                <a href="#contact">Book Appointment</a>
              </Button>
            </div>
          )}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white/90 hover:text-white hover:bg-white/10"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M4 8h16v2H4V8Zm0 6h16v2H4v-2Z" />
              </svg>
            )}
          </button>

          {/* Mobile: show Book Appointment as compact icon */}
          {!isAdmin && (
            <div className="md:hidden" aria-hidden>
              <Button
                size="icon"
                className="bg-white text-neutral-900 hover:bg-[#900404] hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  const el = document.getElementById("contact");
                  if (el) {
                    const offset = 72;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                  } else {
                    window.location.hash = "#contact";
                  }
                }}
              >
                {/* calendar/booking icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
                  <path d="M7 10h5v5H7v-5z" opacity=".9" />
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM5 8h14v2H5V8z" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && !isAdmin && (
        <div className="md:hidden fixed inset-x-0 top-20 z-40 bg-[#980404] backdrop-blur border-t border-white/10 p-4">
          <nav className="container py-2 flex flex-col gap-2">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  smoothScrollTo(n.href, { offset: 72, delay: 120 });
                }}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-white/5 text-lg"
              >
                <span>{n.label}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-[#900404]"
                >
                  <path d="M9 18l6-6-6-6v12z" />
                </svg>
              </a>
            ))}

            <div className="mt-4">
              <div className="block">
              <Button
                className="w-full bg-white text-neutral-900 hover:bg-[#900404] hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  const el = document.getElementById("contact");
                  if (el) {
                    const offset = 72;
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    setTimeout(() => window.scrollTo({ top, behavior: "smooth" }), 120);
                  } else {
                    window.location.hash = "#contact";
                  }
                }}
              >
                Book Appointment
              </Button>
            </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
