-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" SERIAL NOT NULL,
    "plate" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "detection_time" TIMESTAMP(3) NOT NULL,
    "confidence" DECIMAL(5,2) NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);
