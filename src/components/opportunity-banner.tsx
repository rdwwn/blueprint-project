"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { OrgFavicon } from "@/components/org-favicon";

const FIELD_BANNERS: Record<string, string> = {
  "CS & Engineering": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=70",
  "Medicine & Health": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=70",
  "Business & Finance": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=70",
  "Law, Politics & Public": "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=70",
  "Arts, Design & Music": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=70",
  "Space, Earth & Environment": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=70",
  "Journalism & Media": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=70",
  "Education & Teaching": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70",
  "Humanities & Social Science": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=70",
  "Math, Physics & Materials": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=70",
  "Foreign Languages & Linguistics": "https://images.unsplash.com/photo-1431274172765-f6689d12c85f?auto=format&fit=crop&w=1600&q=70",
  "Psychology & Neuroscience": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=70",
  "Gaming & Esports": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=70",
  "Sports & Athletics": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=70",
  "Agriculture & Food": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=70",
  "Theater, Film & Writing": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=70",
  "International": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=70",
};

const FIELD_COLORS: Record<string, string> = {
  "CS & Engineering": "bg-[#1e58d6]",
  "Medicine & Health": "bg-[#065f46]",
  "Business & Finance": "bg-[#92400e]",
  "Law, Politics & Public": "bg-[#5b21b6]",
  "Arts, Design & Music": "bg-[#9d174d]",
  "Space, Earth & Environment": "bg-[#0e7490]",
  "Journalism & Media": "bg-[#be123c]",
  "Education & Teaching": "bg-[#0f766e]",
  "Humanities & Social Science": "bg-[#4338ca]",
  "Math, Physics & Materials": "bg-[#1d4ed8]",
  "Foreign Languages & Linguistics": "bg-[#7c3aed]",
  "Psychology & Neuroscience": "bg-[#c2410c]",
  "Gaming & Esports": "bg-[#7c2d12]",
  "Sports & Athletics": "bg-[#166534]",
  "Agriculture & Food": "bg-[#3f6212]",
  "Theater, Film & Writing": "bg-[#9333ea]",
  "International": "bg-[#0369a1]",
};

const CATEGORY_COLORS: Record<string, string> = {
  Internship: "bg-[#1e58d6]",
  Scholarship: "bg-[#065f46]",
  Competition: "bg-[#0f766e]",
  Fellowship: "bg-[#92400e]",
};

export function OpportunityBanner({ url, field, category, org, name }: { url: string; field: string | null; category: string | null; org: string | null; name: string }) {
  const fieldColor = FIELD_COLORS[field ?? ""] ?? "bg-[#1e58d6]";
  const bannerImage = FIELD_BANNERS[field ?? ""] ?? "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=70";
  const [faviconError, setFaviconError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hostname = (() => {
    try { return new URL(url).hostname; } catch { return null; }
  })();
  const faviconUrl = hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=64` : null;

  return (
    <div className={cn("relative h-48 w-full overflow-hidden sm:h-72", fieldColor)}>
      {!imageError && (
        <img
          src={bannerImage}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      <div aria-hidden className="blueprint-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
            {faviconUrl && !faviconError ? (
              <img
                src={faviconUrl}
                alt=""
                className="h-10 w-10 rounded-lg"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <OrgFavicon host={null} name={org ?? name} size={40} />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-white drop-shadow-md sm:text-xl">{name}</p>
            {org && <p className="mt-1 text-sm text-white/80 drop-shadow-sm">{org}</p>}
          </div>
        </div>
      </div>
      <div className={cn("absolute inset-x-0 top-0 h-1", CATEGORY_COLORS[category ?? ""] ?? "bg-[#1e58d6]")} />
      {field && (
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {field}
          </span>
        </div>
      )}
      {category && (
        <div className="absolute bottom-4 right-4">
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
