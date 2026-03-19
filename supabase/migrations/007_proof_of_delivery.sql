-- Add proof-of-delivery photo URL to delivery_assignments
-- Populated from Onfleet taskCompleted webhook when driver takes a photo.

ALTER TABLE delivery_assignments ADD COLUMN proof_of_delivery_url TEXT;
