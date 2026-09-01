"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, AlertCircle, ArrowRight, Upload, Check, ChevronLeft } from "lucide-react";
import { CITIES } from "@/data/cities";

export default function ApplyArtistPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "mumbai",
    discipline: "Executive Chef & Forager",
    bio: "",
    portfolioUrl: "",
    websiteUrl: "",
    experienceDesc: "",
    fileUrls: [] as string[],
    honeypot: "",
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const disciplines = [
    "Executive Chef & Forager",
    "Vinyl DJ & Audio Curator",
    "Acoustic Musician & Strings",
    "Comedian & Monologuist",
    "Visual & Atelier Artist",
    "Mixologist & Botanical Artist",
    "Cultural Creator & Other",
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

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email address required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (currentStep === 2) {
      if (!formData.bio.trim()) newErrors.bio = "Artistic biography is required";
      if (!formData.portfolioUrl.trim()) newErrors.portfolioUrl = "Portfolio or Instagram link is required";
    }

    if (currentStep === 3) {
      if (!formData.experienceDesc.trim()) newErrors.experienceDesc = "Describe your proposed experience concept";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all steps before submitting
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setServerError("Please correct form errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ARTIST",
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          discipline: formData.discipline,
          bio: formData.bio,
          portfolioUrl: formData.portfolioUrl,
          websiteUrl: formData.websiteUrl,
          experienceDesc: formData.experienceDesc,
          fileUrls: formData.fileUrls,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        let msg = data.error?.message;
        if (data.error?.details) {
          const detailKeys = Object.keys(data.error.details);
          if (detailKeys.length > 0) {
            msg = `Validation failed: ${detailKeys.map((k) => data.error.details[k].join(", ")).join("; ")}`;
          }
        }
        setServerError(msg || "Failed to submit artist application.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/apply/success?type=artist&name=${encodeURIComponent(formData.fullName)}`);
    } catch (err) {
      console.error("Artist application error:", err);
      setServerError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artist Application • Step {step} of 4</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory leading-[1.08] font-light">
              Submit your craft for <br />
              <span className="italic text-gradient-champagne">curation.</span>
            </h1>

            <p className="text-muted-stone text-base leading-relaxed font-light">
              Tell us about your culinary philosophy, musical vinyl vault, or artistic practice. We review applications on a rolling seasonal basis.
            </p>

            {/* Progress Stepper Bar */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-xs font-mono text-muted-stone">
                <span>Application Progress</span>
                <span className="text-champagne font-semibold">{step * 25}%</span>
              </div>
              <div className="w-full h-1.5 bg-deep-onyx rounded-full overflow-hidden border border-warm-ivory/10">
                <div
                  className="h-full bg-champagne transition-all duration-500"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden glass-panel border-warm-ivory/10 hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                alt="Artist Residency"
                fill
                className="object-cover filter brightness-[0.6]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            </div>
          </div>

          {/* Right Column: Multi-Step Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 sm:p-10 rounded-sm">
              {serverError && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Honeypot field */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* STEP 1: Identity */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 1 — Creator Identity
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Full Name / Artist Name <span className="text-champagne">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chef Kabir Oberoi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full bg-deep-onyx border ${
                        errors.fullName ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3.5 text-sm text-warm-ivory placeholder:text-muted-stone/50 focus:outline-none focus:border-champagne transition-colors`}
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
                        placeholder="artist@domain.com"
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
                        Primary Base City <span className="text-champagne">*</span>
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
                        Discipline <span className="text-champagne">*</span>
                      </label>
                      <select
                        value={formData.discipline}
                        onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                        className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                      >
                        {disciplines.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Creative Profile */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 2 — Creative Profile & Portfolio
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Short Bio & Background <span className="text-champagne">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your artistic practice, training, or culinary philosophy..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={`w-full bg-deep-onyx border ${
                        errors.bio ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                    />
                    {errors.bio && <p className="text-xs text-rose-400">{errors.bio}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Portfolio / Instagram Link <span className="text-champagne">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="instagram.com/chef_kabir"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className={`w-full bg-deep-onyx border ${
                          errors.portfolioUrl ? "border-rose-500" : "border-warm-ivory/20"
                        } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                      />
                      {errors.portfolioUrl && <p className="text-xs text-rose-400">{errors.portfolioUrl}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Website <span className="text-muted-stone">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="chefkabir.com"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Experience Concept */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 3 — Proposed Experience Concept
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Proposed Experience Concept <span className="text-champagne">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe the unrepeatable gathering you want to host (e.g., 10-course mystery tasting menu in a dark vault, analogue vinyl jazz night)..."
                      value={formData.experienceDesc}
                      onChange={(e) => setFormData({ ...formData, experienceDesc: e.target.value })}
                      className={`w-full bg-deep-onyx border ${
                        errors.experienceDesc ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                    />
                    {errors.experienceDesc && <p className="text-xs text-rose-400">{errors.experienceDesc}</p>}
                  </div>

                  {/* Portfolio Media Upload */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Portfolio Files / Lookbook (JPEG, PNG, PDF max 10MB)
                    </label>
                    <div className="border-2 border-dashed border-warm-ivory/20 rounded-xs p-6 text-center space-y-2 hover:border-champagne transition-colors">
                      <Upload className="w-6 h-6 text-champagne mx-auto" />
                      <div className="text-xs text-muted-stone">
                        {uploading ? (
                          <span className="animate-pulse">Uploading file to vault storage...</span>
                        ) : (
                          <span>Click to upload images or PDF lookbook</span>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <label
                        htmlFor="portfolio-upload"
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
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 4 — Review & Submit Application
                  </h2>

                  <div className="bg-deep-onyx p-6 rounded-xs space-y-4 border border-warm-ivory/10 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Applicant:</span>
                        <span className="text-warm-ivory font-medium">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Email:</span>
                        <span className="text-warm-ivory font-medium">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">City:</span>
                        <span className="text-warm-ivory font-medium">{formData.city}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Discipline:</span>
                        <span className="text-warm-ivory font-medium">{formData.discipline}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-warm-ivory/10">
                      <span className="text-muted-stone font-mono uppercase block">Portfolio URL:</span>
                      <span className="text-champagne font-mono">{formData.portfolioUrl}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-warm-ivory/10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-muted-stone hover:text-warm-ivory transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all rounded-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-warm-ivory transition-all rounded-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Final Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
