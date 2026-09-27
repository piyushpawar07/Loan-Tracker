/*
  Warnings:

  - You are about to drop the `loan_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "loan_documents" DROP CONSTRAINT "loan_documents_loan_id_fkey";

-- DropTable
DROP TABLE "loan_documents";

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_loan_id_idx" ON "documents"("loan_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
