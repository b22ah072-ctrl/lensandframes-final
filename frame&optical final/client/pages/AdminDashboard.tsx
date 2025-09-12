import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RTooltip,
  BarChart,
  Bar,
} from "recharts";

// Persistent CMS state
interface CMSState {
  theme: { mode: "light" | "dark" | "system"; primary: string };
  quickEdit: { enabled: boolean };
  gallery: string[];
  layout: string[];
  content: Record<string, { text?: string; image?: string }>;
  banners: {
    placements: {
      id: string;
      image: string;
      location: "homepage_top" | "collection_top";
      start?: string;
      end?: string;
    }[];
    popup: { enabled: boolean; image?: string; start?: string; end?: string };
  };
  services: { id: string; title: string; description: string; image?: string }[];
  products: { id: string; name: string; description?: string; image?: string; category: string }[];
  testimonials: { id: string; quote: string; name: string; image?: string }[];
  activity: { id: string; at: number; message: string }[];
}

const STORAGE_KEY = "adminCMS";
const nowISO = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

const defaultState: CMSState = {
  theme: { mode: "dark", primary: "0 72% 45%" },
  quickEdit: { enabled: false },
  gallery: [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519305122291-5df2170d4870?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
  ],
  layout: [
    "hero",
    "homepage_banner",
    "about",
    "collection",
    "services",
    "testimonials",
    "partners",
    "contact",
  ],
  content: {
    hero_title: { text: "Premium Sunglasses Collection" },
    hero_subtitle: {
      text: "Discover curated sunglasses for every style with full UV protection and crystal-clear lenses.",
    },
  },
  banners: {
    placements: [],
    popup: { enabled: false },
  },
  services: [
    {
      id: uid(),
      title: "Eye Exams",
      description: "Comprehensive testing and prescriptions",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: uid(),
      title: "Designer Eyewear",
      description: "Curated premium brands",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: uid(),
      title: "Contact Lenses",
      description: "Comfortable and clear vision",
      image: "https://images.unsplash.com/photo-1576906467560-2e0a1dfd8f6d?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  products: [],
  testimonials: [
    { id: uid(), quote: "Exceptional service and quality frames.", name: "Ahmed Al-Ansari" },
    { id: uid(), quote: "Fast service, great selection, and friendly staff.", name: "Mohammed Hassan" },
  ],
  activity: [],
};

function useCMS() {
  const [state, setState] = useState<CMSState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CMSState) : defaultState;
    } catch {
      return defaultState;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    try {
      localStorage.setItem("adminCMS_lastUpdated", String(Date.now()));
      window.dispatchEvent(new CustomEvent("adminCMS:updated", { detail: { ts: Date.now() } }));
    } catch {}
  }, [state]);
  const log = (message: string) =>
    setState((s) => ({
      ...s,
      activity: [{ id: uid(), at: Date.now(), message }, ...s.activity].slice(0, 100),
    }));
  return { state, setState, log } as const;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { state, setState, log } = useCMS();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<
    | "dashboard"
    | "layout"
    | "gallery"
    | "content"
    | "banners"
    | "services"
    | "products"
    | "testimonials"
    | "settings"
    | "analytics"
  >("dashboard");

  useEffect(() => {
    const authed = localStorage.getItem("authUser");
    if (!authed) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    try {
      localStorage.setItem("adminCMS_lastUpdated", String(Date.now()));
      window.dispatchEvent(new CustomEvent("adminCMS:updated", { detail: { ts: Date.now() } }));
    } catch {}
    toast.success("Saved");
    log("Saved changes");
  };

  const preview = () => {
    window.open("/", "_blank");
    log("Preview opened");
  };

  const publish = () => {
    save();
    toast.success("Published");
    log("Published");
  };

  const signOut = () => {
    localStorage.removeItem("authUser");
    toast("Signed out");
    navigate("/admin/login", { replace: true });
  };

  const items = [
    { k: "dashboard", label: "Dashboard", icon: DashboardIcon },
    { k: "gallery", label: "Gallery", icon: GalleryIcon },
    { k: "content", label: "Content", icon: ContentIcon },
    { k: "banners", label: "Banners", icon: BannersIcon },
    { k: "services", label: "Services", icon: ServicesIcon },
    { k: "products", label: "Products", icon: ProductsIcon },
    { k: "testimonials", label: "Testimonials", icon: SparkleIcon },
    { k: "analytics", label: "Analytics", icon: AnalyticsIcon },
    { k: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen dark bg-background text-foreground">
      {/* Topbar */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/40">
        <div className="container h-14 flex items-center gap-3">
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/15"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="size-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-sm opacity-80">
            <SparkleIcon className="size-4 text-[#ff5a5a]" />
            <span>Lens & Frame Optics — Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={preview}>Preview</Button>
            <Button variant="outline" className="bg-white text-neutral-900 hover:bg-white/90" onClick={save}>Save</Button>
            <Button className="bg-[#980404] hover:bg-[#880404]" onClick={publish}>Publish</Button>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2 py-1">
              <img src="https://i.pravatar.cc/40?img=13" alt="Profile" className="h-7 w-7 rounded-full" />
              <span className="hidden sm:block text-sm">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="container grid md:grid-cols-[260px_1fr] gap-6 py-6">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden />
        )}

        <aside className={cn(
          "h-max rounded-2xl border border-border bg-card/60 backdrop-blur p-2 space-y-1 md:sticky md:top-20",
          sidebarOpen ? "block md:block fixed inset-4 z-50 w-[calc(100%-2rem)] max-w-xs" : "hidden md:block",
        )}>
          {items.map((it) => (
            <button
              key={it.k}
              onClick={() => setTab(it.k as any)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                tab === it.k ? "bg-[#980404] text-white" : "hover:bg-white/10",
              )}
            >
              <it.icon className="size-4" />
              <span>{it.label}</span>
            </button>
          ))}
          <div className="pt-2">
            <Button className="w-full bg-white text-neutral-900 hover:bg-white/90" onClick={save}>Save Changes</Button>
            <Button variant="outline" className="mt-2 w-full bg-white/10 text-white border-white/30 hover:bg-white/20" onClick={signOut}>Sign Out</Button>
          </div>
        </aside>

        <section className="space-y-6">
          {tab === "dashboard" && (
            <DashboardHome state={state} setState={setState} setTab={setTab} log={log} />
          )}
          {tab === "gallery" && <GalleryManager state={state} setState={setState} log={log} />}
          {tab === "content" && <ContentEditor state={state} setState={setState} log={log} />}
          {tab === "banners" && <BannerManager state={state} setState={setState} log={log} />}
          {tab === "services" && <ServicesManager state={state} setState={setState} log={log} />}
          {tab === "products" && <ProductsManager state={state} setState={setState} log={log} />}
          {tab === "testimonials" && <TestimonialsManager state={state} setState={setState} log={log} />}
          {tab === "settings" && <SettingsPanel state={state} setState={setState} log={log} />}
          {tab === "analytics" && <AnalyticsPanel state={state} />}
        </section>
      </div>
    </div>
  );
}

