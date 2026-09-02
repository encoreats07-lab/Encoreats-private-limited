-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'PARTNER', 'ADMIN', 'ARTIST', 'VENUE_OWNER', 'HOST', 'STAFF');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('ARTIST', 'VENUE', 'HOST');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PENDING', 'UNDER_REVIEW', 'REQUEST_MORE_INFO', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'BASIC_VERIFIED', 'IDENTITY_VERIFIED', 'BUSINESS_VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PartnerDocumentType" AS ENUM ('GOVERNMENT_ID', 'ADDRESS_PROOF', 'BUSINESS_DOCUMENT', 'BANK_DOCUMENT', 'TAX_DOCUMENT', 'PORTFOLIO', 'VENUE_MEDIA', 'PROFILE_MEDIA', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('INTERESTED', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "EarlyAccessStatus" AS ENUM ('PENDING', 'CONFIRMED', 'INVITED', 'REVOKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'AUTH', 'BOOKING', 'REFERRAL', 'EARLY_ACCESS', 'PARTNER', 'KYC', 'ADMIN', 'EXPERIENCE');

-- CreateEnum
CREATE TYPE "ExperienceStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "googleId" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "interests" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "verifyTokenExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "otpCode" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarlyAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "status" "EarlyAccessStatus" NOT NULL DEFAULT 'PENDING',
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarlyAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUALIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "companyName" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "portfolioUrl" TEXT,
    "discipline" TEXT,
    "venueType" TEXT,
    "capacity" TEXT,
    "conceptTitle" TEXT,
    "description" TEXT,
    "data" TEXT NOT NULL DEFAULT '{}',
    "fileUrls" TEXT NOT NULL DEFAULT '[]',
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "businessName" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "portfolioUrl" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kycData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerVerification" (
    "id" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "level" "KycStatus" NOT NULL,
    "notes" TEXT,
    "reviewedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerDocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "partnerProfileId" TEXT,
    "documentType" "PartnerDocumentType" NOT NULL DEFAULT 'PORTFOLIO',
    "title" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "capacity" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "artistName" TEXT,
    "heroImage" TEXT NOT NULL,
    "galleryImages" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ExperienceStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'INTERESTED',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "caption" TEXT,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "actionUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "adminId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccess_userId_key" ON "EarlyAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccess_email_key" ON "EarlyAccess"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccess_referralCode_key" ON "EarlyAccess"("referralCode");

-- CreateIndex
CREATE INDEX "EarlyAccess_referralCode_idx" ON "EarlyAccess"("referralCode");

-- CreateIndex
CREATE INDEX "EarlyAccess_email_idx" ON "EarlyAccess"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredUserId_key" ON "Referral"("referredUserId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "PartnerApplication_email_idx" ON "PartnerApplication"("email");

-- CreateIndex
CREATE INDEX "PartnerApplication_type_idx" ON "PartnerApplication"("type");

-- CreateIndex
CREATE INDEX "PartnerApplication_status_idx" ON "PartnerApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProfile_userId_key" ON "PartnerProfile"("userId");

-- CreateIndex
CREATE INDEX "PartnerProfile_userId_idx" ON "PartnerProfile"("userId");

-- CreateIndex
CREATE INDEX "PartnerProfile_kycStatus_idx" ON "PartnerProfile"("kycStatus");

-- CreateIndex
CREATE INDEX "PartnerVerification_partnerProfileId_idx" ON "PartnerVerification"("partnerProfileId");

-- CreateIndex
CREATE INDEX "PartnerDocument_applicationId_idx" ON "PartnerDocument"("applicationId");

-- CreateIndex
CREATE INDEX "PartnerDocument_partnerProfileId_idx" ON "PartnerDocument"("partnerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_slug_idx" ON "Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_city_idx" ON "Experience"("city");

-- CreateIndex
CREATE INDEX "Experience_category_idx" ON "Experience"("category");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_experienceId_idx" ON "Booking"("experienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_experienceId_status_key" ON "Booking"("userId", "experienceId", "status");

-- CreateIndex
CREATE INDEX "ExperienceReview_userId_idx" ON "ExperienceReview"("userId");

-- CreateIndex
CREATE INDEX "ExperienceReview_experienceId_idx" ON "ExperienceReview"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceMemory_userId_idx" ON "ExperienceMemory"("userId");

-- CreateIndex
CREATE INDEX "ExperienceMemory_experienceId_idx" ON "ExperienceMemory"("experienceId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "AdminNote_applicationId_idx" ON "AdminNote"("applicationId");

-- CreateIndex
CREATE INDEX "AdminNote_adminId_idx" ON "AdminNote"("adminId");

-- CreateIndex
CREATE INDEX "AuditLog_adminId_idx" ON "AuditLog"("adminId");

-- AddForeignKey
ALTER TABLE "EarlyAccess" ADD CONSTRAINT "EarlyAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerProfile" ADD CONSTRAINT "PartnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerVerification" ADD CONSTRAINT "PartnerVerification_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDocument" ADD CONSTRAINT "PartnerDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PartnerApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerDocument" ADD CONSTRAINT "PartnerDocument_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceReview" ADD CONSTRAINT "ExperienceReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceReview" ADD CONSTRAINT "ExperienceReview_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceMemory" ADD CONSTRAINT "ExperienceMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceMemory" ADD CONSTRAINT "ExperienceMemory_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PartnerApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

