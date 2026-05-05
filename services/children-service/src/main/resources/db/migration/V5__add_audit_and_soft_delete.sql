-- V5: Adding Auditing and Soft Delete columns to the children table

ALTER TABLE children.children 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by VARCHAR(255),
ADD COLUMN updated_by VARCHAR(255);

-- Also add to other important tables in children-service
ALTER TABLE children.medical_records 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by VARCHAR(255),
ADD COLUMN updated_by VARCHAR(255);

ALTER TABLE children.education_records 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN created_by VARCHAR(255),
ADD COLUMN updated_by VARCHAR(255);
