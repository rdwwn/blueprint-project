"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map as MapIcon, Navigation } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { geocodeLocation, isOnlineLocation } from "@/lib/geocoded-locations";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

// Mapbox access token, read from the environment (never hardcode it in
// source, GitHub blocks pushes containing tokens). Set NEXT_PUBLIC_MAPBOX_TOKEN
// in .env.local for local dev (see .env.example) and in the Vercel project's
// environment variables for production. Restrict the token to your domains in
// the Mapbox dashboard (account.mapbox.com/access-tokens).
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const US_CENTER: [number, number] = [-98.5, 39.8];

function escapeHtml(s: string): string {
  return s.replace(/[&<>&quot;&apos;]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}

function buildPopupHTML(program: Opportunity): string {
  const slug = slugify(program.name);
  const faviconUrl = program.host
    ? `https://www.google.com/s2/favicons?domain=${program.host}&sz=64`
    : "";
  const cat = program.category ? `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#0f766e18;color:#0f766e;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">${escapeHtml(program.category)}</span>` : "";
  return `
    <div style="min-width:240px;font-family:system-ui,-apple-system,sans-serif;padding:4px 2px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        ${faviconUrl ? `<img src="${faviconUrl}" alt="" style="width:32px;height:32px;border-radius:8px;flex-shrink:0;border:1px solid #e3ddcf;padding:2px;background:white"/>` : ""}
        <div style="min-width:0;flex:1">
          ${cat}
          <p style="font-size:14px;font-weight:600;margin:0 0 4px;color:#1b2a4a;line-height:1.3">${escapeHtml(program.name)}</p>
          ${program.org ? `<p style="font-size:11px;color:#5d6b80;margin:0 0 8px">${escapeHtml(program.org)}</p>` : ""}
          <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;color:#5d6b80">
            ${program.deadline ? `<span style="display:inline-flex;align-items:center;gap:3px">⏱ ${escapeHtml(program.deadline)}</span>` : ""}
            ${program.location ? `<span style="display:inline-flex;align-items:center;gap:3px">📍 ${escapeHtml(program.location)}</span>` : ""}
          </div>
          <a href="/opportunity/${slug}" style="display:inline-flex;align-items:center;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:#1e58d6;text-decoration:none">View program →</a>
        </div>
      </div>
    </div>
  `;
}

function createTeardropMarker(program: Opportunity): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "blueprint-teardrop";
  el.title = program.name;

  const faviconUrl = program.host
    ? `https://www.google.com/s2/favicons?domain=${program.host}&sz=64`
    : "";
  const slug = slugify(program.name).slice(0, 8);
  const fill = program.category === "Competition" ? "#0f766e" : "#1e58d6";

  // Build using foreignObject so we can use HTML/CSS to render the logo with a circular crop.
  // This is more reliable than SVG <image> with clip-path.
  el.innerHTML = `
    <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" width="32" height="40">
      <defs>
        <filter id="shadow-${slug}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
        </filter>
        <clipPath id="circle-${slug}">
          <circle cx="16" cy="13" r="8"/>
        </clipPath>
      </defs>
      <path d="M16 38 C 16 38 4 22 4 13 A 12 12 0 0 1 28 13 C 28 22 16 38 16 38 Z" fill="${fill}" filter="url(#shadow-${slug})" stroke="white" stroke-width="1.5"/>
      <circle cx="16" cy="13" r="9" fill="white"/>
      ${
        faviconUrl
          ? `<image href="${faviconUrl}" x="8" y="5" width="16" height="16" preserveAspectRatio="xMidYMid meet" clip-path="url(#circle-${slug})"/>`
          : `<text x="16" y="17" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="${fill}">${escapeHtml(program.org ?? "BP").charAt(0).toUpperCase()}</text>`
      }
    </svg>
  `;
  return el;
}

export type MapBounds = { north: number; south: number; east: number; west: number };

interface USMapProps {
  className?: string;
  counts?: Record<string, number>;
  programs?: Opportunity[];
  onStateSelect?: (state: string) => void;
  onBoundsChange?: (bounds: MapBounds | null) => void;
}

