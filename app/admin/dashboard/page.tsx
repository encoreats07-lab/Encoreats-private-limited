"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  MessageSquare,
  FileText,
  ExternalLink,
  Award,
  Loader2,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected application for detail review & note adding
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/applications"),
      ]);

      if (!statsRes.ok || !appsRes.ok) {
        router.push("/login");
        return;
      }

      const statsData = await statsRes.json();
      const appsData = await appsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (appsData.success) setApplications(appsData.applications || []);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, note?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: note }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setApplications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status, adminNotes: result.application.adminNotes } : item))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status, adminNotes: result.application.adminNotes });
        }
        setNewNote("");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-warm-ivory flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-champagne mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-muted-stone font-mono">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesType = typeFilter === "ALL" || app.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="px-6 lg:px-12 pt-32 pb-24 max-w-7xl mx-auto w-full space-y-10">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-warm-ivory/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-[10px] uppercase tracking-widest font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Command Center</span>
            </div>
            <h1 className="font-editorial text-4xl text-warm-ivory font-light">Partner Applications Atelier</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="px-4 py-2.5 bg-deep-onyx border border-warm-ivory/20 text-xs font-mono text-warm-ivory rounded-lg hover:border-champagne transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-rose-500/40 text-rose-300 text-xs font-mono rounded-lg hover:bg-rose-950/40 transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10">
            <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block mb-1">
              Registered Users
            </span>
            <div className="font-editorial text-4xl text-warm-ivory font-bold">{stats?.totalUsers || 0}</div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10">
            <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block mb-1">
              Early Access Signups
            </span>
            <div className="font-editorial text-4xl text-champagne font-bold">{stats?.totalEarlyAccess || 0}</div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10">
            <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block mb-1">
              Pending Applications
            </span>
            <div className="font-editorial text-4xl text-amber-400 font-bold">{stats?.pendingApplications || 0}</div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10">
            <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block mb-1">
              Approved Partners
            </span>
            <div className="font-editorial text-4xl text-emerald-400 font-bold">{stats?.approvedPartners || 0}</div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-warm-ivory/10">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-onyx border border-warm-ivory/15 rounded-lg pl-10 pr-4 py-2.5 text-xs text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto text-xs font-mono">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-deep-onyx border border-warm-ivory/15 rounded-lg px-3 py-2.5 text-warm-ivory focus:outline-none focus:border-champagne"
            >
              <option value="ALL">All Partner Types</option>
              <option value="ARTIST">Artists & Creators</option>
              <option value="VENUE">Venues & Spaces</option>
              <option value="HOST">Experience Hosts</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-deep-onyx border border-warm-ivory/15 rounded-lg px-3 py-2.5 text-warm-ivory focus:outline-none focus:border-champagne"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="REQUEST_MORE_INFO">Need Info</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-xl border border-warm-ivory/10 text-muted-stone text-xs font-mono">
              No partner applications match the selected criteria.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="glass-panel p-6 rounded-xl border border-warm-ivory/10 hover:border-champagne/30 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warm-ivory/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-champagne/15 text-champagne border border-champagne/30 rounded">
                        {app.type}
                      </span>
                      <h3 className="font-editorial text-2xl text-warm-ivory">{app.name}</h3>
                    </div>
                    <div className="text-xs text-muted-stone font-mono flex flex-wrap gap-4">
                      <span>{app.email}</span>
                      <span>{app.phone}</span>
                      <span>{app.city}</span>
                      <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-[10px] font-mono uppercase rounded border ${
                        app.status === "APPROVED"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                          : app.status === "REJECTED"
                          ? "bg-rose-950/60 text-rose-400 border-rose-500/40"
                          : app.status === "UNDER_REVIEW"
                          ? "bg-amber-950/60 text-amber-400 border-amber-500/40"
                          : "bg-deep-onyx text-muted-stone border-warm-ivory/20"
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 bg-champagne/15 border border-champagne/40 text-champagne text-xs font-mono uppercase tracking-wider rounded hover:bg-champagne hover:text-obsidian transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                  </div>
                </div>

                {/* Direct quick action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                    className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app.id, "UNDER_REVIEW")}
                    className="px-3 py-1.5 bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono rounded hover:bg-amber-900/60 transition-colors"
                  >
                    <span>Under Review</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                    className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono rounded hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Application Detail Modal / Drawer */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass-panel w-full max-w-2xl p-8 rounded-2xl border border-warm-ivory/20 shadow-2xl relative my-8 space-y-6">
              <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-champagne tracking-wider">
                    {selectedApp.type} Application Review
                  </span>
                  <h2 className="font-editorial text-3xl text-warm-ivory">{selectedApp.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-muted-stone hover:text-warm-ivory text-xs font-mono uppercase px-3 py-1.5 rounded border border-warm-ivory/20"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 text-xs text-muted-stone">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-warm-ivory block">Email:</span>
                    <span>{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="font-mono text-warm-ivory block">Phone:</span>
                    <span>{selectedApp.phone}</span>
                  </div>
                  <div>
                    <span className="font-mono text-warm-ivory block">City:</span>
                    <span>{selectedApp.city}</span>
                  </div>
                  <div>
                    <span className="font-mono text-warm-ivory block">Status:</span>
                    <span className="text-champagne font-mono font-semibold">{selectedApp.status}</span>
                  </div>
                </div>

                {selectedApp.portfolioUrl && (
                  <div>
                    <span className="font-mono text-warm-ivory block mb-1">Portfolio / Website:</span>
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-champagne hover:underline flex items-center gap-1"
                    >
                      <span>{selectedApp.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selectedApp.data && (
                  <div>
                    <span className="font-mono text-warm-ivory block mb-1">Submitted Form Data:</span>
                    <pre className="bg-deep-onyx p-4 rounded-lg text-[11px] font-mono text-warm-ivory/80 overflow-x-auto border border-warm-ivory/10 max-h-48">
                      {JSON.stringify(JSON.parse(selectedApp.data), null, 2)}
                    </pre>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div className="pt-4 border-t border-warm-ivory/10 space-y-3">
                  <h4 className="font-editorial text-lg text-warm-ivory flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-champagne" />
                    <span>Internal Admin Notes (Private)</span>
                  </h4>

                  {selectedApp.adminNotes && selectedApp.adminNotes.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                      {selectedApp.adminNotes.map((note: any) => (
                        <div key={note.id} className="p-3 rounded bg-deep-onyx/80 border border-warm-ivory/10 text-xs">
                          <p className="text-warm-ivory">{note.content}</p>
                          <span className="text-[10px] text-muted-stone font-mono block mt-1">
                            By {note.admin?.name || "Admin"} on {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add private note for committee..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full bg-deep-onyx border border-warm-ivory/15 rounded-lg px-3 py-2 text-xs text-warm-ivory focus:outline-none focus:border-champagne"
                    />
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, newNote)}
                      disabled={updating || !newNote.trim()}
                      className="px-4 py-2 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
