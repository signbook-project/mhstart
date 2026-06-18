"use client";
import { useEffect, useRef } from "react";

const TYPE_COLORS: Record<string, string> = {
  startup: "#FF6B35",
  incubator: "#0A2463",
  vc: "#D4A017",
  accelerator: "#2D6A4F",
  angel: "#8B4513",
  government: "#5A189A",
  corporate: "#023E8A",
  other: "#4A4A4A",
};
const TYPE_ICONS: Record<string, string> = {
  startup: "🚀",
  incubator: "🏢",
  vc: "💰",
  accelerator: "⚡",
  angel: "👼",
  government: "🏛️",
  corporate: "🏗️",
  other: "🔵",
};

export default function MapView({
  listings,
  selected,
  onSelect,
}: {
  listings: any[];
  selected: any;
  onSelect: (l: any) => void;
}) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (typeof window === "undefined" || !containerRef.current) return;
  //     if (mapRef.current) return;

  //     // Dynamically import leaflet
  //     import("leaflet").then((L) => {
  //       // Fix marker icons
  //       delete (L.Icon.Default.prototype as any)._getIconUrl;
  //       L.Icon.Default.mergeOptions({
  //         iconRetinaUrl:
  //           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  //         iconUrl:
  //           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  //         shadowUrl:
  //           "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  //       });

  //       // Maharashtra center
  //       // const map = L.map(containerRef.current!, {
  //       //   center: [19.6, 75.3],
  //       //   zoom: 7,
  //       //   zoomControl: true,
  //       // });

  //       // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       //   attribution: '© OpenStreetMap contributors'
  //       // }).addTo(map)

  //   const map = L.map(containerRef.current!, {
  //   center: [19.6, 75.3],
  //   zoom: 7,
  //   zoomControl: true,
  //   attributionControl: false,
  // });

  // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //   attribution: "",
  // }).addTo(map);

  // L.control.attribution({
  //   prefix: false,
  // }).addTo(map);

  // mapRef.current = map;
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    if (mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [19.6, 75.3],
        zoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.control
        .attribution({
          prefix: false,
        })
        .addTo(map);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      listings.forEach((l) => {
        if (!l.lat || !l.lng) return;
        const color = TYPE_COLORS[l.type] || "#4A4A4A";
        const icon = TYPE_ICONS[l.type] || "📍";

        const customIcon = L.divIcon({
          className: "",
          html: `<div style="
            width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; display: block; text-align: center; line-height: 30px;">${icon}</span>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([l.lat, l.lng], { icon: customIcon }).addTo(
          mapRef.current,
        ).bindPopup(`
            <div style="font-family: Mukta, sans-serif; min-width: 200px; padding: 4px;">
              <div style="font-weight: 700; font-size: 15px; color: #0A2463; margin-bottom: 4px;">${l.name}</div>
              <div style="font-size: 12px; color: ${color}; font-weight: 600; margin-bottom: 6px;">${TYPE_ICONS[l.type]} ${l.type?.charAt(0).toUpperCase() + l.type?.slice(1)}</div>
              ${l.tagline ? `<div style="font-size: 13px; color: #5A5048;">${l.tagline}</div>` : ""}
              ${l.city ? `<div style="font-size: 12px; color: #9E9080; margin-top: 4px;">📍 ${l.city}</div>` : ""}
            </div>
          `);
        marker.on("click", () => onSelect(l));
        markersRef.current.push(marker);
      });
    });
  }, [listings]);

  // Pan to selected
  useEffect(() => {
    if (selected?.lat && selected?.lng && mapRef.current) {
      mapRef.current.flyTo([selected.lat, selected.lng], 13, { duration: 1.2 });
    }
  }, [selected]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
