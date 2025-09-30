-- CreateTable
CREATE TABLE "public"."Credit" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntityTranslation" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "credit_id" INTEGER,
    "offer_id" INTEGER,
    "onboarding_id" INTEGER,
    "plan_id" INTEGER,
    "promo_id" INTEGER,
    "reward_id" INTEGER,

    CONSTRAINT "EntityTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Offer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Onboarding" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "step" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Promo" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reward" (
    "id" SERIAL NOT NULL,
    "points" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityTranslation_credit_id_lang_idx" ON "public"."EntityTranslation"("credit_id", "lang");

-- CreateIndex
CREATE INDEX "EntityTranslation_offer_id_lang_idx" ON "public"."EntityTranslation"("offer_id", "lang");

-- CreateIndex
CREATE INDEX "EntityTranslation_onboarding_id_lang_idx" ON "public"."EntityTranslation"("onboarding_id", "lang");

-- CreateIndex
CREATE INDEX "EntityTranslation_plan_id_lang_idx" ON "public"."EntityTranslation"("plan_id", "lang");

-- CreateIndex
CREATE INDEX "EntityTranslation_promo_id_lang_idx" ON "public"."EntityTranslation"("promo_id", "lang");

-- CreateIndex
CREATE INDEX "EntityTranslation_reward_id_lang_idx" ON "public"."EntityTranslation"("reward_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_credit_id_lang_key" ON "public"."EntityTranslation"("credit_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_offer_id_lang_key" ON "public"."EntityTranslation"("offer_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_onboarding_id_lang_key" ON "public"."EntityTranslation"("onboarding_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_plan_id_lang_key" ON "public"."EntityTranslation"("plan_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_promo_id_lang_key" ON "public"."EntityTranslation"("promo_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "EntityTranslation_reward_id_lang_key" ON "public"."EntityTranslation"("reward_id", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "Promo_code_key" ON "public"."Promo"("code");

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "public"."Credit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_onboarding_id_fkey" FOREIGN KEY ("onboarding_id") REFERENCES "public"."Onboarding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "public"."Promo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTranslation" ADD CONSTRAINT "EntityTranslation_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "public"."Reward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
