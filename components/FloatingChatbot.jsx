"use client";
import { useState } from "react";
import ChatBot from "./ChatBot";
import { MessageCircle, X } from "lucide-react";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="
            fixed z-50
            bottom-[90px]
            right-4

            /* MOBILE FULL RESPONSIVE WIDTH */
            w-[95vw]              /* works for 320px screens */
            max-w-[380px]         /* desktop/tablet */

            /* MOBILE HEIGHT */
            h-[70vh]
            max-h-[520px]         /* prevent oversized */

            bg-white shadow-2xl
            rounded-xl border
            flex flex-col
            overflow-hidden
            animate-slide-up

            /* Center on extra-small screens */
            xs:right-1/2 xs:translate-x-1/2
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-xl">
            <h2 className="font-semibold">AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X size={24} />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 overflow-hidden">
            <ChatBot />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed z-50
          bottom-6 right-6

          /* Center bubble on very small mobile */
          xs:right-1/2 xs:translate-x-1/2

          bg-blue-600 hover:bg-blue-700
          text-white p-4 rounded-full shadow-lg
        "
      >
        <MessageCircle size={28} />
      </button>
    </>
  );
}
