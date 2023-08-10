ALTER TABLE customer
ADD COLUMN profile_image VARCHAR(255);

ALTER TABLE customer
ADD CONSTRAINT customer_profile_image_unique
UNIQUE (profile_image);