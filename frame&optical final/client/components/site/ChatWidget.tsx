import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "bot" | "user"; text: string };

type Step =
  | "root"
  | "presc1"
  | "sun1"
  | "contact1"
  | "browse1"
  | "engage"
  | "next"
  | "done";

const STORAGE_KEY = "lf-chat-history";
const STORAGE_OPEN = "lf-chat-open";
const STORAGE_STEP = "lf-chat-step";

export default function ChatWidget() {
  const [navOpen, setNavOpen] = useState<boolean>(() => {
    if (typeof document !== "undefined") return document.body.classList.contains("nav-open");
    return false;
  });
  const [open, setOpen] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_OPEN) || "false");
    } catch {
      return false;
    }
  });
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        role: "bot",
        text: "👋 Hi there! Welcome to Lens & Frame Optics. How can I help you with your eyewear needs today?",
      },
      { role: "bot", text: "How can we help you today?" },
    ];
  });
  const [step, setStep] = useState<Step>(() => {
    try {
      return (localStorage.getItem(STORAGE_STEP) as Step) || "root";
    } catch {
      return "root";
    }
  });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  // Listen for nav open/close to avoid blocking UI
  useEffect(() => {
    const handler = (e: any) => setNavOpen(!!e?.detail?.open);
    window.addEventListener("nav:open", handler as any);
    return () => window.removeEventListener("nav:open", handler as any);
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem(STORAGE_OPEN, JSON.stringify(open));
  }, [open]);
  useEffect(() => {
    localStorage.setItem(STORAGE_STEP, step);
  }, [step]);

  // Auto scroll
  useEffect(() => {
    if (open)
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages, open]);

  const quickReplies = useMemo(() => {
    switch (step) {
      case "root":
        return [
          "Prescription Glasses",
          "Sunglasses",
          "Contact Lenses",
          "Just browsing 😊",
        ];
      case "presc1":
        return ["I have my prescription", "Book an eye test"];
      case "sun1":
        return ["Premium brands", "Budget-friendly"];
      case "contact1":
        return ["Daily disposables", "Long-term lenses"];
      case "browse1":
        return ["Best sellers", "New arrivals"];
      case "engage":
        return ["Yes, show me!", "Not now"];
      case "next":
        return [
          "Show available collections online",
          "Book an appointment",
          "Connect to live agent",
        ];
      default:
        return [];
    }
  }, [step]);

  function pushBot(text: string) {
    setMessages((m) => [...m, { role: "bot", text }]);
  }
  function pushUser(text: string) {
    setMessages((m) => [...m, { role: "user", text }]);
  }

  function handleQuick(choice: string) {
    pushUser(choice);
    if (/^(ok|thanks|thank you|bye)\b/i.test(choice)) {
      pushBot(
        "😊 You’re most welcome! Thanks for chatting with Lens & Frame Optics. Have a wonderful day! 🌟",
      );
      setStep("done");
      return;
    }

    if (step === "root") {
      if (choice === "Prescription Glasses") {
        pushBot(
          "Great choice! Do you already have your prescription, or would you like to book an eye test?",
        );
        setStep("presc1");
      } else if (choice === "Sunglasses") {
        pushBot(
          "😎 Perfect for style and protection! Would you like to see our premium brands or budget-friendly options?",
        );
        setStep("sun1");
      } else if (choice === "Contact Lenses") {
        pushBot(
          "Got it! Are you looking for daily disposables or long-term lenses?",
        );
        setStep("contact1");
      } else {
        pushBot(
          "No worries 😊 Would you like me to show you our best-sellers or new arrivals?",
        );
        setStep("browse1");
      }
      return;
    }

    if (step === "presc1") {
      pushBot(
        choice === "I have my prescription"
          ? "Excellent! I can show you frames that fit your prescription and style."
          : "We can book you for a comprehensive eye test at a time that suits you.",
      );
      pushBot(
        "By the way, we’re offering a special discount this week 🎉. Would you like details?",
      );
      setStep("engage");
      return;
    }

    if (step === "sun1" || step === "contact1" || step === "browse1") {
      pushBot("Great! I’ll tailor suggestions for you.");
      pushBot(
        "By the way, we’re offering a special discount this week 🎉. Would you like details?",
      );
      setStep("engage");
      return;
    }

    if (step === "engage") {
      if (choice === "Yes, show me!")
        pushBot("Awesome! This week: 10% off lenses with any frame purchase.");
      else pushBot("No problem — we’ll keep you posted next time.");
      pushBot("Would you like me to:");
      setStep("next");
      return;
    }

    if (step === "next") {
      if (choice === "Show available collections online") {
        pushBot("Opening our collections for you…");
        window.location.hash = "#collection";
      } else if (choice === "Book an appointment") {
        pushBot("Let’s get you booked. Redirecting to the form…");
        window.location.hash = "#contact";
      } else {
        pushBot("Connecting you to a live agent via WhatsApp…");
        window.open("https://wa.me/97433509888", "_blank");
      }
      pushBot(
        "😊 You’re most welcome! Thanks for chatting with Lens & Frame Optics. Have a wonderful day! 🌟",
      );
      setStep("done");
      return;
    }
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    pushUser(value);

    if (/^(ok|thanks|thank you|bye)\b/i.test(value)) {
      pushBot(
        "😊 You’re most welcome! Thanks for chatting with Lens & Frame Optics. Have a wonderful day! 🌟",
      );
      setStep("done");
      return;
    }

    // If user types freely, guide into next steps
    if (step === "root") {
      pushBot(
        "Got it! I can guide you through our collection or help you book an eye test.",
      );
      pushBot("Would you like me to:");
      setStep("next");
      return;
    }

    if (step !== "done") {
      pushBot("Thanks! I’ll tailor that for you. Would you like me to:");
      setStep("next");
    }
  }

  const iconButton = (
    <Button
      size="icon"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "h-12 w-12 rounded-full shadow-2xl text-white",
        "bg-[#E60000] hover:bg-[#cc0000]",
      )}
      aria-label={open ? "Close chat" : "Open chat"}
    >
      {open ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
        >
          <path d="M6.4 17.6 17.6 6.4l.8.8-11.2 11.2-.8-.8Zm0-10.4L17.6 18l.8-.8L7.2 6.4l-.8.8Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
        >
          <path d="M4 4h16a2 2 0 0 1 2 2v14l-4-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </svg>
      )}
    </Button>
  );

  return (
    <div className="fixed z-50 right-0 left-0 md:left-auto px-4 md:px-0 chat-widget pointer-events-none"
      style={{
        right: "calc(env(safe-area-inset-right, 0px) + 16px)",
        bottom: `calc(env(safe-area-inset-bottom, 0px) + ${navOpen ? 112 : 16}px)`,
      }}
    >
      {/* Chat window */}
      <div
        className={cn(
          "transition-all duration-300 origin-bottom-right pointer-events-auto",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
          "mx-auto md:mx-0 w-full md:w-[26rem]",
        )}
      >
        <div className="mb-3 md:mb-3 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/40 bg-white/70 backdrop-blur-xl">
          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 text-white bg-gradient-to-r from-[#E60000] to-[#b00000]">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500">
                {" "}
                <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />{" "}
              </span>
              <div className="font-semibold">
                Lens & Frame Optics – Online Now
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="opacity-90 hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M17.3 6.3 12 11.6 6.7 6.3 6.3 6.7l5.3 5.3-5.3 5.3.4.4 5.3-5.3 5.3 5.3.4-.4-5.3-5.3 5.3-5.3-.4-.4Z" />
              </svg>
            </button>
            <div
              className="pointer-events-none absolute inset-0 bg-white/10"
              style={{
                maskImage: "linear-gradient(to bottom, white, transparent)",
              }}
            />
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="max-h-[55vh] md:max-h-[50vh] overflow-y-auto p-4 space-y-3 bg-white"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "px-3 py-2 text-sm rounded-2xl max-w-[85%] shadow-sm",
                    m.role === "user"
                      ? "bg-[#E60000] text-white rounded-tr-md"
                      : "bg-[#F7F7F7] text-neutral-800 rounded-tl-md border",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick replies */}
            {quickReplies.length > 0 && step !== "done" && (
              <div className="flex flex-wrap gap-2 mt-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuick(q)}
                    className="px-3 py-1.5 text-sm rounded-full bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition-colors shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Footer CTA */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://wa.me/97433509888"
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button className="w-full bg-green-600 hover:bg-green-600/90 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 mr-2"
                  >
                    <path d="M12 2a10 10 0 1 0 0 20c1.8 0 3.5-.5 5-1.4l1.8.6-.6-1.7A9.9 9.9 0 0 0 22 12 10 10 0 0 0 12 2Zm5.4 14.2c-.2.6-1.2 1.1-1.7 1.1-.4 0-1 .2-3.4-1.1-2.9-1.6-4.7-4.5-4.9-4.7-.1-.2-1.1-1.4-1.1-2.6s.7-1.8 1-2c.2-.2.6-.3.9-.3h.2c.2 0 .3 0 .4.3.2.6.8 2 .8 2.1 0 .2.1.4 0 .6-.1.2-.2.4-.4.6l-.2.2c-.1.1-.3.2-.1.6.2.4.8 1.4 1.8 2.3 1.2 1.1 2.3 1.5 2.7 1.7.3.1.5.1.7-.1l.5-.5c.2-.2.4-.2.6-.1.2.1 1.6.8 1.9.9.3.1.5.2.6.3.1.3.1.7 0 .8Z" />
                  </svg>
                  Chat on WhatsApp
                </Button>
              </a>
              <a href="tel:+97433509888" className="inline-flex">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-[#E60000] text-[#E60000] hover:bg-[#E60000] hover:text-white"
                >
                  📞 Call +974 3350 9888
                </Button>
              </a>
            </div>
          </div>

          {/* Input */}
          {step !== "done" && (
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 p-3 bg-white/80"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#E60000]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="h-10 w-10 rounded-full grid place-items-center text-white bg-[#E60000] hover:bg-[#cc0000] shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M3.4 20.6 21 12 3.4 3.4 3 10l11 2-11 2 .4 6.6Z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating Icon */}
      <div className="fixed z-[60] pointer-events-auto"
        style={{
          right: "calc(env(safe-area-inset-right, 0px) + 16px)",
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${navOpen ? 112 : 16}px)`,
        }}
      >
        {iconButton}
      </div>
    </div>
  );
}