/* -------- Dashboard Home -------- */
function DashboardHome({ state, setState, setTab, log }: { state: CMSState; setState: any; setTab: any; log: (m: string) => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Button className="rounded-xl bg-[#980404] hover:bg-[#880404]" onClick={async () => {
            setTab("banners");
            setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, enabled: true } } }));
            const f = await pickFile();
            if (f) {
              const d = await fileToDataUrl(f);
              setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, image: d, enabled: true } } }));
              log("Added popup banner image");
            }
          }}>Add Banner</Button>
          <Button className="rounded-xl bg-white text-neutral-900 hover:bg-white/90" onClick={() => { setTab("gallery"); window.dispatchEvent(new CustomEvent("admin:openGalleryUploader")); }}>Upload Gallery</Button>
          <Button className="rounded-xl bg-white/10 text-foreground hover:bg-white/20 border border-border" onClick={() => { setState((s: CMSState) => ({ ...s, services: [...s.services, { id: uid(), title: "New Service", description: "Describe the service", image: "" }], })); setTab("services"); log("Added service"); }}>New Service</Button>
          <Button className="rounded-xl bg-white/10 text-foreground hover:bg-white/20 border border-border" onClick={() => { setState((s: CMSState) => ({ ...s, products: [{ id: uid(), name: "New Product", description: "", image: "", category: "Sunglasses" }, ...s.products], })); setTab("products"); log("Added product"); }}>New Product</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="font-semibold">Activity</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/80 max-h-48 overflow-auto pr-1">
          {state.activity.slice(0, 8).map((a) => (
            <li key={a.id} className="flex items-center gap-2">
              <SparkleIcon className="size-3 text-[#ff5a5a]" />
              <span>{a.message}</span>
              <span className="ml-auto text-xs opacity-60">{new Date(a.at).toLocaleString()}</span>
            </li>
          ))}
          {state.activity.length === 0 && <li className="opacity-60">No recent activity</li>}
        </ul>
      </div>
    </div>
  );
}

