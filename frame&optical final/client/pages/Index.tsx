import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lightweight autoplay carousel
function useCarousel(length: number, interval = 4500) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (length <= 1) return;
    timer.current = window.setInterval(
      () => setIndex((i) => (i + 1) % length),
      interval,
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [length, interval]);
  return { index, setIndex } as const;
}

const slides = [
  {
    title: "Premium Sunglasses Collection",
    subtitle:
      "Discover curated sunglasses for every style with full UV protection and crystal‑clear lenses.",
    img: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fb6dd0ab39ce94507a8ec0352834baa30",
    alt: "Woman wearing sunglasses",
  },
  {
    title: "Designer Optical Glasses",
    subtitle:
      "Elegant optical frames with precision lenses for everyday comfort and lasting clarity.",
    img: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F397dc99caeae430e93b7cb3c142f1ee1",
    alt: "Senior woman with optical glasses using phone",
  },
  {
    title: "Comprehensive Eye Check",
    subtitle:
      "Advanced eye examinations and diagnostics performed by certified specialists.",
    img: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F83d85f7954c6493ab57ccca5aadcdfdd",
    alt: "Child receiving eye test",
  },
];

const productAssets = [
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F8b5ec95600f347439cf622a0b61837b6?format=webp&width=800", // Police
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fbcce344cf7a544ff8508506f8c3cdff9?format=webp&width=800", // Gucci
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F7eed013254fc438cb77a5e34a3cd12ad?format=webp&width=800", // Prada
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F523237b1535e421a96fd341b72714219?format=webp&width=800", // Hugo
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F37454ff2d4fe403c84a151c68fd0cd13?format=webp&width=800", // RayBan optical
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F63e4ae6b98574a3fb1dfbf1b523152ea?format=webp&width=800", // RayBan round optical
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F57a0beefbb1d4026b266027288a25a97?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F9c374db8095d4cda898adf7355be6be1?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F4de3fcae6f2e49579600c08a9913ebac?format=webp&width=800",
];

const brandLogos: Record<string, string> = {
  "Ray‑Ban": "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Ffb7f4c4a68874f5e844ef55993586b9d?format=webp&width=800",
  Oakley: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F25aef494d672486aad847627a1a830a2?format=webp&width=800",
  Gucci: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F3035fb0c1f764952b6007a3f44ac84bd?format=webp&width=800",
  Prada: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fa9b2f057f97340acb2a94c066aaeb346?format=webp&width=800",
  Police: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fddc7960a9d0f4e8d8507af30a5a0855a?format=webp&width=800",
  HUGO: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'%3E%3Crect width='200' height='80' fill='transparent'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Helvetica, Arial, sans-serif' font-weight='700' font-size='36' fill='%23000'%3EHUGO%3C/text%3E%3C/svg%3E",
};

function responsiveSrc(url: string, widths = [400, 800, 1200]) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return "";
  return widths
    .map((w) => {
      if (url.includes("width=")) return url.replace(/width=\d+/, `width=${w}`) + ` ${w}w`;
      return url + (url.includes("?") ? `&width=${w}` : `?width=${w}`) + ` ${w}w`;
    })
    .join(", ");
}

