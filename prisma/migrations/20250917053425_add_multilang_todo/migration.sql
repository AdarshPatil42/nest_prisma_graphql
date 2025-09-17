-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "content" JSONB,
ADD COLUMN     "content_de" JSONB,
ADD COLUMN     "content_en" JSONB,
ADD COLUMN     "content_es" JSONB;

-- CreateTable
CREATE TABLE "public"."TodoTranslation" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "todoId" INTEGER NOT NULL,

    CONSTRAINT "TodoTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TodoTranslation_todoId_lang_key" ON "public"."TodoTranslation"("todoId", "lang");

-- AddForeignKey
ALTER TABLE "public"."TodoTranslation" ADD CONSTRAINT "TodoTranslation_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
