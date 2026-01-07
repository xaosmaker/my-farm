-- name: CreateSupplies :one
INSERT INTO supplies (
supply_type,
nickname,
name,
measurement_unit,
farm_id,
created_at,
updated_at
)VALUES(
  $1,
  $2,
  $3,
  $4,
  $5,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
  ) RETURNING *;

-- name: GetAllSupplies :many
SELECT * FROM supplies
WHERE farm_id = $1
AND deleted_at IS NULL;

-- name: GetSupplyDetails :one
SELECT * FROM supplies 
WHERE deleted_at IS NULL 
AND supplies.farm_id = $1
AND supplies.id = $2;



