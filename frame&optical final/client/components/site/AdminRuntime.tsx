import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

function isNowBetween(start?: string, end?: string) {
  const now = new Date();
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (s && now < s) return false;
  if (e && now > e) return false;
  return true;
}

export default function AdminRuntime() {
  const [state, setState] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("adminCMS");
        setState(raw ? JSON.parse(raw) : null);
      } catch {
        setState(null);
      }
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "adminCMS") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!state?.banners?.popup) return;
    const { enabled, image, start, end } = state.banners.popup;
    if (!enabled || !image) return;
    // use per-image dismissal key so new images show popup even if user dismissed previous
    const key = `popupDismissed:${image}`;
    const dismissed = sessionStorage.getItem(key) === "1";
    if (dismissed) return;
    const path = loc?.pathname || "/";
    const onAdmin = path.startsWith("/admin");
    // treat homepage variants as home (/, /index.html)
    const onHome = path === "/" || path === "" || path.endsWith("/index.html");
    if (!onHome || onAdmin) return;
    if (isNowBetween(start, end)) setShowPopup(true);
  }, [state, loc?.pathname]);

  const editMode = state?.quickEdit?.enabled;

  useEffect(() => {
    if (state?.theme?.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (state?.theme?.mode === "light") {
      document.documentElement.classList.remove("dark");
    }
    if (state?.theme?.primary) {
      document.documentElement.style.setProperty(
        "--primary",
        state.theme.primary,
      );
      document.documentElement.style.setProperty(
        "--accent",
        state.theme.primary,
      );
      document.documentElement.style.setProperty("--ring", state.theme.primary);
    }
  }, [state]);

  if (!state) return null;

  return (
    <>
      {showPopup && loc?.pathname === "/" && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/90 shadow-2xl">
            <button
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <img
              src={state.banners.popup.image}
              alt="Popup"
              className="w-full h-[28rem] object-cover"
            />
            <div className="p-4 flex items-center justify-end gap-2">
              <Button
                className="bg-white text-neutral-900 hover:bg-white/90"
                onClick={() => setShowPopup(false)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => {
                  const key = `popupDismissed:${state.banners.popup.image}`;
                  sessionStorage.setItem(key, "1");
                  setShowPopup(false);
                }}
              >
                Don't show again
              </Button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <div className="fixed bottom-6 right-6 z-[90]">
          <div className="rounded-xl bg-[#980404] text-white shadow-lg px-4 py-3">
            <div className="text-sm font-semibold">Quick Edit Mode</div>
            <div className="text-xs opacity-90">
              Click highlighted content to edit
            </div>
          </div>
        </div>
      )}
    </>
  );
}
