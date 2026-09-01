"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, AlertCircle, ArrowRight, Upload, Check, ChevronLeft } from "lucide-react";
import { CITIES } from "@/data/cities";

export default function ApplyVenuePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    venueName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "mumbai",
    venueType: "Heritage Wada & Courtyard",
    capacity: "12 - 20 Guests",
    websiteUrl: "",
    venueDesc: "",
    fileUrls: [] as string[],
    honeypot: "",
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const venueTypes = [
    "Heritage Wada & Courtyard",
    "Subterranean Vault & Cellar",
    "Rooftop Observatory",
    "Art Gallery & Studio Loft",
    "Analogue Vinyl Room",
    "Private Estate & Villa",
    "Boutique Hotel & Pavilion",
    "Other Architectural Space",
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
      if (!formData.venueName.trim()) newErrors.venueName = "Venue name is required";
      if (!formData.contactName.trim()) newErrors.contactName = "Contact person name is required";
      if (!formData.email.trim()) newErrors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email address required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (currentStep === 2) {
      if (!formData.websiteUrl.trim()) newErrors.websiteUrl = "Website or social link is required";
      if (!formData.venueDesc.trim()) newErrors.venueDesc = "Description of atmosphere is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateStep(1) || !validateStep(2)) {
      setServerError("Please correct form errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VENUE",
          venueName: formData.venueName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          venueType: formData.venueType,
          capacity: formData.capacity,
          websiteUrl: formData.websiteUrl,
          venueDesc: formData.venueDesc,
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
        setServerError(msg || "Failed to submit venue application.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/apply/success?type=venue&name=${encodeURIComponent(formData.venueName)}`);
    } catch (err) {
      console.error("Venue application error:", err);
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
              <Building2 className="w-3.5 h-3.5" />
              <span>Venue Partnership • Step {step} of 3</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory leading-[1.08] font-light">
              Offer your space for <br />
              <span className="italic text-gradient-champagne">nocturnal curation.</span>
            </h1>

            <p className="text-muted-stone text-base leading-relaxed font-light">
              We partner with heritage courtyards, rooftops, galleries, and secret vaults. Transform off-peak hours into high-value cultural gatherings.
            </p>

            <div className="relative aspect-[4/3] rounded-sm overflow-hidden glass-panel border-warm-ivory/10 hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Venue Space"
                fill
                className="object-cover filter brightness-[0.6]"
              />
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

              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* STEP 1: Venue Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 1 — Venue Identity & Host Contact
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Venue Name <span className="text-champagne">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wada Heritage Estate"
                        value={formData.venueName}
                        onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                        className={`w-full bg-deep-onyx border ${
                          errors.venueName ? "border-rose-500" : "border-warm-ivory/20"
                        } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                      />
                      {errors.venueName && <p className="text-xs text-rose-400">{errors.venueName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Contact Person Name <span className="text-champagne">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Devika Raje"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`w-full bg-deep-onyx border ${
                          errors.contactName ? "border-rose-500" : "border-warm-ivory/20"
                        } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                      />
                      {errors.contactName && <p className="text-xs text-rose-400">{errors.contactName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Email Address <span className="text-champagne">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="host@wadaestate.com"
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                        Venue Type <span className="text-champagne">*</span>
                      </label>
                      <select
                        value={formData.venueType}
                        onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                        className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                      >
                        {venueTypes.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                        Seated Capacity <span className="text-champagne">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15 Guests"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Space Details & Photos */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 2 — Architectural Character & Media
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Website or Instagram Link <span className="text-champagne">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="instagram.com/wada_estate"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className={`w-full bg-deep-onyx border ${
                        errors.websiteUrl ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                    />
                    {errors.websiteUrl && <p className="text-xs text-rose-400">{errors.websiteUrl}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Venue Description & Atmosphere <span className="text-champagne">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your space, architectural features, acoustics, lighting capabilities, and privacy level..."
                      value={formData.venueDesc}
                      onChange={(e) => setFormData({ ...formData, venueDesc: e.target.value })}
                      className={`w-full bg-deep-onyx border ${
                        errors.venueDesc ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3 text-sm text-warm-ivory focus:outline-none focus:border-champagne`}
                    />
                    {errors.venueDesc && <p className="text-xs text-rose-400">{errors.venueDesc}</p>}
                  </div>

                  {/* Floorplan or Photos Upload */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                      Space Photos / Floor Plans (JPEG, PNG, PDF max 10MB)
                    </label>
                    <div className="border-2 border-dashed border-warm-ivory/20 rounded-xs p-6 text-center space-y-2 hover:border-champagne transition-colors">
                      <Upload className="w-6 h-6 text-champagne mx-auto" />
                      <div className="text-xs text-muted-stone">
                        {uploading ? <span className="animate-pulse">Uploading photos...</span> : <span>Upload photos of interior & seating layout</span>}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="venue-upload"
                      />
                      <label
                        htmlFor="venue-upload"
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

              {/* STEP 3: Final Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-editorial text-2xl text-warm-ivory border-b border-warm-ivory/10 pb-4">
                    Step 3 — Final Review
                  </h2>

                  <div className="bg-deep-onyx p-6 rounded-xs space-y-4 border border-warm-ivory/10 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Venue:</span>
                        <span className="text-warm-ivory font-medium">{formData.venueName}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Contact:</span>
                        <span className="text-warm-ivory font-medium">{formData.contactName}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Type:</span>
                        <span className="text-warm-ivory font-medium">{formData.venueType}</span>
                      </div>
                      <div>
                        <span className="text-muted-stone font-mono uppercase block">Capacity:</span>
                        <span className="text-warm-ivory font-medium">{formData.capacity}</span>
                      </div>
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

                {step < 3 ? (
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
                        <span>Submit Venue Application</span>
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
