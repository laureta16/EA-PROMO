"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/shporta"];

const STORAGE_KEY = "eapromo_wa_pos_v2";
const SIZE = 56;
const MARGIN = 12;
const DRAG_THRESHOLD = 5; // px movement before treating as drag

type Pos = { x: number; y: number };

function clampToViewport(p: Pos): Pos {
  if (typeof window === "undefined") return p;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.min(Math.max(MARGIN, p.x), w - SIZE - MARGIN),
    y: Math.min(Math.max(MARGIN, p.y), h - SIZE - MARGIN),
  };
}

function defaultPos(): Pos {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: window.innerWidth - SIZE - 20,
    y: window.innerHeight - SIZE - 20,
  };
}

export function WhatsAppFab({
  phoneNumber,
  message = "Përshëndetje, dua të kërkoj një ofertë në EA Promo.",
}: {
  phoneNumber: string;
  message?: string;
}) {
  const pathname = usePathname();
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const hidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Load saved position
  useEffect(() => {
    let next: Pos | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Pos;
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          next = clampToViewport(parsed);
        }
      }
    } catch {}
    setPos(next ?? defaultPos());
  }, []);

  // Keep inside viewport on resize
  useEffect(() => {
    if (!pos) return;
    function onResize() {
      setPos((p) => (p ? clampToViewport(p) : p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos]);

  // Pointer move/up handlers
  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      const s = startRef.current;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (!s.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) s.moved = true;
      if (s.moved) {
        setPos(clampToViewport({ x: s.px + dx, y: s.py + dy }));
      }
    }
    function onUp(e: PointerEvent) {
      const s = startRef.current;
      const movedFlag = s?.moved ?? false;
      setDragging(false);
      try {
        btnRef.current?.releasePointerCapture(e.pointerId);
      } catch {}
      if (movedFlag) {
        // Persist new position
        setPos((p) => {
          if (p) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
            } catch {}
          }
          return p;
        });
      } else {
        // No drag → treat as click → open WhatsApp
        const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(href, "_blank", "noopener,noreferrer");
      }
      startRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, phoneNumber, message]);

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (!pos) return;
    e.preventDefault();
    try {
      (e.target as HTMLButtonElement).setPointerCapture(e.pointerId);
    } catch {}
    startRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y, moved: false };
    setDragging(true);
  }

  if (!pos || !phoneNumber || hidden) return null;

  return (
    <button
      ref={btnRef}
      type="button"
      onPointerDown={onPointerDown}
      aria-label="Bisedo në WhatsApp"
      title="Mbaj e zvarrit për të lëvizur · Klikim për të çelur chat-in"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: SIZE,
        height: SIZE,
        zIndex: 60,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      className="rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-500/40 grid place-items-center hover:scale-105 active:scale-95 transition-transform select-none"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.86 11.86 0 0012.04 0C5.46 0 .14 5.32.14 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.34-1.66a11.9 11.9 0 005.7 1.45h.01c6.58 0 11.9-5.32 11.9-11.9 0-3.18-1.24-6.17-3.43-8.41zM12.05 21.6h-.01a9.7 9.7 0 01-4.95-1.36l-.36-.21-3.76.99 1-3.66-.23-.38a9.7 9.7 0 01-1.49-5.18c0-5.36 4.36-9.72 9.72-9.72 2.6 0 5.04 1.01 6.87 2.85a9.65 9.65 0 012.84 6.87c.01 5.36-4.35 9.72-9.71 9.72zm5.33-7.28c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15s-.76.95-.93 1.15c-.17.2-.34.22-.63.07s-1.24-.46-2.36-1.46c-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.51l-.56-.01a1.08 1.08 0 00-.78.37c-.27.29-1.03 1.01-1.03 2.45 0 1.45 1.05 2.85 1.2 3.05.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34z" />
      </svg>
    </button>
  );
}
