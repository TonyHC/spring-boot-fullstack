CREATE SEQUENCE customer_id_sequence;

CREATE TABLE IF NOT EXISTS customer (
  customer_id BIGINT DEFAULT nextval('customer_id_sequence') PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INT NOT NULL,
  CONSTRAINT customer_email_unique UNIQUE (email)
);