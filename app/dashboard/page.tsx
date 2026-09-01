"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Ticket,
  Share2,
  Copy,
  Check,
  Bell,
  LogOut,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
  Loader2,
  Award,
  Upload,
  Edit3,
  Save,
  X,
  Camera,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "experiences" | "referrals" | "profile" | "notifications">("overview");
  const [copied, setCopied] = useState(false);

  // Edit profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    city: "mumbai",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data);
        setProfileForm({
          fullName: data.user.name || "",
          phone: data.user.phone || "",
          city: data.user.city || "mumbai",
          bio: data.user.bio || "",
          avatarUrl: data.user.avatarUrl || "",
        });
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const copyReferralLink = () => {
    if (!userData?.referral?.referralCode) return;
    const url = `${window.location.origin}/early-access?ref=${userData.referral.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfileForm((prev) => ({ ...prev, avatarUrl: data.url }));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMessage("Profile updated successfully!");
        setEditingProfile(false);
        fetchUserData();
      } else {
        setProfileMessage(data.error?.message || "Failed to update profile.");
      }
    } catch (err) {
      setProfileMessage("An error occurred. Please try again.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-warm-ivory flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-champagne mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-muted-stone font-mono">
            Loading Member Portal...
          </p>
        </div>
      </div>
    );
  }

  const { user, referral, bookings = [], notifications = [] } = userData || {};

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 py-24 max-w-7xl mx-auto w-full">
        {/* Top Member Header Banner */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-warm-ivory/10 mb-8 relative overflow-hidden bg-noise">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-champagne/40 bg-deep-onyx flex items-center justify-center shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-editorial text-2xl text-champagne">{user?.name?.charAt(0) || "M"}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-3 py-0.5 bg-champagne/15 border border-champagne/40 text-champagne text-[10px] font-mono uppercase tracking-widest rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{referral?.currentTier?.badge || "Member"}</span>
                  </span>
                  <span className="text-xs text-muted-stone font-mono uppercase tracking-wider">
                    Tier: {referral?.currentTier?.name || "Explorer"}
                  </span>
                </div>
                <h1 className="font-editorial text-2xl md:text-4xl text-warm-ivory tracking-tight">
                  Welcome, {user?.name}
                </h1>
                <p className="text-xs text-muted-stone mt-0.5">
                  {user?.city ? `${user.city.charAt(0).toUpperCase() + user.city.slice(1)} Chapter` : "Global Member"} • Member since{" "}
                  {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg border border-warm-ivory/15 bg-deep-onyx/60 text-xs font-mono uppercase tracking-wider text-muted-stone hover:text-warm-ivory hover:border-warm-ivory/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-warm-ivory/10 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Sparkles },
            { id: "experiences", label: "My Experiences", icon: Ticket },
            { id: "referrals", label: "Referral Circle", icon: Share2 },
            { id: "profile", label: "Account Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell, badge: notifications.filter((n: any) => !n.read).length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  active
                    ? "bg-champagne text-obsidian font-semibold shadow-lg shadow-champagne/10"
                    : "bg-deep-onyx/50 border border-warm-ivory/5 text-muted-stone hover:text-warm-ivory hover:border-warm-ivory/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="w-4 h-4 rounded-full bg-champagne text-obsidian text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-6 rounded-xl border border-warm-ivory/10">
                <span className="text-[10px] uppercase font-mono text-muted-stone block mb-1">
                  Membership Tier
                </span>
                <div className="text-xl font-editorial text-champagne font-semibold">
                  {referral?.currentTier?.name || "Explorer"}
                </div>
                <div className="text-[11px] text-muted-stone mt-2">
                  {referral?.nextTier
                    ? `${referral.referralsNeededForNext} referrals to ${referral.nextTier.name}`
                    : "Highest tier unlocked"}
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-warm-ivory/10">
                <span className="text-[10px] uppercase font-mono text-muted-stone block mb-1">
                  Total Referrals
                </span>
                <div className="text-2xl font-editorial text-warm-ivory font-bold">
                  {referral?.totalReferrals || 0}
                </div>
                <div className="text-[11px] text-muted-stone mt-2">Verified guest invitations</div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-warm-ivory/10">
                <span className="text-[10px] uppercase font-mono text-muted-stone block mb-1">
                  Active Bookings / Interest
                </span>
                <div className="text-2xl font-editorial text-warm-ivory font-bold">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-muted-stone mt-2">Confidential passes</div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-warm-ivory/10">
                <span className="text-[10px] uppercase font-mono text-muted-stone block mb-1">
                  Personal Pass Code
                </span>
                <div className="text-lg font-mono text-champagne font-bold tracking-wider">
                  {referral?.referralCode}
                </div>
                <button
                  onClick={copyReferralLink}
                  className="text-[11px] text-muted-stone hover:text-champagne flex items-center gap-1 mt-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-champagne" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Link Copied!" : "Copy Share Link"}</span>
                </button>
              </div>
            </div>

            {/* Referral Progress Box */}
            <div className="glass-panel p-6 md:p-8 rounded-xl border border-warm-ivory/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-editorial text-xl text-warm-ivory">Referral Circle Progress</h3>
                  <p className="text-xs text-muted-stone mt-0.5">
                    Invite cultural connoisseurs to unlock priority seating, private dining, and unlisted drops.
                  </p>
                </div>
                <span className="text-xs font-mono text-champagne">
                  {referral?.progressPercent}% to next milestone
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-deep-onyx h-2 rounded-full overflow-hidden border border-warm-ivory/10 mb-6">
                <div
                  className="bg-gradient-to-r from-champagne to-champagne-light h-full transition-all duration-500 rounded-full"
                  style={{ width: `${referral?.progressPercent || 0}%` }}
                />
              </div>

              {/* Share link input */}
              <div className="flex items-center gap-3 bg-deep-onyx p-2 rounded-lg border border-warm-ivory/15">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/early-access?ref=${
                    referral?.referralCode
                  }`}
                  className="w-full bg-transparent text-xs text-muted-stone font-mono px-3 focus:outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded font-medium hover:bg-champagne-light transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Featured Upcoming Experiences CTA */}
            <div className="glass-card p-8 rounded-xl border border-warm-ivory/10 text-center">
              <Sparkles className="w-8 h-8 text-champagne mx-auto mb-3" />
              <h3 className="font-editorial text-2xl text-warm-ivory mb-2">Explore Seasonal Experiences</h3>
              <p className="text-xs text-muted-stone max-w-md mx-auto mb-6">
                Discover intimate culinary salons, secret listening rooms, and contemporary art viewings curated by Encoreats Directors.
              </p>
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 px-6 py-3 bg-champagne text-obsidian font-mono text-xs uppercase tracking-widest rounded-lg font-medium hover:bg-champagne-light transition-all"
              >
                <span>Browse Curated Drops</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: MY EXPERIENCES */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <h2 className="font-editorial text-2xl text-warm-ivory mb-4">My Bookings & Experiences</h2>
            {bookings.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-xl border border-warm-ivory/10">
                <Ticket className="w-10 h-10 text-muted-stone/40 mx-auto mb-3" />
                <h3 className="font-editorial text-xl text-warm-ivory mb-2">No Active Bookings Yet</h3>
                <p className="text-xs text-muted-stone max-w-sm mx-auto mb-6">
                  You have not reserved seats for an upcoming experience yet. Explore our active calendar.
                </p>
                <Link
                  href="/experiences"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne-light transition-all"
                >
                  View Active Experiences
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="glass-card p-6 rounded-xl border border-warm-ivory/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-champagne font-mono">
                      <span>{booking.experience?.category || "Cultural Experience"}</span>
                      <span className="uppercase px-2.5 py-0.5 rounded bg-champagne/10 border border-champagne/20 font-bold">
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl text-warm-ivory">{booking.experience?.title}</h3>
                    <div className="space-y-1.5 text-xs text-muted-stone">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-champagne" />
                        <span>{booking.experience?.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-champagne" />
                        <span>{booking.experience?.venueName}, {booking.experience?.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-warm-ivory/10 text-xs">
                      <span className="text-muted-stone">Pass Seats: {booking.seats}</span>
                      <span className="text-warm-ivory font-mono">
                        {booking.experience?.currency} {booking.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REFERRAL CIRCLE */}
        {activeTab === "referrals" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-editorial text-2xl text-warm-ivory mb-1">Referral Milestone Program</h2>
              <p className="text-xs text-muted-stone">
                Your personal invitation pass code unlocks exclusive perks as guests register.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-warm-ivory/10">
                <div>
                  <span className="text-[10px] uppercase font-mono text-muted-stone block mb-1">
                    Your Referral Code
                  </span>
                  <div className="text-3xl font-mono text-champagne font-bold tracking-widest">
                    {referral?.referralCode}
                  </div>
                </div>
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-3 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne-light transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Link Copied!" : "Copy Referral Link"}</span>
                </button>
              </div>

              <div className="mt-8">
                <h3 className="font-editorial text-xl text-warm-ivory mb-4">Milestone Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Explorer",
                      count: "0 Referrals",
                      desc: "Access to curated public cultural calendar and waiting list priority.",
                      unlocked: (referral?.totalReferrals || 0) >= 0,
                    },
                    {
                      name: "Priority Access",
                      count: "3 Referrals",
                      desc: "24-hour advance booking window and exclusive drop alerts.",
                      unlocked: (referral?.totalReferrals || 0) >= 3,
                    },
                    {
                      name: "Seasonal Priority",
                      count: "5 Referrals",
                      desc: "Complimentary concierge assistance and preferred table allocation.",
                      unlocked: (referral?.totalReferrals || 0) >= 5,
                    },
                    {
                      name: "Private Invitation Circle",
                      count: "10 Referrals",
                      desc: "Access to unlisted secret dining & art experiences, plus Founder Salons.",
                      unlocked: (referral?.totalReferrals || 0) >= 10,
                    },
                  ].map((tier, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border transition-all ${
                        tier.unlocked
                          ? "bg-champagne/10 border-champagne/40"
                          : "bg-deep-onyx/50 border-warm-ivory/5 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-editorial text-lg text-warm-ivory font-semibold">{tier.name}</span>
                        <span className="text-[11px] font-mono text-champagne px-2 py-0.5 rounded bg-champagne/10">
                          {tier.count}
                        </span>
                      </div>
                      <p className="text-xs text-muted-stone">{tier.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl text-warm-ivory">Account Profile</h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="px-4 py-2 bg-deep-onyx border border-warm-ivory/20 rounded-lg text-xs font-mono uppercase tracking-wider text-warm-ivory hover:border-champagne hover:text-champagne transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {profileMessage && (
              <div className="p-3.5 rounded-lg bg-champagne/10 border border-champagne/30 text-champagne text-xs">
                {profileMessage}
              </div>
            )}

            <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10">
              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                      Profile Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-champagne/40 bg-deep-onyx flex items-center justify-center">
                        {profileForm.avatarUrl ? (
                          <img src={profileForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-editorial text-2xl text-champagne">{profileForm.fullName?.charAt(0) || "M"}</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-input"
                        />
                        <label
                          htmlFor="avatar-input"
                          className="px-3.5 py-2 bg-deep-onyx border border-warm-ivory/20 rounded-lg text-xs font-mono uppercase tracking-wider text-warm-ivory cursor-pointer hover:border-champagne inline-flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5 text-champagne" />
                          <span>Change Photo</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-lg px-4 py-2.5 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-lg px-4 py-2.5 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Primary City
                    </label>
                    <select
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-lg px-4 py-2.5 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                    >
                      <option value="mumbai">Mumbai</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="delhi">Delhi NCR</option>
                      <option value="goa">Goa</option>
                      <option value="london">London</option>
                      <option value="dubai">Dubai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Member Bio / Taste Profile
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Share your culinary or cultural passions..."
                      className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-lg p-3 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="px-6 py-2.5 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne-light transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {updatingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2.5 border border-warm-ivory/20 text-xs font-mono uppercase tracking-wider text-muted-stone rounded-lg hover:text-warm-ivory cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Full Name
                    </label>
                    <p className="text-sm text-warm-ivory font-medium">{user?.name}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Email Address
                    </label>
                    <p className="text-sm text-warm-ivory font-mono">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Contact Phone
                    </label>
                    <p className="text-sm text-warm-ivory">{user?.phone || "Not specified"}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                      Primary City
                    </label>
                    <p className="text-sm text-warm-ivory">{user?.city ? user.city.toUpperCase() : "Not specified"}</p>
                  </div>

                  {user?.bio && (
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-1 font-mono">
                        Member Bio
                      </label>
                      <p className="text-xs text-muted-stone leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="font-editorial text-2xl text-warm-ivory mb-2">Member Notifications</h2>
            {notifications.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-xl border border-warm-ivory/10">
                <Bell className="w-8 h-8 text-muted-stone/40 mx-auto mb-3" />
                <p className="text-xs text-muted-stone">No new notifications.</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-2xl">
                {notifications.map((notif: any) => (
                  <div key={notif.id} className="glass-card p-4 rounded-lg border border-warm-ivory/10">
                    <div className="flex items-center justify-between text-[11px] font-mono text-champagne mb-1">
                      <span>{notif.title}</span>
                      <span className="text-muted-stone text-[10px]">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-stone">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
