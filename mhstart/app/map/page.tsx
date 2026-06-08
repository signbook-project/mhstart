"use client";
import Navbar from "@/components/public/Navbar";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const MapView = dynamic(() => import("@/components/public/MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gray-100)",
        borderRadius: 16,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
        <p style={{ color: "var(--gray-400)" }}>Loading map...</p>
      </div>
    </div>
  ),
});

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  startup: { label: "Startup", icon: "🚀", color: "#FF6B35" },
  incubator: { label: "Incubator", icon: "🏢", color: "#0A2463" },
  vc: { label: "VC", icon: "💰", color: "#D4A017" },
  accelerator: { label: "Accelerator", icon: "⚡", color: "#2D6A4F" },
  angel: { label: "Angel", icon: "👼", color: "#8B4513" },
  government: { label: "Government", icon: "🏛️", color: "#5A189A" },
  corporate: { label: "Corporate", icon: "🏗️", color: "#023E8A" },
  other: { label: "Other", icon: "🔵", color: "#4A4A4A" },
};

export default function MapPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<string>>(
    new Set(Object.keys(TYPE_CONFIG)),
  );
  const [loading, setLoading] = useState(true);
  const safeFiltered = (filtered || []).filter((l) => {
    const lat = Number(l.lat);
    const lng = Number(l.lng);

    return !isNaN(lat) && !isNaN(lng);
  });
  useEffect(() => {
    supabase
      .from("map_listings")
      .select("*")
      .eq("status", "active")
      .then(({ data }) => {
        setListings(data || []);
        setFiltered(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = listings.filter((l) => activeTypes.has(l.type));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.tagline?.toLowerCase().includes(q) ||
          l.sector?.some((s: string) => s.toLowerCase().includes(q)),
      );
    }
    setFiltered(result);
  }, [listings, activeTypes, search]);

  const toggleType = (type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: "var(--nav-height)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "var(--navy-dark)",
            padding: "14px 24px",
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            zIndex: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              className="form-input"
              placeholder="🔍 Search startups, cities, sectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 14px",
                fontSize: 14,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: 8,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: activeTypes.has(type)
                    ? cfg.color
                    : "rgba(255,255,255,0.12)",
                  color: activeTypes.has(type)
                    ? "white"
                    : "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                }}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
          <Link
            href="/submit"
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: 13, whiteSpace: "nowrap" }}
          >
            + Add Listing
          </Link>
        </div>

        {/* Map + Sidebar */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div
            style={{
              width: 320,
              background: "white",
              borderRight: "1px solid var(--gray-200)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--gray-100)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15 }}
              >
                {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
              </span>
              {selected && (
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--gray-400)",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Clear ✕
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {selected ? (
                <ListingDetail
                  listing={selected}
                  onClose={() => setSelected(null)}
                />
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--gray-400)",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p>No listings found</p>
                </div>
              ) : (
                filtered.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "14px 20px",
                      borderBottom: "1px solid var(--gray-100)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--gray-50)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: l.logo_url
                            ? `url(${l.logo_url}) center/contain no-repeat white`
                            : TYPE_CONFIG[l.type]?.color || "var(--gray-200)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          border: "1px solid var(--gray-100)",
                        }}
                      >
                        {!l.logo_url && TYPE_CONFIG[l.type]?.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "var(--navy)",
                            marginBottom: 2,
                          }}
                        >
                          {l.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <span
                            className="badge"
                            style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              background: `${TYPE_CONFIG[l.type]?.color}18`,
                              color: TYPE_CONFIG[l.type]?.color,
                            }}
                          >
                            {TYPE_CONFIG[l.type]?.label}
                          </span>
                          {l.city && (
                            <span
                              style={{ fontSize: 12, color: "var(--gray-400)" }}
                            >
                              📍 {l.city}
                            </span>
                          )}
                        </div>
                        {l.tagline && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              marginTop: 4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {l.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div style={{ flex: 1 }}>
            <MapView
              listings={safeFiltered}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ListingDetail({
  listing: l,
  onClose,
}: {
  listing: any;
  onClose: () => void;
}) {
  const cfg = TYPE_CONFIG[l.type] || TYPE_CONFIG.other;
  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--gray-400)",
          fontSize: 13,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Back to list
      </button>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            background: l.logo_url
              ? `url(${l.logo_url}) center/contain no-repeat white`
              : cfg.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            border: "1px solid var(--gray-200)",
            flexShrink: 0,
          }}
        >
          {!l.logo_url && cfg.icon}
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              color: "var(--navy)",
            }}
          >
            {l.name}
          </h3>
          <span
            className="badge"
            style={{
              fontSize: 11,
              background: `${cfg.color}18`,
              color: cfg.color,
            }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {l.tagline && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          {l.tagline}
        </p>
      )}
      {l.description && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          {l.description}
        </p>
      )}

      {l.sector?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--gray-400)",
              marginBottom: 6,
            }}
          >
            SECTORS
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {l.sector.map((s: string) => (
              <span
                key={s}
                className="badge badge-navy"
                style={{ fontSize: 11 }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        {l.city && (
          <span>
            📍 {l.address || l.city}
            {l.district ? `, ${l.district}` : ""}
          </span>
        )}
        {l.founded_year && <span>📅 Founded {l.founded_year}</span>}
        {l.team_size && <span>👥 Team size: {l.team_size}</span>}
        {l.stage && <span>🎯 Stage: {l.stage}</span>}
        {l.email && (
          <a href={`mailto:${l.email}`} style={{ color: "var(--saffron)" }}>
            {l.email}
          </a>
        )}
        {l.phone && (
          <a href={`tel:${l.phone}`} style={{ color: "var(--saffron)" }}>
            {l.phone}
          </a>
        )}
        {l.website && (
          <a
            href={l.website}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--saffron)" }}
          >
            🌐 Website
          </a>
        )}
      </div>

      {(l.linkedin || l.twitter || l.instagram) && (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {l.linkedin && (
            <a
              href={l.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "var(--saffron)" }}
            >
              LinkedIn
            </a>
          )}
          {l.twitter && (
            <a
              href={l.twitter}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "var(--saffron)" }}
            >
              Twitter
            </a>
          )}
          {l.instagram && (
            <a
              href={l.instagram}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "var(--saffron)" }}
            >
              Instagram
            </a>
          )}
        </div>
      )}
    </div>
  );
}