/* -------- Layout Manager -------- */
function LayoutManager({ state, setState }: { state: CMSState; setState: any }) {
  const all = [
    { k: "hero", label: "Hero" },
    { k: "homepage_banner", label: "Top Banner" },
    { k: "about", label: "About" },
    { k: "collection", label: "Product Collection" },
    { k: "services", label: "Services" },
    { k: "testimonials", label: "Testimonials" },
    { k: "partners", label: "Partners" },
    { k: "contact", label: "Contact" },
  ];
  const included = state.layout;
  const remaining = all.filter((s) => !included.includes(s.k));

  const dragIndex = useRef<number | null>(null);
  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setState((s: CMSState) => {
      const copy = [...s.layout];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return { ...s, layout: copy };
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Visible Sections</h3>
          <Button className="bg-white text-neutral-900 hover:bg-white/90" onClick={() => setState((s: CMSState) => ({ ...s, layout: all.map((x) => x.k) }))}>Show All</Button>
        </div>
        <ul className="mt-4 space-y-3">
          {included.map((k, i) => {
            const item = all.find((x) => x.k === k)!;
            return (
              <li
                key={k}
                className="flex items-center gap-3 rounded-xl border border-border bg-black/20 px-3 py-2"
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragEnd={() => (dragIndex.current = null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragIndex.current !== null && reorder(dragIndex.current, i)}
              >
                <span className="cursor-grab select-none">↕</span>
                <span className="font-medium">{item?.label || k}</span>
                <span className="ml-auto text-xs text-white/60">{k}</span>
                <Button
                  className="ml-2 bg-red-600 hover:bg-red-700"
                  onClick={() => setState((s: CMSState) => ({ ...s, layout: s.layout.filter((x) => x !== k) }))}
                >
                  Remove
                </Button>
              </li>
            );
          })}
          {included.length === 0 && <li className="opacity-70">No sections visible.</li>}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="font-semibold">Add Sections</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {remaining.map((s) => (
            <button
              key={s.k}
              className="rounded-xl border border-border bg-black/20 px-4 py-3 text-left hover:bg-white/10"
              onClick={() => setState((st: CMSState) => ({ ...st, layout: [...st.layout, s.k] }))}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-xs text-white/60">{s.k}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------- Gallery Manager -------- */
function GalleryManager({ state, setState, log }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handler = () => inputRef.current?.click();
    window.addEventListener("admin:openGalleryUploader", handler as any);
    return () => window.removeEventListener("admin:openGalleryUploader", handler as any);
  }, []);
  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr: string[] = [];
    for (const f of Array.from(files)) {
      const url = await fileToDataUrl(f);
      arr.push(url);
    }
    setState((s: CMSState) => ({ ...s, gallery: [...s.gallery, ...arr] }));
    log(`Uploaded ${arr.length} image(s)`);
    toast.success("Images added");
  };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); onFiles(e.dataTransfer.files); };
  const reorder = (from: number, to: number) => {
    setState((s: CMSState) => {
      const copy = [...s.gallery];
      const [m] = copy.splice(from, 1);
      copy.splice(to, 0, m);
      return { ...s, gallery: copy };
    });
    log("Reordered gallery");
  };
  const dragIndex = useRef<number | null>(null);
  return (
    <div>
      <div className="rounded-2xl border border-dashed border-white/20 bg-card/40 p-6 text-center" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        <p className="text-white/80">Drag & drop images here, or</p>
        <div className="mt-3">
          <Button className="bg-white text-neutral-900 hover:bg-white/90" onClick={() => inputRef.current?.click()}>Upload Images</Button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {state.gallery.map((url, i) => (
          <div key={i} className="group relative rounded-2xl overflow-hidden border border-border bg-card/60" draggable onDragStart={() => (dragIndex.current = i)} onDragEnd={() => (dragIndex.current = null)} onDragOver={(e) => e.preventDefault()} onDrop={() => dragIndex.current !== null && reorder(dragIndex.current, i)}>
            <img src={url} alt={`Gallery ${i + 1}`} className="h-32 sm:h-44 w-full object-cover" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/50 flex items-center justify-center gap-2">
              <Button variant="outline" className="bg-white/10 text-white border-white/40 hover:bg-white/20" onClick={() => window.open(url, "_blank")}>Preview</Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/40 hover:bg-white/20" onClick={async () => { const f = await pickFile(); if (!f) return; const d = await fileToDataUrl(f); setState((s: CMSState) => ({ ...s, gallery: s.gallery.map((u, idx) => (idx === i ? d : u)) })); log("Replaced gallery image"); }}>Replace</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => { setState((s: CMSState) => ({ ...s, gallery: s.gallery.filter((_, idx) => idx !== i) })); log("Removed gallery image"); }}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- Content Editor -------- */
function ContentEditor({ state, setState, log }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const entries = Object.entries(state.content);
  const [selected, setSelected] = useState<string>(entries[0]?.[0] || "");
  const update = (key: string, patch: any) => setState((s: CMSState) => ({ ...s, content: { ...s.content, [key]: { ...s.content[key], ...patch } } }));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Sections</h3>
          <Button className="bg-white text-neutral-900 hover:bg-white/90" onClick={() => { const k = prompt("New section key (e.g., about_title)"); if (!k) return; setState((s: CMSState) => ({ ...s, content: { ...s.content, [k]: { text: "New content" } } })); setSelected(k); }}>Add Section</Button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {entries.map(([k]) => (
            <li key={k}>
              <button className={cn("w-full rounded-xl px-3 py-2 text-left", selected === k ? "bg-[#980404]" : "bg-white/5 hover:bg-white/10")} onClick={() => setSelected(k)}>{k}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        {selected ? (
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-white/80">Text</label>
              <textarea className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 h-28 outline-none focus:ring-2 focus:ring-[#980404]" value={state.content[selected]?.text || ""} onChange={(e) => update(selected, { text: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-white/80">Image URL</label>
              <input className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#980404]" value={state.content[selected]?.image || ""} onChange={(e) => update(selected, { image: e.target.value })} />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Live Preview</h4>
              <div className="rounded-xl overflow-hidden border border-border bg-black/30 p-4 grid gap-3">
                {state.content[selected]?.image && (<img src={state.content[selected]?.image} alt="preview" className="h-40 w-full object-cover rounded-lg" />)}
                <div className="text-white/90 whitespace-pre-wrap">{state.content[selected]?.text || ""}</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="opacity-70">Select or add a section to edit.</p>
        )}
      </div>
    </div>
  );
}

/* -------- Banner Manager -------- */
function BannerManager({ state, setState, log }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const addPlacement = () => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, placements: [...s.banners.placements, { id: uid(), image: "", location: "homepage_top" }], } }));
  const updatePlacement = (id: string, patch: any) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, placements: s.banners.placements.map((p) => (p.id === id ? { ...p, ...patch } : p)), } }));
  const removePlacement = (id: string) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, placements: s.banners.placements.filter((p) => p.id !== id), } }));
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Popup Ad</h3>
          <Button className="bg-white text-neutral-900 hover:bg-white/90" onClick={() => toast("Preview opened in site overlay when enabled")}>How it looks</Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!state.banners.popup.enabled} onChange={(e) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, enabled: e.target.checked }, } }))} /> Enable popup
            </label>
            <input placeholder="Image URL" className="w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#980404]" value={state.banners.popup.image || ""} onChange={(e) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, image: e.target.value }, } }))} />
            <div className="grid grid-cols-2 gap-3">
              <input type="datetime-local" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={state.banners.popup.start || ""} onChange={(e) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, start: e.target.value }, } }))} />
              <input type="datetime-local" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={state.banners.popup.end || ""} onChange={(e) => setState((s: CMSState) => ({ ...s, banners: { ...s.banners, popup: { ...s.banners.popup, end: e.target.value }, } }))} />
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border bg-black/30 h-48">
            {state.banners.popup.image ? (
              <img src={state.banners.popup.image} alt="Popup preview" className="w-full h-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-white/60">Popup preview</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Placements</h3>
          <Button className="bg-[#980404] hover:bg-[#880404]" onClick={addPlacement}>Add Banner</Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {state.banners.placements.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-black/30 p-4 space-y-3">
              <div className="grid gap-3">
                <input placeholder="Image URL" className="w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#980404]" value={p.image} onChange={(e) => updatePlacement(p.id, { image: e.target.value })} />
                <select className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={p.location} onChange={(e) => updatePlacement(p.id, { location: e.target.value as any })}>
                  <option value="homepage_top">Homepage top</option>
                  <option value="collection_top">Collection top</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="datetime-local" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={p.start || ""} onChange={(e) => updatePlacement(p.id, { start: e.target.value })} />
                  <input type="datetime-local" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={p.end || ""} onChange={(e) => updatePlacement(p.id, { end: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">ID: {p.id}</span>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => removePlacement(p.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------- Services -------- */
function ServicesManager({ state, setState, log }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const add = () => setState((s: CMSState) => ({ ...s, services: [...s.services, { id: uid(), title: "New Service", description: "Describe the service" }] }));
  const remove = (id: string) => setState((s: CMSState) => ({ ...s, services: s.services.filter((x) => x.id !== id) }));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {state.services.map((s) => (
        <div key={s.id} className="rounded-2xl border border-border bg-card/60 p-5 space-y-3">
          {s.image ? (
            <img src={s.image} alt={s.title} className="h-28 w-full object-cover rounded-lg" />
          ) : (
            <div className="h-28 w-full grid place-items-center rounded-lg bg-black/10 text-sm text-foreground/70">No image</div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/10 text-foreground border-border hover:bg-white/20" onClick={async () => { const f = await pickFile(); if (!f) return; const d = await fileToDataUrl(f); setState((st: CMSState) => ({ ...st, services: st.services.map((x) => (x.id === s.id ? { ...x, image: d } : x)) })); }}>Replace image</Button>
            {s.image && (
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => setState((st: CMSState) => ({ ...st, services: st.services.map((x) => (x.id === s.id ? { ...x, image: "" } : x)) }))}>Remove image</Button>
            )}
          </div>
          <input className="w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={s.title} onChange={(e) => setState((st: CMSState) => ({ ...st, services: st.services.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)) }))} />
          <textarea className="w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 h-24" value={s.description} onChange={(e) => setState((st: CMSState) => ({ ...st, services: st.services.map((x) => (x.id === s.id ? { ...x, description: e.target.value } : x)) }))} />
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>ID: {s.id}</span>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => remove(s.id)}>Remove</Button>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-dashed border-white/20 bg-card/40 p-5 grid place-items-center">
        <Button className="bg-[#980404] hover:bg-[#880404]" onClick={add}>Add Service</Button>
      </div>
    </div>
  );
}

/* -------- Products -------- */
function ProductsManager({ state, setState }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("Sunglasses");
  const nameRef = useRef<HTMLInputElement | null>(null);
  const add = () => {
    if (!name) return;
    setState((s: CMSState) => ({ ...s, products: [{ id: uid(), name, category: cat, image: "", asset: "", description: "" }, ...s.products] }));
    setName("");
    setTimeout(() => nameRef.current?.focus(), 50);
  };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card/60 p-5 grid md:grid-cols-[1fr_180px_auto] gap-3">
        <input ref={nameRef} className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={cat} onChange={(e) => setCat(e.target.value)}>
          {"Sunglasses Eyeglasses Sports Fashion".split(" ").map((c) => (<option key={c}>{c}</option>))}
        </select>
        <Button className="bg-[#980404] hover:bg-[#880404]" onClick={add}>Add Product</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {state.products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card/60 p-5 grid md:grid-cols-[96px_1fr_auto] gap-5 items-start shadow-sm">
            <div>
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-24 w-24 object-cover rounded-lg shadow-sm" />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-black/10 grid place-items-center text-xs">No image</div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="bg-white/10 text-foreground border-border hover:bg-white/20" onClick={async () => { const f = await pickFile(); if (!f) return; const d = await fileToDataUrl(f); setState((s: CMSState) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, image: d, asset: d } : x)) })); }}>Upload</Button>
                {p.image && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 shrink-0" onClick={() => setState((s: CMSState) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, image: "", asset: "" } : x)) }))}>Remove</Button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <input className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={p.name} onChange={(e) => setState((s: CMSState) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)) }))} />
              <textarea placeholder="Description" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2 h-20" value={p.description || ""} onChange={(e) => setState((s: CMSState) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, description: e.target.value } : x)) }))} />
              <select className="rounded-lg bg-black/30 border border-white/20 px-3 py-2 w-40" value={p.category} onChange={(e) => setState((s: CMSState) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, category: e.target.value } : x)) }))}>
                {"Sunglasses Eyeglasses Sports Fashion".split(" ").map((c) => (<option key={c}>{c}</option>))}
              </select>
            </div>
            <div className="md:ml-auto mt-2 md:mt-0 self-start justify-self-end">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 shrink-0" onClick={() => setState((s: CMSState) => ({ ...s, products: s.products.filter((x) => x.id !== p.id) }))}>Delete</Button>
            </div>
          </div>
        ))}
        {state.products.length === 0 && (<div className="text-white/60">No products added here. (Website products remain unchanged)</div>)}
      </div>
    </div>
  );
}

