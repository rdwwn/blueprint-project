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
const MAX_POPUP_ROWS = 6;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function faviconFor(host: string | null): string {
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : "";
}

// One badge per unique location: EC-database style. Dozens of programs often
// share a spot (state centroids, "Nationwide"), so the count chip does the work.
type LocationGroup = {
  key: string;
  lng: number;
  lat: number;
  label: string;
  programs: Opportunity[];
};

function buildGroups(programs: Opportunity[]): LocationGroup[] {
  const bySpot = new Map<string, LocationGroup>();
  for (const p of programs) {
    if (isOnlineLocation(p.location)) continue;
    const pos = geocodeLocation(p.location);
    if (!pos) continue;
    const key = `${pos.lat.toFixed(4)},${pos.lng.toFixed(4)}`;
    let g = bySpot.get(key);
    if (!g) {
      g = { key, lng: pos.lng, lat: pos.lat, label: p.location ?? "", programs: [] };
      bySpot.set(key, g);
    }
    g.programs.push(p);
  }
  const groups = [...bySpot.values()];
  for (const g of groups) g.programs.sort((a, b) => a.name.localeCompare(b.name));
  return groups;
}

function createBadgeEl(group: LocationGroup): HTMLDivElement {
  const rep = group.programs.find((p) => p.host) ?? group.programs[0];
  const fav = faviconFor(rep.host);
  const n = group.programs.length;
  const initial = escapeHtml((rep.org ?? rep.name).charAt(0).toUpperCase());

  const el = document.createElement("div");
  el.className = "bp-map-badge";
  el.title = `${group.label} · ${n} program${n === 1 ? "" : "s"}`;
  el.innerHTML = `
    <div style="position:relative;width:38px;height:38px">
      <div style="width:38px;height:38px;border-radius:50%;background:#fff;border:2px solid #1e58d6;box-shadow:0 2px 10px rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center;overflow:hidden">
        ${
          fav
            ? `<img src="${fav}" width="22" height="22" style="border-radius:5px" alt=""/>`
            : `<span style="font:700 14px system-ui,sans-serif;color:#1e58d6">${initial}</span>`
        }
      </div>
      ${
        n > 1
          ? `<div style="position:absolute;top:-7px;right:-9px;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#1e58d6;color:#fff;font:700 11px/20px system-ui,sans-serif;text-align:center;box-shadow:0 2px 6px rgba(15,23,42,.3)">${n > 99 ? "99+" : n}</div>`
          : ""
      }
    </div>`;
  return el;
}

