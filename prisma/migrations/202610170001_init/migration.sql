-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'CONTACTED', 'WON', 'CLOSED');

-- CreateEnum
CREATE TYPE "JobKind" AS ENUM ('INTERNAL_MAIL', 'RECEIPT_MAIL', 'WEBHOOK', 'DOUBLE_OPT_IN');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "size" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "budget" TEXT,
    "contactWay" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'Bearbeitung einer Prozessanalyse-Anfrage',
    "privacyVersion" TEXT NOT NULL DEFAULT '2026-10-17',
    "marketingRequested" BOOLEAN NOT NULL DEFAULT false,
    "marketingConfirmedAt" TIMESTAMP(3),
    "marketingTokenHash" TEXT,
    "marketingTokenExpires" TIMESTAMP(3),
    "objectionAt" TIMESTAMP(3),
    "suppressed" BOOLEAN NOT NULL DEFAULT false,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "lastContactAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outbox" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" "JobKind" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedUntil" TIMESTAMP(3),
    "claimToken" TEXT,
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "actor" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateBucket_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "WebhookReceipt" (
    "eventId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookReceipt_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_requestKey_key" ON "Lead"("requestKey");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_marketingTokenHash_key" ON "Lead"("marketingTokenHash");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Outbox_sentAt_availableAt_idx" ON "Outbox"("sentAt", "availableAt");

-- CreateIndex
CREATE UNIQUE INDEX "Outbox_leadId_kind_key" ON "Outbox"("leadId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Activity_leadId_createdAt_idx" ON "Activity"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "RateBucket_expiresAt_idx" ON "RateBucket"("expiresAt");

-- AddForeignKey
ALTER TABLE "Outbox" ADD CONSTRAINT "Outbox_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