/* -------- Settings -------- */
function SettingsPanel({ state, setState }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const [u, setU] = useState<string>(localStorage.getItem("adminUsername") || "user1");
  const [p, setP] = useState<string>(localStorage.getItem("adminPassword") || "root");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
        <h3 className="font-semibold">Theme</h3>
        <div className="grid grid-cols-2 gap-3 items-center">
          <label className="text-sm">Mode</label>
          <select className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={state.theme.mode} onChange={(e) => setState((s: CMSState) => ({ ...s, theme: { ...s.theme, mode: e.target.value as any } }))}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <label className="text-sm">Primary (HSL)</label>
          <input className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={state.theme.primary} onChange={(e) => setState((s: CMSState) => ({ ...s, theme: { ...s.theme, primary: e.target.value } }))} placeholder="0 72% 45%" />
        </div>
        <p className="text-xs text-white/60">Tip: This maps to CSS variable --primary (HSL)</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
        <h3 className="font-semibold">Quick Editor Mode</h3>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.quickEdit.enabled} onChange={(e) => setState((s: CMSState) => ({ ...s, quickEdit: { enabled: e.target.checked } }))} /> Enable edit on site
        </label>
        <p className="text-xs text-white/60">When enabled, certain texts/images on the website can be edited in place.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
        <h3 className="font-semibold">Admin Credentials</h3>
        <div className="grid grid-cols-2 gap-3 items-center">
          <label className="text-sm">Username</label>
          <input className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={u} onChange={(e) => setU(e.target.value)} />
          <label className="text-sm">Password</label>
          <input type="password" className="rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={p} onChange={(e) => setP(e.target.value)} />
        </div>
        <div>
          <Button className="bg-[#980404] hover:bg-[#880404]" onClick={() => { localStorage.setItem("adminUsername", u); localStorage.setItem("adminPassword", p); toast.success("Credentials updated"); }}>Update Credentials</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-3 md:col-span-2">
        <h3 className="font-semibold">Activity Log</h3>
        <ul className="text-sm max-h-56 overflow-auto pr-1 space-y-2">
          {state.activity.map((a) => (
            <li key={a.id} className="flex items-center gap-2">
              <SparkleIcon className="size-3 text-[#ff5a5a]" />
              <span>{a.message}</span>
              <span className="ml-auto text-xs text-white/60">{new Date(a.at).toLocaleString()}</span>
            </li>
          ))}
          {state.activity.length === 0 && <li className="opacity-60">No activity yet.</li>}
        </ul>
      </div>
    </div>
  );
}

