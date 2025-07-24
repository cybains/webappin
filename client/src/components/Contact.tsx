"use client";

import { useState, useEffect } from "react";

export default function ContactSection() {
  const [showEmail, setShowEmail] = useState(false);
  const [showCallMsg, setShowCallMsg] = useState(false);
  const [showPhew, setShowPhew] = useState(false);
  const [lifted, setLifted] = useState(false);
  const email = "support@sufoniq.com";

  useEffect(() => {
    if (showEmail || showCallMsg) {
      setLifted(true);
    }
  }, [showEmail, showCallMsg]);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  const handleEmailClick = () => {
    copyEmailToClipboard();
    setLifted(true);
    setTimeout(() => setShowEmail(true), 300); // delay message
    setShowCallMsg(false);
    setShowPhew(false);

    setTimeout(() => {
      setShowEmail(false);
      setLifted(false);
    }, 4000);
  };

  const handleCallClick = () => {
    copyEmailToClipboard();
    setLifted(true);
    setTimeout(() => setShowCallMsg(true), 300); // delay message
    setShowEmail(false);
    setTimeout(() => setShowPhew(true), 2500);
    setTimeout(() => {
      setShowCallMsg(false);
      setShowPhew(false);
      setLifted(false);
    }, 4000);
  };

  return (
    <section
      className="py-20 px-6 text-center bg-background text-foreground relative overflow-hidden"
      id="contact"
    >
      {/* Floating Text */}
      <div
        className={`transition-transform duration-500 ease-in-out mb-6 ${
          lifted ? "-translate-y-6" : "translate-y-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Still got questions?
        </h2>
        <p className="text-base text-muted-foreground">
          Reach out and we'll get back with answers, wit, and maybe snacks.
        </p>
      </div>

      {/* Reserved Space for Messages */}
      <div className="h-[110px] sm:h-[100px] md:h-[90px] transition-all duration-500 ease-in-out">
        {showEmail && (
          <div className="animate-fadeIn transition-opacity">
            <p className="text-xl font-semibold text-black drop-shadow-sm">
              {email}
            </p>
            <p className="text-zinc-500 mt-2 text-sm italic tracking-wide">
              Email copied to your clipboard for convenience purposes.
            </p>
          </div>
        )}

        {showCallMsg && (
          <div className="animate-fadeIn transition-opacity">
            <p className="text-sm italic text-yellow-600">
              Sorry man, we only kinda do emails.
            </p>
            <p className="text-zinc-500 mt-1 text-sm italic tracking-wide">
              Email copied to your clipboard for convenience purposes.
            </p>
            {showPhew && (
              <p className="text-sm mt-1 text-muted-foreground italic">
                Phew, that real heart to heart is tough.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleEmailClick}
          className="bg-primary text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 hover:text-black hover:font-bold transition"
        >
          Email Us
        </button>
        <button
          onClick={handleCallClick}
          className="border border-primary text-primary font-semibold py-2 px-6 rounded-full hover:bg-primary hover:text-white transition"
        >
          Call Us
        </button>
      </div>

      {/* Custom animation class */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
