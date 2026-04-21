"use client";

import { useState } from "react";

export default function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const preview = description.slice(0, 300);
  const isLong = description.length > 300;

  return (
    <div>
      <p>{expanded ? description : `${preview}${isLong ? "..." : ""}`}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[#08a05c] font-semibold text-xs hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
        >
          {expanded ? "Read Less ∧" : "Read More ∨"}
        </button>
      )}
    </div>
  );
}