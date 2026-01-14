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

-- name: DeleteSupply :exec
DELETE FROM supplies
WHERE supplies.deleted_at IS NULL 
AND supplies.farm_id = $1 AND id = $2;

-- name: UpdateSupply :exec
UPDATE supplies set
supply_type = COALESCE(sqlc.narg('supply_type'),supply_type),
nickname = COALESCE(sqlc.narg('nickname'),nickname),
name = COALESCE(sqlc.narg('name'),name),
measurement_unit = COALESCE(sqlc.narg('measurement_unit'),measurement_unit),
updated_at = CURRENT_TIMESTAMP
WHERE supplies.id = $1;

