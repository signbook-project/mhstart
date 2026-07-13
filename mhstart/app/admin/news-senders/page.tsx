"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminNewsSendersPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/news-senders")
      .then((r) => r.json())
      .then((d) => {
        setEmails(d.data || []);
        setLoading(false);
      });
  }, []);

  const addEmail = async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/news-senders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      });
      const text = await res.text();
      let d: any;
      try {
        d = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned non-JSON (status ${res.status}). Check that /api/admin/news-senders route.ts exists.`,
        );
      }
      if (res.ok) {
        setEmails(d.data);
        setNewEmail("");
        toast.success("Added");
      } else {
        toast.error(d.error || "Failed to add");
      }
    } catch (err: any) {
      toast.error(err.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };
  const removeEmail = async (email: string) => {
    if (!confirm(`Remove ${email} from allowed senders?`)) return;
    const res = await fetch("/api/admin/news-senders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await res.json();
    if (res.ok) {
      setEmails(d.data);
      toast.success("Removed");
    } else {
      toast.error("Failed to remove");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 26,
            color: "var(--navy)",
          }}
        >
          News Auto-Publish — Allowed Senders
        </h1>
        <p
          style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}
        >
          Only emails sent from these addresses will be auto-published as news
          articles. Any other sender is ignored — nothing gets published, and
          nothing gets saved.
        </p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            className="form-input"
            type="email"
            placeholder="teammate@mhstart.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={addEmail}
            disabled={saving}
          >
            {saving ? "Adding..." : "+ Add"}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--gray-400)" }}>Loading...</p>
        ) : emails.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "var(--gray-400)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <p>
              No allowed senders yet. Until you add at least one email, the
              auto-publish inbox won&apos;t publish anything.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {emails.map((email) => (
              <div
                key={email}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: "var(--gray-50)",
                  borderRadius: 10,
                  border: "1px solid var(--gray-100)",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--navy)",
                  }}
                >
                  {email}
                </span>
                <button
                  onClick={() => removeEmail(email)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#FEE2E2",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#991B1B",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
