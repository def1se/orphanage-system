-- Refactor children table to match the new data model
ALTER TABLE children.children RENAME COLUMN date_of_birth TO birth_date;
ALTER TABLE children.children RENAME COLUMN photo_url TO image_url;
ALTER TABLE children.children ADD COLUMN description TEXT;

-- Refactor medical_records to child_medical_records
ALTER TABLE children.medical_records RENAME TO child_medical_records;
ALTER TABLE children.child_medical_records RENAME COLUMN visit_date TO record_date;
ALTER TABLE children.child_medical_records ADD COLUMN record_type VARCHAR(50); -- MEDICAL, PSYCHOLOGICAL, SOCIAL
ALTER TABLE children.child_medical_records ADD COLUMN description TEXT;
ALTER TABLE children.child_medical_records ADD COLUMN created_by UUID; -- Link to User ID

-- We can drop columns that are not in the new model if they are not needed, 
-- but I'll keep them for now to avoid data loss unless they conflict.
-- The user didn't mention room_number, health_notes, education_notes in the new model.
-- I'll keep them as they might be useful, but the main model fields are now present.
