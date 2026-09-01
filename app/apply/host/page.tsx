"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, AlertCircle, ArrowRight, Upload, Check } from "lucide-react";
import { CITIES } from "@/data/cities";

export default function ApplyHostPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "mumbai",
    conceptTitle: "",
    category: "Culinary Tasting",
    description: "",
    targetAudience: "",
    estimatedCapacity: "10-15 Guests",
    websiteUrl: "",
    fileUrls: [] as string[],
    honeypot: "",
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const categories = [
    "Culinary Tasting & Secret Supper",
    "Analogue Vinyl Listening",
    "Private Gallery & Salon",
    "Storytelling & Acoustic Night",
    "Botanical Mixology & Craft",
    "Rooftop Stargazing & Tea",
    "Other Curated Concept",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setServerError(null);

    const uploadedUrls: string[] = [...formData.fileUrls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await fetch("/api/uploads", {
          method: "POST",
          body: data,
        });

        const result = await res.json();
        if (res.ok && result.success) {
          uploadedUrls.push(result.url);
        } else {
          setServerError(result.error?.message || "File upload failed.");
        }
      } catch (err) {
        console.error("File upload error:", err);
        setServerError("Failed to upload file.");
      }
    }

    setFormData((prev) => ({ ...prev, fileUrls: uploadedUrls }));
    setUploading(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email address required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.conceptTitle.trim()) newErrors.conceptTitle = "Concept title is required";
    if (!formData.description.trim()) newErrors.description = "Detailed description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "HOST",
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          conceptTitle: formData.conceptTitle,
          category: formData.category,
          description: formData.description,
          targetAudience: formData.targetAudience,
          estimatedCapacity: formData.estimatedCapacity,
          websiteUrl: formData.websiteUrl,
          fileUrls: formData.fileUrls,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error?.message || "Failed to submit host application.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/apply/success?type=host&name=${encodeURIComponent(formData.fullName)}`);
    } catch (err) {
      console.error("Host application error:", err);
      setServerError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Experience Host Application</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory leading-[1.08] font-light">
              Host experiences worth <br />
              <span className="italic text-gradient-champagne">showing up for.</span>
            </h1>

            <p className="text-muted-stone text-base leading-relaxed font-light">
              You bring the perspective and expertise. Encoreats provides the audience, guest flow, and production framework.
            </p>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 sm:p-10 rounded-sm">
              <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                Host & Concept Details
              </h2>

              {serverError && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                  Full Name / Host Name <span className="text-champagne">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full bg-deep-onyx border ${
                    errors.fullName ? "border-rose-500" : "border-warm-ivory/20"
                  } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                />
                {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Email Address <span className="text-champagne">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="host@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-deep-onyx border ${
                      errors.email ? "border-rose-500" : "border-warm-ivory/20"
                    } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                  />
                  {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Phone Number <span className="text-champagne">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full bg-deep-onyx border ${
                      errors.phone ? "border-rose-500" : "border-warm-ivory/20"
                    } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                  />
                  {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    City <span className="text-champagne">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Concept Category <span className="text-champagne">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                  Concept Title <span className="text-champagne">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Analogue Jazz & Fermented Tea Salon"
                  value={formData.conceptTitle}
                  onChange={(e) => setFormData({ ...formData, conceptTitle: e.target.value })}
                  className={`w-full bg-deep-onyx border ${
                    errors.conceptTitle ? "border-rose-500" : "border-warm-ivory/20"
                  } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                />
                {errors.conceptTitle && <p className="text-xs text-rose-400">{errors.conceptTitle}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                  Detailed Experience Description <span className="text-champagne">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what guests will experience, host background, timing, atmosphere..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full bg-deep-onyx border ${
                    errors.description ? "border-rose-500" : "border-warm-ivory/20"
                  } rounded-xs px-4 py-3 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                />
                {errors.description && <p className="text-xs text-rose-400">{errors.description}</p>}
              </div>

              {/* Uploads */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                  Supporting Files / Photos (Optional max 10MB)
                </label>
                <div className="border-2 border-dashed border-warm-ivory/20 rounded-xs p-6 text-center space-y-2">
                  <Upload className="w-6 h-6 text-champagne mx-auto" />
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="host-upload"
                  />
                  <label
                    htmlFor="host-upload"
                    className="inline-block px-4 py-2 bg-deep-onyx text-xs uppercase tracking-widest text-warm-ivory border border-warm-ivory/20 cursor-pointer rounded-xs"
                  >
                    Browse Files
                  </label>
                </div>

                {formData.fileUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.fileUrls.map((url, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-deep-onyx border border-champagne/40 text-[11px] font-mono text-champagne rounded-xs">
                        <Check className="w-3 h-3 text-emerald-400" />
                        File {idx + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-warm-ivory transition-all rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Transmitting Application...</span>
                ) : (
                  <>
                    <span>Submit Host Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