const products = [
  // Sunglasses (4)
  {
    name: "Wayfarer Classic",
    brand: "Ray‑Ban",
    category: "Sunglasses",
    tags: ["UV400", "Polarized"],
    img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[0],
  },
  {
    name: "Oversize Glam",
    brand: "Gucci",
    category: "Sunglasses",
    tags: ["Gradient", "Anti‑glare"],
    img: "https://images.unsplash.com/photo-1519305122291-5df2170d4870?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[1],
  },
  {
    name: "Skyline",
    brand: "Police",
    category: "Sunglasses",
    tags: ["Lightweight", "Scratch‑resist"],
    img: "https://images.unsplash.com/photo-1503342452485-86ff0a6a56c3?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[0],
  },
  {
    name: "Shield Pro",
    brand: "Oakley",
    category: "Sunglasses",
    tags: ["Prizm", "Wrap"],
    img: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[2],
  },
  // Eyeglasses (4)
  {
    name: "Round Optics",
    brand: "Ray‑Ban",
    category: "Eyeglasses",
    tags: ["Blue‑light", "Featherweight"],
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[5],
  },
  {
    name: "Modern Square",
    brand: "HUGO",
    category: "Eyeglasses",
    tags: ["Acetate", "Slim"],
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[3],
  },
  {
    name: "Metal Minimal",
    brand: "Gucci",
    category: "Eyeglasses",
    tags: ["Titanium", "Nose‑pads"],
    img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[1],
  },
  {
    name: "Rectangular Pro",
    brand: "Prada",
    category: "Eyeglasses",
    tags: ["Ultra‑thin", "Flex‑hinge"],
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[2],
  },
  // Sports (4)
  {
    name: "Radar EV",
    brand: "Oakley",
    category: "Sports",
    tags: ["Impact‑resist", "Anti‑fog"],
    img: "https://images.unsplash.com/photo-1531418511550-18d9d3f62f53?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[6],
  },
  {
    name: "Sprint Pro",
    brand: "Police",
    category: "Sports",
    tags: ["Wrap", "Hydrophobic"],
    img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[0],
  },
  {
    name: "Trail Shield",
    brand: "Ray‑Ban",
    category: "Sports",
    tags: ["Ventilated", "Grip"],
    img: "https://images.unsplash.com/photo-1504199367641-aba8151afaae?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[4],
  },
  {
    name: "Aero Glide",
    brand: "Prada",
    category: "Sports",
    tags: ["Carbon", "Ergonomic"],
    img: "https://images.unsplash.com/photo-1520975968319-92965e0b9b1f?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[2],
  },
  // Fashion (4)
  {
    name: "Cat‑Eye Muse",
    brand: "Gucci",
    category: "Fashion",
    tags: ["Statement", "Gloss"],
    img: "https://images.unsplash.com/photo-1543872130-b7b0df31bc34?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[1],
  },
  {
    name: "Clubmaster Special",
    brand: "Ray‑Ban",
    category: "Fashion",
    tags: ["Retro", "Polished"],
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[4],
  },
  {
    name: "Logo Accent",
    brand: "HUGO",
    category: "Fashion",
    tags: ["Sleek", "Signature"],
    img: "https://images.unsplash.com/photo-1520975612208-98b96fe2ca7c?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[3],
  },
  {
    name: "Linea Rossa",
    brand: "Prada",
    category: "Fashion",
    tags: ["Sport-lux", "Mirror"],
    img: "https://images.unsplash.com/photo-1519305122291-5df2170d4870?auto=format&fit=crop&w=1400&q=80",
    asset: productAssets[2],
  },
];

const team = [
  {
    name: "Dr. Sarah Ahmed",
    role: "Optometrist (Consultant)",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Omar Hassan",
    role: "Eyewear Specialist",
    img: "https://images.unsplash.com/photo-1544717305-996b815c338c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Fatima Az-Zahra",
    role: "Lens Consultant",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
  },
];

const testimonials = [
  {
    quote:
      "Exceptional service and quality frames. The team helped me choose the perfect pair.",
    name: "Ahmed Al-Ansari",
  },
  {
    quote:
      "The detailed eye examination and expert advice made all the difference.",
    name: "Sarah Johnson",
  },
  {
    quote: "Fast service, great selection, and very friendly staff.",
    name: "Mohammed Hassan",
  },
];

function aiImageForProduct(p: {
  name: string;
  brand: string;
  category: string;
}) {
  const prompt = `${p.brand} ${p.name} ${p.category} eyewear, studio product photo, high detail, 4k, centered, white background`;
  return `https://image.pollinations.ai/prompt=${encodeURIComponent(prompt)}`;
}

function primaryProductImg(p: any) {
  return p.asset || p.img || aiImageForProduct(p);
}

