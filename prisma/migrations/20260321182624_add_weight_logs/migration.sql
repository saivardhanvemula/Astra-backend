-- CreateTable
CREATE TABLE "weight_logs" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "recorded_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weight_logs" ADD CONSTRAINT "weight_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