export function USMap({ className, programs = OPPORTUNITIES, onBoundsChange }: USMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [userLocated, setUserLocated] = useState(false);

  const geoPrograms = useMemo(
    () =>
      programs
        .filter((p) => !isOnlineLocation(p.location))
        .map((program) => {
          const pos = geocodeLocation(program.location);
          return pos ? { program, position: pos } : null;
        })
        .filter((x): x is { program: Opportunity; position: { lat: number; lng: number } } => x !== null),
    [programs],
  );

  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = map.getBounds();
    if (!bounds) return;

    const visible = geoPrograms.filter(({ position }) => bounds.contains([position.lng, position.lat]));
    setVisibleCount(visible.length);

    const PROGRAMS_TO_RENDER = 400;
    const step = visible.length > PROGRAMS_TO_RENDER ? Math.ceil(visible.length / PROGRAMS_TO_RENDER) : 1;
    const toRender = step > 1 ? visible.filter((_, i) => i % step === 0) : visible;

    for (const { program, position } of toRender) {
      const el = createTeardropMarker(program);
      const popup = new mapboxgl.Popup({
        offset: 18,
        maxWidth: "300px",
        closeButton: false,
        className: "blueprint-popup",
      }).setHTML(buildPopupHTML(program));

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([position.lng, position.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [geoPrograms]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: US_CENTER,
      zoom: 3.5,
      minZoom: 2,
      maxZoom: 14,
      maxBounds: [
        [-170, 18],
        [-55, 60],
      ],
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: false }), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl({ unit: "imperial" }), "bottom-left");

    const throttledUpdate = () => {
      requestAnimationFrame(() => updateMarkers());
    };

    const emitBounds = () => {
      const b = map.getBounds();
      if (!b) return;
      onBoundsChange?.({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    };

    map.on("load", () => {
      setTotalCount(geoPrograms.length);
      updateMarkers();
      emitBounds();
    });

    map.on("moveend", () => {
      throttledUpdate();
      emitBounds();
    });
    map.on("zoomend", () => {
      throttledUpdate();
      emitBounds();
    });

    mapRef.current = map;

    return () => {
      onBoundsChange?.(null);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      updateMarkers();
      setTotalCount(geoPrograms.length);
    } else {
      map.once("load", () => {
        updateMarkers();
        setTotalCount(geoPrograms.length);
      });
    }
  }, [geoPrograms, updateMarkers]);

  const focusUS = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(
      [
        [-124.8, 24.5],
        [-66.9, 49.4],
      ],
      { padding: 32, duration: 1400, maxZoom: 5 },
    );
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 6,
          duration: 1500,
        });
        setUserLocated(true);
      },
      () => {
        mapRef.current?.flyTo({ center: US_CENTER, zoom: 3.5, duration: 1200 });
      },
      { enableHighAccuracy: false, timeout: 6000 },
    );
  }, []);

  return (
    <div
      className={cn(
        "relative h-[28rem] overflow-hidden rounded-2xl border border-border bg-muted/20",
        className,
      )}
    >
      <div ref={mapContainer} className="h-full w-full" />

      {/* Top-left: Set location + status pill */}
      <div className="absolute left-3 top-3 z-[500] flex flex-col gap-2">
        <button
          type="button"
          onClick={locate}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted hover:border-primary/40"
        >
          <Navigation className="h-3.5 w-3.5 text-primary" />
          Set your location
        </button>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {visibleCount} on map · {totalCount} total
        </div>
      </div>

      {/* Top-right: US view */}
      <div className="absolute right-3 top-3 z-[500]">
        <button
          type="button"
          onClick={focusUS}
          title="Zoom to the US"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card/95 px-3 text-xs font-semibold text-muted-foreground shadow-sm transition hover:bg-muted hover:text-primary"
        >
          <MapIcon className="h-3.5 w-3.5" />
          US
        </button>
      </div>

      {/* User-located dot indicator */}
      {userLocated && (
        <div className="absolute bottom-12 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground shadow-sm">
          Showing your area
        </div>
      )}
    </div>
  );
}