/* -------- Testimonials Manager -------- */
function TestimonialsManager({ state, setState, log }: { state: CMSState; setState: any; log: (m: string) => void }) {
  const add = () => {
    setState((s: CMSState) => ({
      ...s,
      testimonials: [{ id: uid(), quote: "New testimonial", name: "Anonymous" }, ...(s.testimonials || [])],
    }));
    log("Added testimonial");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Testimonials</h3>
        <Button className="bg-[#980404]" onClick={add}>Add</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(state.testimonials || []).map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
            <textarea className="w-full rounded-lg bg-black/30 border border-white/20 px-3 py-2 h-24" value={t.quote} onChange={(e) => setState((s: CMSState) => ({ ...s, testimonials: s.testimonials.map(x => x.id===t.id?{...x,quote:e.target.value}:x) }))} />
            <input className="w-full mt-2 rounded-lg bg-black/30 border border-white/20 px-3 py-2" value={t.name} onChange={(e) => setState((s: CMSState) => ({ ...s, testimonials: s.testimonials.map(x => x.id===t.id?{...x,name:e.target.value}:x) }))} />
            <div className="mt-3 flex gap-2">
              <Button className="bg-red-600" onClick={()=>setState((s: CMSState)=>({...s, testimonials: s.testimonials.filter(x=>x.id!==t.id)}))}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- Analytics -------- */
function AnalyticsPanel({ state }: { state: CMSState }) {
  const data = useMemo(() => [
    { name: "Mon", views: 80, clicks: 16 },
    { name: "Tue", views: 100, clicks: 24 },
    { name: "Wed", views: 120, clicks: 31 },
    { name: "Thu", views: 90, clicks: 18 },
    { name: "Fri", views: 150, clicks: 40 },
    { name: "Sat", views: 130, clicks: 30 },
    { name: "Sun", views: 110, clicks: 22 },
  ], []);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <h3 className="font-semibold">Banner Engagement</h3>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5a5a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff5a5a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <RTooltip contentStyle={{ background: "#111", border: "1px solid #333", color: "#fff" }} />
              <Area type="monotone" dataKey="views" stroke="#ff5a5a" fillOpacity={1} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <h3 className="font-semibold">Top Products (Clicks)</h3>
        <div className="h-56 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <RTooltip contentStyle={{ background: "#111", border: "1px solid #333", color: "#fff" }} />
              <Bar dataKey="clicks" fill="#ff5a5a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* -------- Icons (Lucide-like minimal) -------- */
function MenuIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function SunIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.5 6.5-1.5-1.5M8 7 6.5 5.5m9 0L16 7M8 17l-1.5 1.5" />
    </svg>
  );
}
function SparkleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l1.8 4.2L18 8l-4.2 1.8L12 14l-1.8-4.2L6 8l4.2-1.8L12 2Zm6 10 1.2 2.8L22 16l-2.8 1.2L18 20l-1.2-2.8L14 16l2.8-1.2L18 12Z" />
    </svg>
  );
}
function DashboardIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />
    </svg>
  );
}
function GalleryIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="m8 11 2 2 3-3 4 4" />
    </svg>
  );
}
function ContentIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h10M4 18h7" />
    </svg>
  );
}
function BannersIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 4h16v7l-4-2-4 2-4-2-4 2V4zM4 20h16" />
    </svg>
  );
}
function ServicesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.18a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8" />
    </svg>
  );
}
function ProductsIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    </svg>
  );
}
function AnalyticsIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="9" width="3" height="9" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  );
}
function SettingsIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.18a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8" />
    </svg>
  );
}

/* -------- utils -------- */
async function pickFile() {
  return new Promise<File | null>((resolve) => {
    const i = document.createElement("input");
    i.type = "file";
    i.accept = "image/*";
    i.onchange = () => resolve(i.files ? i.files[0] : null);
    i.click();
  });
}
function fileToDataUrl(file: File) {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}
