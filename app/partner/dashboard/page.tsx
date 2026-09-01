"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  Upload,
  User,
  Globe,
  Share2,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  AlertCircle,
  Loader2,
  FileCheck
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

interface PartnerProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  partnerProfile?: {
    businessName: string;
    bio: string;
    website: string;
    instagram: string;
    verified: boolean;
    kycStatus: string;
  };
  partnerApplication?: {
    id: string;
    type: string;
    status: string;
    createdAt: string;
  };
}

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PartnerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingKyc, setUploadingKyc] = useState(false);
  const [kycMessage, setKycMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPartnerInfo();
  }, []);

  const fetchPartnerInfo = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!res.ok || !data.user) {
        router.push("/login");
        return;
      }

      setProfile(data.user);
    } catch (err) {
      console.error("Partner dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKyc(true);
    setKycMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload file
      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        setKycMessage(uploadData.error?.message || "File upload failed.");
        setUploadingKyc(false);
        return;
      }

      // 2. Submit KYC record
      const kycRes = await fetch("/api/partners/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: "GOVERNMENT_ID",
          title: file.name,
          fileUrl: uploadData.url,
          fileSize: file.size,
        }),
      });

      const kycData = await kycRes.json();
      if (kycRes.ok && kycData.success) {
        setKycMessage("KYC Document uploaded securely to vault!");
        fetchPartnerInfo();
      } else {
        setKycMessage(kycData.error?.message || "Failed to save document.");
      }
    } catch (err) {
      setKycMessage("An unexpected upload error occurred.");
    } finally {
      setUploadingKyc(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian text-warm-ivory flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-champagne animate-pulse mx-auto" />
          <p className="text-xs uppercase tracking-widest font-mono text-muted-stone">
            Loading Partner Atelier...
          </p>
        </div>
      </div>
    );
  }

  const isApproved = profile?.role === "PARTNER" || profile?.role === "ADMIN" || profile?.partnerProfile?.verified;
  const appStatus = profile?.partnerApplication?.status || "PENDING";
  const kycStatus = profile?.partnerProfile?.kycStatus || "PENDING";

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden bg-noise">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Banner */}
          <div className="glass-panel p-8 sm:p-10 rounded-xl border border-warm-ivory/10 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-[10px] uppercase tracking-widest font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Partner Portal</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-warm-ivory font-light">
                Welcome, {profile?.name}
              </h1>
              <p className="text-xs text-muted-stone font-light">
                Primary Atelier Location: <span className="text-warm-ivory uppercase font-mono">{profile?.city || "Mumbai"}</span>
              </p>
            </div>

            <div className="z-10 flex flex-wrap gap-3">
              <Link
                href="/partners"
                className="px-4 py-2.5 rounded-lg border border-warm-ivory/20 text-xs font-mono uppercase tracking-wider text-warm-ivory hover:border-champagne hover:text-champagne transition-all"
              >
                View Atelier Guidelines
              </Link>
              <Link
                href="/apply/artist"
                className="px-4 py-2.5 rounded-lg bg-champagne text-obsidian font-medium text-xs uppercase tracking-wider hover:bg-champagne-light transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Experience Concept</span>
              </Link>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Verification & KYC */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10 space-y-5">
                <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-4">
                  <h3 className="font-editorial text-lg text-warm-ivory">Verification Status</h3>
                  {isApproved ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase">
                      Verified Partner
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-mono uppercase">
                      {appStatus}
                    </span>
                  )}
                </div>

                <div className="space-y-4 text-xs text-muted-stone">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isApproved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                    <span>Creative Application Review</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${kycStatus !== "PENDING" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span>KYC & Document Audit</span>
                    {kycStatus !== "PENDING" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" /> : <Clock className="w-4 h-4 text-muted-stone ml-auto" />}
                  </div>
                </div>
              </div>

              {/* KYC Document Uploads */}
              <div className="glass-panel p-6 rounded-xl border border-warm-ivory/10 space-y-4">
                <h3 className="font-editorial text-lg text-warm-ivory">Identity & KYC Verification</h3>
                <p className="text-xs text-muted-stone leading-relaxed">
                  Required for commercial payout distribution and legal compliance. Upload sensitive documents securely.
                </p>

                {kycMessage && (
                  <div className="p-3 rounded bg-champagne/10 border border-champagne/30 text-champagne text-xs font-mono">
                    {kycMessage}
                  </div>
                )}

                <div className="border-2 border-dashed border-warm-ivory/20 rounded-xl p-6 text-center space-y-3 hover:border-champagne/50 transition-colors">
                  {uploadingKyc ? (
                    <Loader2 className="w-6 h-6 text-champagne animate-spin mx-auto" />
                  ) : (
                    <Upload className="w-6 h-6 text-champagne mx-auto" />
                  )}
                  <div className="text-xs text-warm-ivory font-mono">
                    Upload Government ID / Business Proof
                  </div>
                  <p className="text-[10px] text-muted-stone font-mono">
                    PDF, PNG, JPG or WEBP (Max 10MB)
                  </p>
                  <label className="inline-block px-4 py-2 bg-deep-onyx border border-warm-ivory/20 hover:border-champagne text-xs font-mono uppercase text-champagne rounded cursor-pointer transition-colors">
                    <span>Select Document</span>
                    <input
                      type="file"
                      disabled={uploadingKyc}
                      onChange={handleKycUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Middle & Right Col: Partner Profile & Collaborations */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Partner Profile Card */}
              <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10 space-y-6">
                <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-4">
                  <h3 className="font-editorial text-xl text-warm-ivory">Atelier Profile Overview</h3>
                  <Link href="/dashboard" className="text-xs text-champagne font-mono uppercase hover:underline">
                    Edit Account Profile
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-muted-stone font-mono uppercase text-[10px] block mb-1">
                      Display Name
                    </span>
                    <div className="text-warm-ivory font-medium text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-champagne" />
                      <span>{profile?.partnerProfile?.businessName || profile?.name}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-stone font-mono uppercase text-[10px] block mb-1">
                      Registered Email
                    </span>
                    <div className="text-warm-ivory font-mono text-sm">
                      {profile?.email}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-stone font-mono uppercase text-[10px] block mb-1">
                      Portfolio / Website
                    </span>
                    <div className="text-warm-ivory font-mono flex items-center gap-2">
                      <Globe className="w-4 h-4 text-champagne" />
                      <a href={profile?.partnerProfile?.website || "#"} target="_blank" rel="noreferrer" className="hover:text-champagne transition-colors">
                        {profile?.partnerProfile?.website || "Not provided"}
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-stone font-mono uppercase text-[10px] block mb-1">
                      Instagram Handle
                    </span>
                    <div className="text-warm-ivory font-mono flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-champagne" />
                      <span>{profile?.partnerProfile?.instagram || "Not provided"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-muted-stone font-mono uppercase text-[10px] block mb-1">
                    Artistic Bio / Space Description
                  </span>
                  <p className="text-xs text-muted-stone leading-relaxed bg-deep-onyx p-4 rounded-lg border border-warm-ivory/10">
                    {profile?.partnerProfile?.bio || "No bio submitted yet. Update your atelier profile to present your creative statement to curators."}
                  </p>
                </div>
              </div>

              {/* Active & Past Experiences */}
              <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10 space-y-6">
                <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-4">
                  <h3 className="font-editorial text-xl text-warm-ivory">Seasonal Collaborations</h3>
                  <span className="text-xs font-mono text-muted-stone">0 Active Drops</span>
                </div>

                <div className="text-center py-12 space-y-4 bg-deep-onyx/50 rounded-xl border border-warm-ivory/10">
                  <Building2 className="w-10 h-10 text-muted-stone mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-editorial text-lg text-warm-ivory">No Scheduled Experiences</h4>
                    <p className="text-xs text-muted-stone max-w-sm mx-auto">
                      Once your partner verification is complete, proposed intimate dining tables, sound salons, and space activations will appear here.
                    </p>
                  </div>
                  <Link
                    href="/apply/artist"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-champagne text-obsidian text-xs uppercase tracking-wider font-medium hover:bg-champagne-light transition-all"
                  >
                    <span>Propose New Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
