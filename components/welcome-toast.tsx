"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("🛍️ Bienvenue chez Maison Atelier", {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            Découvrez nos univers déco et mobilier en français.{" "}
            <a href="/collections" className="text-blue-600 hover:underline">
              Parcourir les collections
            </a>
          </>
        ),
      });
    }
  }, []);

  return null;
}
