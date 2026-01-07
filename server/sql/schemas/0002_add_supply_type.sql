-- +goose up
CREATE DOMAIN supplies_types as TEXT NOT NULL
CONSTRAINT must_be_chemicals_or_fertilizers
CHECK (VALUE IN ('chemicals','fertilizers','seeds'));

CREATE DOMAIN measurement_units_type as TEXT NOT NULL
CONSTRAINT must_be_KG_or_L
CHECK (VALUE IN ('KG','L'));

ALTER TABLE supplies
ALTER COLUMN supply_type TYPE supplies_types;

ALTER TABLE supplies
ALTER COLUMN measurement_unit TYPE measurement_units_type;

-- +goose down

ALTER TABLE supplies
ALTER COLUMN supply_type TYPE varchar(255);

ALTER TABLE supplies
ALTER COLUMN measurement_unit TYPE varchar(255);

DROP DOMAIN supplies_types;
DROP DOMAIN measurement_units_type;