function buildPopupHTML(group: LocationGroup): string {
  const rows = group.programs.slice(0, MAX_POPUP_ROWS);
  const rest = group.programs.length - rows.length;
  const rowHtml = rows
    .map((p) => {
      const fav = faviconFor(p.host);
      const href = `/opportunity/${encodeURIComponent(slugify(p.name))}`;
      return `
        <a href="${href}" style="display:flex;align-items:center;gap:9px;padding:8px 2px;border-bottom:1px solid #eef0f4;text-decoration:none">
          ${
            fav
              ? `<img src="${fav}" alt="" style="width:24px;height:24px;border-radius:6px;flex-shrink:0;border:1px solid #e3ddcf;padding:1px;background:#fff"/>`
              : `<span style="width:24px;height:24px;border-radius:6px;flex-shrink:0;background:#eaf0fd;display:flex;align-items:center;justify-content:center;font:700 11px system-ui,sans-serif;color:#1e58d6">${escapeHtml((p.org ?? p.name).charAt(0).toUpperCase())}</span>`
          }
          <span style="min-width:0;flex:1">
            <span style="display:block;font-size:12.5px;font-weight:600;color:#1b2a4a;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(p.name)}</span>
            ${p.deadline ? `<span style="display:block;font-size:10.5px;color:#5d6b80;margin-top:1px">⏱ ${escapeHtml(p.deadline)}</span>` : ""}
          </span>
        </a>`;
    })
    .join("");

  return `
    <div style="min-width:250px;max-width:300px;font-family:system-ui,-apple-system,sans-serif;padding:2px">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#5d6b80">${escapeHtml(group.label)} · ${group.programs.length} program${group.programs.length === 1 ? "" : "s"}</p>
      <div style="max-height:280px;overflow-y:auto;margin:0 -4px;padding:0 4px">${rowHtml}</div>
      ${
        rest > 0
          ? `<p style="margin:8px 0 0;font-size:11px;color:#5d6b80">+${rest} more at <a href="/opportunities" style="color:#1e58d6;font-weight:600;text-decoration:none">blueprintproject.app</a></p>`
          : ""
      }
    </div>`;
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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const groupsRef = useRef<LocationGroup[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [userLocated, setUserLocated] = useState(false);

  const groups = useMemo(() => buildGroups(programs), [programs]);
  const totalCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.programs.length, 0),
    [groups],
  );

  const updateVisibleCount = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    let n = 0;
    for (const g of groupsRef.current) {
      if (g.lng >= b.getWest() && g.lng <= b.getEast() && g.lat >= b.getSouth() && g.lat <= b.getNorth()) {
        n += g.programs.length;
      }
    }
    setVisibleCount(n);
  }, []);

  const openPopup = useCallback((group: LocationGroup) => {
    const map = mapRef.current;
    if (!map) return;
    if (!popupRef.current) {
      popupRef.current = new mapboxgl.Popup({
        offset: 16,
        maxWidth: "320px",
        closeButton: false,
        className: "blueprint-popup",
      });
    }
    popupRef.current.setHTML(buildPopupHTML(group)).setLngLat([group.lng, group.lat]).addTo(map);
  }, []);

  // Create markers ONCE per filter change. During panning Mapbox just moves
  // the existing DOM nodes — that's what keeps it smooth.
  const rebuildMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];
    groupsRef.current.forEach((g) => {
      const marker = new mapboxgl.Marker({ element: createBadgeEl(g), anchor: "center" })
        .setLngLat([g.lng, g.lat])
        .addTo(map);
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(g);
      });
      markersRef.current.push(marker);
    });
  }, [openPopup]);

  const emitBounds = useCallback(() => {
    const b = mapRef.current?.getBounds();
    if (!b) return;
    onBoundsChange?.({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, [onBoundsChange]);

  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Small hover style for badges, injected once.
    if (!document.getElementById("bp-map-badge-style")) {
      const style = document.createElement("style");
      style.id = "bp-map-badge-style";
      style.textContent =
        ".bp-map-badge{cursor:pointer;transition:transform .15s cubic-bezier(0.21,0.47,0.32,0.98)}.bp-map-badge:hover{transform:scale(1.12)}";
      document.head.appendChild(style);
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: US_CENTER,
      zoom: 3.5,
      minZoom: 1,
      maxZoom: 14,
      // No maxBounds: the whole world can be panned. Data is US-centric today,
      // but nothing breaks when international programs land in the dataset.
      attributionControl: true,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: false }),
      "bottom-right",
    );
    map.addControl(new mapboxgl.ScaleControl({ unit: "imperial" }), "bottom-left");

    map.on("load", () => {
      rebuildMarkers();
      updateVisibleCount();
      emitBounds();
    });

    // Panning/zooming never touches the markers — just the count pill.
    map.on("moveend", () => {
      updateVisibleCount();
      emitBounds();
    });
    map.on("zoomend", () => {
      updateVisibleCount();
      emitBounds();
    });

    map.on("click", () => popupRef.current?.remove());

    return () => {
      onBoundsChange?.(null);
      popupRef.current?.remove();
      popupRef.current = null;
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters changed upstream: swap the badge set in one pass.
  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) rebuildMarkers();
  }, [groups, rebuildMarkers]);

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
