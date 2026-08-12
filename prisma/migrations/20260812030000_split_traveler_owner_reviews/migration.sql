-- Permite que propietario y viajero publiquen una valoración independiente
-- sobre la misma reserva, manteniendo una única valoración por autor.
DROP INDEX IF EXISTS "Review_bookingId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Review_bookingId_authorId_key" ON "Review"("bookingId", "authorId");
CREATE INDEX IF NOT EXISTS "Review_subjectId_subjectRole_rating_idx" ON "Review"("subjectId", "subjectRole", "rating");
