import { useState } from "react";

type Box = "received" | "sent";

export default function MyMessages() {
  const [activeBox, setActiveBox] = useState<Box>("received");

  return (
    <div className="space-y-4">
      <div className="bg-surface-container rounded-2xl p-1 flex gap-1 w-fit">
        {(["received", "sent"] as const).map((box) => (
          <button
            key={box}
            onClick={() => setActiveBox(box)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeBox === box
                ? "bg-surface-container-lowest text-on-surface shadow-card"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {box === "received" ? "받은쪽지함" : "보낸쪽지함"}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card flex flex-col items-center justify-center py-20 gap-3">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">mail</span>
        <p className="text-sm font-semibold text-on-surface-variant">
          {activeBox === "received" ? "받은 쪽지가 없습니다" : "보낸 쪽지가 없습니다"}
        </p>
      </div>
    </div>
  );
}
