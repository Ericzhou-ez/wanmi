/**
 * This logic is SHIT replace ASAP
 */
"use client";

import { useEffect, useState } from "react";

const COUPON_CODE = "WANMI-SUMMER-2026-CHAISE-LOUGE";
const COUNTDOWN_TARGET = new Date("2026-05-10T00:00:00.000Z").getTime();

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

const getCountdown = (): Countdown => {
  const diff = COUNTDOWN_TARGET - Date.now();
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
  };
};

const pad = (value: number) => String(value).padStart(2, "0");

export function PromoStrip() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = COUPON_CODE;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (countdown.expired) {
    return null;
  }

  return (
    <div className="relative left-1/2 right-1/2 mb-2 w-screen -translate-x-1/2 border-b border-white/20 bg-black">
      <div className="w-full px-4 lg:px-6">
        <div className="flex w-full flex-col items-center gap-y-1.5 py-1 text-[11px] text-white md:flex-row md:gap-x-2 md:text-xs">
          <p className="text-center font-medium leading-none md:text-left">
            -20% sur les articles de la collection chaise lounge 2026.
          </p>
          <div className="mx-auto flex items-center gap-2 md:ml-auto md:mr-0">
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold tabular-nums">
              {`${countdown.days}j ${pad(countdown.hours)}h ${pad(
                countdown.minutes,
              )}min ${pad(countdown.seconds)}s`}
            </span>
            <button
              type="button"
              onClick={copyCode}
              aria-label={`Copier le code promo ${COUPON_CODE}`}
              className="rounded-full border border-white/45 px-2.5 py-0.5 font-semibold text-white transition-colors"
            >
              {copied ? "Code copié" : "Copier le code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
