"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  ERICEIRA_BOUNDS,
  ERICEIRA_CENTER,
  ERICEIRA_DEFAULT_ZOOM,
  ERICEIRA_MAX_ZOOM,
  ERICEIRA_MIN_ZOOM,
  MAP_RADIUS_KM,
} from "@/lib/geo";
import type { MapPin } from "@/lib/map-pins";
import "leaflet/dist/leaflet.css";

export type { MapPin };

const CATEGORY_COLORS: Record<string, string> = {
  "cat-moving": "#0f766e",
  "cat-food": "#c45c26",
  "cat-cowork": "#0d6170",
  "cat-cars": "#1d4ed8",
  "cat-health": "#be123c",
  "cat-kids": "#7c3aed",
  "cat-trades": "#a16207",
  "cat-build": "#57534e",
  "cat-tech": "#0369a1",
  "cat-creative": "#db2777",
  "cat-cleaning": "#0f766e",
  "cat-garden": "#15803d",
  "cat-wood": "#92400e",
  "cat-openings": "#4338ca",
  "cat-energy": "#ca8a04",
  "cat-taxi": "#eab308",
  "cat-legal": "#334155",
  "cat-admin": "#0f766e",
};

function pinIcon(categoryId: string) {
  const color = CATEGORY_COLORS[categoryId] || "#0d6170";
  return L.divIcon({
    className: "playbook-map-pin",
    html: `<span style="
      display:block;width:18px;height:18px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid #fff;
      box-shadow:0 2px 8px rgba(5,53,66,.35);
      transform:rotate(-45deg);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -16],
  });
}

function FitBoundsGuard() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(ERICEIRA_BOUNDS);
    map.options.maxBoundsViscosity = 0.85;
  }, [map]);
  return null;
}

/** Zoom so all pins are visible, as large as possible. */
function FitToPins({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  const key = pins.map((p) => `${p.id}:${p.lat},${p.lng}`).join("|");

  useEffect(() => {
    if (pins.length === 0) {
      map.setView(
        [ERICEIRA_CENTER.lat, ERICEIRA_CENTER.lng],
        ERICEIRA_DEFAULT_ZOOM
      );
      return;
    }
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 15, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(
      pins.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, {
      padding: [48, 48],
      maxZoom: 16,
      animate: true,
    });
  }, [map, key, pins]);

  return null;
}

export function EriceiraMap({
  pins,
  onSelectPin,
}: {
  pins: MapPin[];
  onSelectPin?: (pin: MapPin) => void;
}) {
  const center = useMemo(
    () => [ERICEIRA_CENTER.lat, ERICEIRA_CENTER.lng] as [number, number],
    []
  );

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-ocean/15 shadow-sm">
      <div className="relative h-[min(58vh,28rem)] w-full sm:h-[32rem]">
        <MapContainer
          center={center}
          zoom={ERICEIRA_DEFAULT_ZOOM}
          minZoom={ERICEIRA_MIN_ZOOM}
          maxZoom={ERICEIRA_MAX_ZOOM}
          maxBounds={ERICEIRA_BOUNDS}
          scrollWheelZoom
          className="h-full w-full z-0"
        >
          <FitBoundsGuard />
          <FitToPins pins={pins} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pinIcon(pin.categoryId)}
              eventHandlers={{
                click: () => onSelectPin?.(pin),
              }}
            >
              <Popup>
                <div className="min-w-[10rem]">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-ocean">
                    {pin.categoryName}
                  </p>
                  <p className="font-semibold text-ink">{pin.name}</p>
                  {pin.details && (
                    <p className="mt-1 text-xs text-ink-muted line-clamp-3">
                      {pin.details}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="bg-surface px-3 py-2 text-center text-[0.7rem] text-ink-soft sm:text-left sm:px-4">
        Ericeira ±{MAP_RADIUS_KM} km · {pins.length} pin
        {pins.length === 1 ? "" : "s"} on the map
      </p>
    </div>
  );
}
