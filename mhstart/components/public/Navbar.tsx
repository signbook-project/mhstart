"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/map", label: "Ecosystem Map" },
  { href: "/people", label: "People" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    } else {
      setMenuHeight(0);
    }
  }, [open]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "var(--nav-height)",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          boxShadow: "var(--shadow-md)",
          transition: "all 0.3s ease",
          borderBottom: scrolled ? "1px solid var(--gray-100)" : "none",
        }}
      >
        <div
          className="container-wide"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="MHStart"
              width={180}
              height={180}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div
            style={{ display: "flex", gap: 4, alignItems: "center" }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  color: pathname === link.href ? "var(--skyblue)" : "#6b7280",
                  background:
                    pathname === link.href
                      ? "rgba(53, 191, 255, 0.1)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="btn btn-primary"
              style={{ padding: "8px 20px", fontSize: 13, marginLeft: 8 }}
            >
              + Add Listing
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
            }}
            className="mobile-menu-btn"
          >
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                backgroundColor: "#0A2463",
                transition: "all 0.2s",
                transform: open ? "rotate(45deg) translate(5px, 5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                backgroundColor: "#0A2463",
                opacity: open ? 0 : 1,
                transition: "all 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: 24,
                height: 2,
                backgroundColor: "#0A2463",
                transition: "all 0.2s",
                transform: open
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: "var(--nav-height)",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.98)",
            zIndex: 199,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "24px 20px",
            gap: 4,
            borderBottom: "1px solid var(--gray-100)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 18,
                fontWeight: 600,
                color: pathname === link.href ? "var(--skyblue)" : "#6b7280",
                background: pathname === link.href ? "rgba(53, 191, 255, 0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="btn btn-primary"
            onClick={() => setOpen(false)}
            style={{ marginTop: 12, width: "100%", textAlign: "center" }}
          >
            + Add Listing
          </Link>
        </div>
      )}

      {/* Spacer to push content down when menu is fixed and open */}
      <div style={{ height: menuHeight, transition: "height 0.2s" }} />
    </>
  );
}
