"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/widgets/header";
import { cn } from "@/shared/lib/utils";
import { ROLE_LABELS, type UserRole } from "@/shared/types/roles";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user as { id: string; name?: string; email?: string; role?: UserRole } | undefined;

  const [profileForm, setProfileForm] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name, email: profileForm.email }),
      });
      const data = await res.json();
      if (!res.ok) { setProfileMsg(data.error); return; }
      await update({ name: profileForm.name });
      setProfileMsg("Profile updated.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { setPwMsg("Passwords do not match"); return; }
    setPwLoading(true);
    setPwMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      setPwMsg(res.ok ? "Password changed." : data.error);
      if (res.ok) setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } finally {
      setPwLoading(false);
    }
  };

  const inputClass = cn(
    "w-full bg-bg border border-border-base rounded-xl px-4 py-3 text-sm",
    "text-text-primary placeholder:text-text-muted outline-none focus:border-accent-indigo transition-colors"
  );

  return (
    <>
      <Header title="Profile" />
      <div className="flex-1 p-6 max-w-2xl space-y-6">

        {/* Role badge */}
        {user?.role && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Your role:</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-accent-indigo/10 text-accent-cyan">
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        )}

        {/* Profile info */}
        <div className="bg-surface border border-border-base rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-5">Profile information</h3>
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Full name</label>
              <input
                type="text" required
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Email</label>
              <input
                type="email" required
                value={profileForm.email}
                onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            {profileMsg && (
              <p className={cn("text-sm", profileMsg.includes("updated") ? "text-price-up" : "text-price-down")}>
                {profileMsg}
              </p>
            )}
            <button
              type="submit" disabled={profileLoading}
              className="gradient-accent text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {profileLoading ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        {/* Change password — only for credentials users */}
        <div className="bg-surface border border-border-base rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-1">Change password</h3>
          <p className="text-xs text-text-muted mb-5">Not available for Google accounts.</p>
          <form onSubmit={handlePassword} className="space-y-4">
            {[
              { key: "currentPassword", label: "Current password", placeholder: "••••••••" },
              { key: "newPassword",     label: "New password",     placeholder: "Min. 8 characters" },
              { key: "confirm",         label: "Confirm new password", placeholder: "••••••••" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-text-muted mb-1.5">{label}</label>
                <input
                  type="password" required placeholder={placeholder}
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  className={inputClass}
                />
              </div>
            ))}
            {pwMsg && (
              <p className={cn("text-sm", pwMsg.includes("changed") ? "text-price-up" : "text-price-down")}>
                {pwMsg}
              </p>
            )}
            <button
              type="submit" disabled={pwLoading}
              className="gradient-accent text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {pwLoading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