export default function Index() {
  const [cms, setCms] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem("adminCMS") || "null");
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const fn = () => {
      try {
        setCms(JSON.parse(localStorage.getItem("adminCMS") || "null"));
      } catch {}
    };
    const onCustom = () => fn();
    window.addEventListener("storage", fn);
    window.addEventListener("adminCMS:updated", onCustom as any);
    return () => {
      window.removeEventListener("storage", fn);
      window.removeEventListener("adminCMS:updated", onCustom as any);
    };
  }, []);

  // Layout order (reorderable from Admin)
  const defaultLayout = [
    "hero",
    "homepage_banner",
    "about",
    "collection",
    "services",
    "testimonials",
    "partners",
    "contact",
  ] as const;
  const allowed = new Set(defaultLayout as readonly string[]);
  const layout: string[] = (Array.isArray(cms?.layout) && cms.layout.length
    ? cms.layout.filter((k: string) => allowed.has(k))
    : [...defaultLayout]) as string[];

  // Hero carousel
  const { index, setIndex } = useCarousel(slides.length, 3000);
  const dots = useMemo(() => new Array(slides.length).fill(0), []);

  // Products grid state
  const categories = [
    "All",
    "Sunglasses",
    "Eyeglasses",
    "Sports",
    "Fashion",
  ] as const;
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const productsSource = useMemo(() => {
    try {
      if (cms?.products && Array.isArray(cms.products) && cms.products.length > 0) {
        return cms.products.map((p: any) => ({
          name: p.name || "Untitled",
          brand: p.brand || "",
          category: p.category || "Sunglasses",
          tags: p.tags || [],
          img: p.image || p.img || (p.asset ? p.asset : ""),
          asset: p.image || p.asset || p.img || "",
          description: p.description || "",
        }));
      }
    } catch {}
    return products;
  }, [cms]);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "All"
        ? productsSource
        : productsSource.filter((p: any) => p.category === activeCategory),
    [activeCategory, productsSource],
  );

  const initialCount = 6;
  const [showAll, setShowAll] = useState(false);
  useEffect(() => setShowAll(false), [activeCategory]);
  const visibleProducts = useMemo(
    () => (showAll ? filteredProducts : filteredProducts.slice(0, initialCount)),
    [showAll, filteredProducts],
  );

  // Product details modal state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, []);

  const testimonialsSrc = cms?.testimonials && cms.testimonials.length ? cms.testimonials : testimonials;

  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return (
          <section id="home" aria-label="Hero" className="relative" key="hero">
            <div className="hero-section relative h-[60vh] min-h-[320px] sm:h-[75vh] sm:min-h-[560px] overflow-hidden bg-black">
              {slides.map((s, i) => (
                <img
                  key={i}
                  src={s.img}
                  alt={s.alt ?? "Slide image"}
                  decoding="async"
                  fetchPriority={i === index ? "high" : i === 0 ? "high" : "low"}
                  className={cn(
                    "absolute inset-0 size-full object-cover object-top transition-opacity duration-700",
                    i === index ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

              <div className="container relative z-20 h-full flex items-end sm:items-center py-8 sm:py-0">
                <div className="max-w-xl text-white">
                  <h1
                    className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                    onClick={() => {
                      const s = JSON.parse(localStorage.getItem("adminCMS") || "null");
                      if (s?.quickEdit?.enabled) {
                        const next = prompt(
                          "Edit hero title",
                          cms?.content?.hero_title?.text || slides[index].title,
                        );
                        if (next != null) {
                          const ns = {
                            ...s,
                            content: {
                              ...s.content,
                              hero_title: {
                                ...(s.content?.hero_title || {}),
                                text: next,
                              },
                            },
                          };
                          localStorage.setItem("adminCMS", JSON.stringify(ns));
                          setCms(ns);
                        }
                      }
                    }}
                  >
                    {cms?.content?.hero_title?.text ?? slides[index].title}
                  </h1>
                  <p
                    className="mt-3 text-white/80 text-sm sm:text-base"
                    onClick={() => {
                      const s = JSON.parse(localStorage.getItem("adminCMS") || "null");
                      if (s?.quickEdit?.enabled) {
                        const next = prompt(
                          "Edit hero subtitle",
                          cms?.content?.hero_subtitle?.text || slides[index].subtitle,
                        );
                        if (next != null) {
                          const ns = {
                            ...s,
                            content: {
                              ...s.content,
                              hero_subtitle: {
                                ...(s.content?.hero_subtitle || {}),
                                text: next,
                              },
                            },
                          };
                          localStorage.setItem("adminCMS", JSON.stringify(ns));
                          setCms(ns);
                        }
                      }
                    }}
                  >
                    {cms?.content?.hero_subtitle?.text ?? slides[index].subtitle}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="bg-primary text-primary-foreground">
                      <a href="#contact">Book Appointment</a>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                      <a href="#collection">Explore Collection</a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                {dots.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      i === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      case "homepage_banner":
        return cms?.banners?.placements?.some((p: any) => p.location === "homepage_top" && p.image) ? (
          <section className="container py-6" key="homepage_banner">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {cms.banners.placements
                .filter((p: any) => p.location === "homepage_top" && p.image)
                .map((p: any) => (
                  <img key={p.id} src={p.image} alt={p.alt || "Banner"} className="w-full max-h-48 object-cover" />
                ))}
            </div>
          </section>
        ) : null;
      case "about":
        return (
          <section id="about" className="container relative py-20 text-neutral-900 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:bg-white before:-z-10" key="about">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight">About Lens & Frame Optics</h2>
                <div className="mt-2 h-1 w-24 bg-[#900404] rounded-full" />
                <p className="mt-4 text-neutral-700">
                  We combine medical expertise with fashion‑forward curation. From comprehensive eye exams to perfectly
                  fitted designer frames, our team delivers clarity, comfort, and style.
                </p>
                <p className="mt-3 text-neutral-700">
                  Our clinic serves everyone from kids to seniors with bilingual staff and a warm, consultative approach.
                  We carry leading global brands and operate an on‑site edging lab for same‑day lenses and quick repairs.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { k: "10k+", v: "Frames in stock" },
                    { k: "4.9★", v: "Customer rating" },
                    { k: "24h", v: "Quick repairs" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg bg-[#900404] text-white py-4 shadow-sm ring-1 ring-white/10">
                      <div className="text-xl font-bold">{s.k}</div>
                      <div className="text-xs text-white/90">{s.v}</div>
                    </div>
                  ))}
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { title: "Premium Quality", desc: "Authentic brands and precision lenses" },
                    { title: "Expert Team", desc: "Certified optometrists & stylists" },
                    { title: "Same‑Day Service", desc: "Fast lens fitting and repairs" },
                    { title: "Warranty Protection", desc: "Coverage on frames and lenses" },
                  ].map((f) => (
                    <div key={f.title} className="group rounded-xl p-5 shadow-md border-2 border-[#900404]/20 bg-white hover:border-[#900404] hover:bg-[#900404] hover:text-white transition cursor-pointer" >
                      <dt className="font-semibold text-neutral-900 group-hover:text-white">{f.title}</dt>
                      <dd className="text-sm mt-1 text-neutral-600 group-hover:text-white/90">{f.desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F0e0e26b063ac424696598121d52c2474?format=webp&width=800"
                  alt="Eye care"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 540px"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-primary/20 blur-2xl" />
              </div>
            </div>
          </section>
        );
      case "collection":
        return (
          <section id="collection" className="py-20 bg-neutral-900 text-white" key="collection">
            <div className="container">
              <div className="text-center">
                <h2 className="text-3xl font-bold">Premium Collection</h2>
                <p className="mt-2 text-white/70">Discover curated designer eyewear from the world's most prestigious brands.</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        activeCategory === c ? "bg-primary text-primary-foreground" : "bg-white/10 hover:bg-white/20",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((p: any, _i: number) => (
                  <article key={p.id ?? `${p.name}-${_i}`} className="group rounded-xl bg-neutral-800/80 border border-white/10 overflow-hidden shadow-lg">
                    <div className="relative">
                      <img
                        src={primaryProductImg(p)}
                        srcSet={responsiveSrc(primaryProductImg(p))}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="h-40 sm:h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const fb = parseInt((img as any).dataset.fallback || "0", 10);
                          if (fb === 0) {
                            (img as any).dataset.fallback = "1";
                            img.src = (p as any).img || aiImageForProduct(p);
                          } else if (fb === 1) {
                            (img as any).dataset.fallback = "2";
                            img.src = aiImageForProduct(p);
                          } else {
                            img.src =
                              "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=80";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide bg-white/90 text-neutral-900">{p.brand}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-white/10 text-white">{p.category}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold">{p.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tags.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/10">{t}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center justify-center gap-2">
                          {brandLogos[p.brand] && (
                            <div className="rounded-lg shadow-sm border border-white/10 overflow-hidden bg-white" style={{ width: "84px", height: "40px" }}>
                              <div className="flex items-center justify-center h-full px-2">
                                <img src={brandLogos[p.brand]} alt={`${p.brand} logo`} className="max-h-full w-auto object-contain" />
                              </div>
                            </div>
                          )}
                        </div>
                        <Button className="bg-primary text-primary-foreground" onClick={() => setSelectedProduct(p)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 text-center">
                {!showAll && filteredProducts.length > initialCount ? (
                  <Button variant="secondary" className="bg-white text-neutral-900 hover:bg-white/90" onClick={() => setShowAll(true)}>
                    View More
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        );
      case "services":
        return (
          <section id="services" className="container relative py-20 text-neutral-900 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:bg-white before:-z-10" key="services">
            <h2 className="text-3xl font-bold text-center">Our Services</h2>
            <p className="text-center text-neutral-700 mt-2">Complete eye care with three specialized services—each paired with real imagery for a clear look at what we do.</p>
            <div className="mt-12 space-y-16">
              {[
                {
                  title: "Eye Exams & Prescription Lenses",
                  desc: "Comprehensive vision testing using modern diagnostics with clear prescriptions crafted to your needs.",
                  bullets: ["Full refraction & retinal screening", "Kid‑friendly and adult checkups", "Same‑day lens edging available"],
                  imgs: [
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F2689fb60da5048d39bf6d60897c8cef7?format=webp&width=800",
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F6fd20db586ad4296a32db760976cf3c4?format=webp&width=800",
                  ],
                },
                {
                  title: "Sunglasses & Fashion Eyewear",
                  desc: "Curated designer sunglasses and optical styles for all ages—kids and adults—with UV protection and comfort.",
                  bullets: ["Top brands: Ray‑Ban, Gucci, Prada, Oakley", "Personal styling & perfect fit", "Warranty and after‑care"],
                  imgs: [
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F5cad541b88484394bdfd7cc439dc4ebe?format=webp&width=800",
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F883ea17be58b4d4d98dbbeb6df96f54a?format=webp&width=800",
                  ],
                },
                {
                  title: "Contact Lens Care",
                  desc: "End‑to‑end lens fitting and guidance for daily, monthly, and specialty lenses with follow‑up support.",
                  bullets: ["Trial pairs & training", "Sensitive‑eyes solutions", "Ongoing care and re‑ordering"],
                  imgs: [
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F7718ad54fe80494c903b62fdd6a32d7d?format=webp&width=800",
                    "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fdf6fe91fc9bf4b30a5ca39349a53ed3a?format=webp&width=800",
                  ],
                },
              ].map((s, idx) => {
                const right = idx % 2 === 1;
                return (
                  <div key={s.title} className="grid md:grid-cols-2 gap-8 items-center">
                    <div className={cn("relative", right ? "md:order-2" : "")}> 
                      <img src={s.imgs[0]} alt={s.title} loading="lazy" decoding="async" className="h-56 sm:h-80 w-full object-cover rounded-2xl shadow-xl" />
                      <img src={s.imgs[1]} alt={`${s.title} secondary`} loading="lazy" decoding="async" className={cn("hidden sm:block absolute -bottom-6 rounded-xl shadow-lg ring-4 ring-white/60 object-cover", right ? "-left-6 w-40 h-40 md:w-56 md:h-40" : "-right-6 w-40 h-40 md:w-56 md:h-40")} />
                    </div>
                    <div className={cn(right ? "md:order-1" : "")}>
                      <h3 className="text-2xl font-semibold">{s.title}</h3>
                      <p className="mt-2 text-neutral-700">{s.desc}</p>
                      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                        {s.bullets.map((b: string) => (
                          <li key={b} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> {b}</li>
                        ))}
                      </ul>
                      <Button asChild variant="outline" className="mt-6 border border-neutral-900 text-neutral-900 inline-block">
                        <a href="#contact">Learn More</a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-14 rounded-3xl bg-[#900404] text-white p-12 md:p-14 min-h-[15rem] flex flex-col items-center justify-center gap-4 ring-1 ring-white/20">
              <div className="text-center max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-semibold">Ready to Experience Premium Eye Care?</h3>
                <p className="opacity-90 mt-2">Book your comprehensive eye exam today and discover the perfect eyewear solution for your lifestyle.</p>
              </div>
              <div className="mt-3 flex gap-3 flex-wrap justify-center">
                <Button asChild className="bg-white text-neutral-900 hover:bg-white/90 rounded-full px-6 py-3 h-auto shadow-lg shadow-white/20 ring-1 ring-white/20">
                  <a href="#contact">Book Appointment</a>
                </Button>
                <a href="tel:+97433509888"><Button variant="outline" className="bg-transparent text-white border border-white/60 hover:bg-white/10 rounded-full px-6 py-3 h-auto backdrop-blur-sm">Call +974 3350 9888</Button></a>
              </div>
            </div>
          </section>
        );
      case "testimonials":
        return (
          <section id="team" className="py-20 bg-neutral-900 text-white" key="testimonials">
            <div className="container">
              <h3 className="text-2xl font-bold text-center">What Our Customers Say</h3>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {testimonialsSrc.map((t: any, i: number) => (
                  <figure key={t.id ?? i} className="rounded-xl bg-neutral-800/80 border border-white/10 p-6">
                    <div className="flex gap-1 text-yellow-300">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="m12 17.3-5.44 3.3 1.44-6.2L3 9.9l6.36-.54L12 3.5l2.64 5.86 6.36.54-4 4.5 1.44 6.2L12 17.3Z" /></svg>
                      ))}
                    </div>
                    <blockquote className="mt-3 text-white/90">“{t.quote}”</blockquote>
                    <figcaption className="mt-3 text-sm text-white/70">— {t.name}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-6 text-center text-white/70">4.9 ★ — Happy customers</p>
            </div>
          </section>
        );
      case "partners":
        return (
          <section className="container relative py-16 text-neutral-900 before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:bg-white before:-z-10" key="partners">
            <h2 className="text-center text-2xl font-semibold">Our Trusted Eyewear Partners</h2>
            <div className="mt-8 relative overflow-hidden">
              <div className="mask-fade-x">
                <div className="flex items-center gap-20 animate-marquee-rtl" aria-label="Partner logos carousel">
                  {[
                    { alt: "Ray‑Ban", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Ffb7f4c4a68874f5e844ef55993586b9d?format=webp&width=800" },
                    { alt: "Oakley", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F25aef494d672486aad847627a1a830a2?format=webp&width=800" },
                    { alt: "Gucci", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F3035fb0c1f764952b6007a3f44ac84bd?format=webp&width=800" },
                    { alt: "Prada", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fa9b2f057f97340acb2a94c066aaeb346?format=webp&width=800" },
                    { alt: "Police", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fddc7960a9d0f4e8d8507af30a5a0855a?format=webp&width=800" },
                    { alt: "Polaroid", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F0d64e4d6a0d640d7988225ae3418809f?format=webp&width=800" },
                  ]
                    .concat([
                      { alt: "Ray‑Ban", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Ffb7f4c4a68874f5e844ef55993586b9d?format=webp&width=800" },
                      { alt: "Oakley", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F25aef494d672486aad847627a1a830a2?format=webp&width=800" },
                      { alt: "Gucci", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F3035fb0c1f764952b6007a3f44ac84bd?format=webp&width=800" },
                      { alt: "Prada", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fa9b2f057f97340acb2a94c066aaeb346?format=webp&width=800" },
                      { alt: "Police", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fddc7960a9d0f4e8d8507af30a5a0855a?format=webp&width=800" },
                      { alt: "Polaroid", src: "https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F0d64e4d6a0d640d7988225ae3418809f?format=webp&width=800" },
                    ])
                    .map((b, i) => (
                      <img key={i} src={b.src} alt={b.alt} loading="lazy" decoding="async" className="h-10 md:h-16 w-auto object-contain opacity-90" />
                    ))}
                </div>
              </div>
            </div>
          </section>
        );
      case "contact":
        return (
          <section id="contact" className="bg-neutral-900 text-white py-20" key="contact">
            <div className="container">
              <h2 className="text-3xl font-bold text-center">Get In Touch</h2>
              <p className="text-center text-white/70 mt-2">Ready to enhance your vision? Contact us today to schedule your appointment.</p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <form action="https://formspree.io/f/mrbadzjw" method="POST" className="rounded-xl bg-neutral-800/80 border border-white/10 p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-white/80">Your name</label>
                      <input className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="Full name" required />
                    </div>
                    <div>
                      <label className="text-sm text-white/80">Email</label>
                      <input type="email" name="email" className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" required />
                    </div>
                    <div>
                      <label className="text-sm text-white/80">Phone</label>
                      <input className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="(+974) 3350 9888" />
                    </div>
                    <div>
                      <label className="text-sm text-white/80">Service</label>
                      <select className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
                        <option>Eye Examination</option>
                        <option>Designer Eyewear</option>
                        <option>Contact Lenses</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Message</label>
                    <textarea name="message" className="mt-1 w-full rounded-md bg-black/30 border border-white/20 px-3 py-2 h-32 outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us more about your request" />
                  </div>
                  <Button className="bg-primary">Send Message</Button>
                </form>
                <div className="space-y-4">
                  <div className="rounded-xl bg-neutral-800/80 border border-white/10 p-6">
                    <h3 className="font-semibold">Contact Info</h3>
                    <ul className="mt-3 space-y-2 text-white/80 text-sm">
                      <li>
                        Phone: <a className="underline hover:text-white" href="tel:+97433509888">+974 3350 9888</a>
                      </li>
                      <li>
                        Email: <a className="underline hover:text-white" href="mailto:Lensandframesqa@gmail.com">Lensandframesqa@gmail.com</a>
                      </li>
                      <li>Address: Muntaza, Near Al Meera, Doha, Qatar</li>
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      title="Map"
                      className="w-full h-56 sm:h-64"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ pointerEvents: "auto" }}
                      src="https://www.google.com/maps?q=25.2820595,51.4967488&z=17&output=embed"
                      tabIndex={0}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <main id="home" className="min-h-screen">
      {layout.map((k) => (
        <Fragment key={k}>{renderSection(k)}</Fragment>
      ))}

      {selectedProduct && (
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === modalRef.current) setSelectedProduct(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 max-w-3xl w-full rounded-2xl overflow-hidden bg-neutral-900 text-white shadow-2xl">
            <div className="flex items-start gap-4 p-4">
              <div className="w-1/2">
                <img src={primaryProductImg(selectedProduct)} srcSet={responsiveSrc(primaryProductImg(selectedProduct))} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-md" />
              </div>
              <div className="w-1/2 p-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <button aria-label="Close" onClick={() => setSelectedProduct(null)} className="text-white/70 hover:text-white">✕</button>
                </div>
                <div className="mt-2 text-sm text-white/80">Category: {selectedProduct.category}</div>
                <div className="mt-2 text-sm text-white/80">Brand: {selectedProduct.brand}</div>
                <p className="mt-4 text-white/90">
                  {selectedProduct.description || `Discover the ${selectedProduct.name} from ${selectedProduct.brand}. It features ${selectedProduct.tags?.join(", ") || "premium materials"} and is designed for comfort and style.`}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(selectedProduct.tags || []).map((t: string) => (
                    <span key={t} className="px-2 py-1 rounded-full bg-white/10 text-xs">{t}</span>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-3">
                  <Button asChild className="bg-white text-neutral-900">
                    <a href="#contact" onClick={() => { setSelectedProduct(null); }}>Book Appointment</a>
                  </Button>
                  <a href={`tel:+97433509888`}>
                    <Button variant="outline">Call +974 3350 9888</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
