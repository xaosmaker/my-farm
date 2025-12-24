
-- name: CreateField :one
INSERT INTO fields (
  name,
  epsg_2100_boundary, 
  epsg_4326_boundary, 
  field_location, 
  area_in_meters, 
  is_owned,
  farm_id,
  created_at,
  updated_at
)VALUES(
  $1,
  sqlc.narg('epsg_2100_boundary'),
  sqlc.narg('epsg_4326_boundary'),
  sqlc.narg('field_location'),
  $5,
  $6,
  $7,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
  )RETURNING *;

-- name: UpdateField :one
UPDATE  fields SET
  updated_at = CURRENT_TIMESTAMP,
  name = COALESCE(sqlc.narg('name'),name),
  epsg_2100_boundary =
    COALESCE(sqlc.narg('epsg_2100_boundary'),epsg_2100_boundary),
  epsg_4326_boundary =
    COALESCE(sqlc.narg('epsg_4326_boundary'),epsg_4326_boundary),
  area_in_meters =COALESCE(sqlc.narg('area_in_meters'),area_in_meters),
  field_location = COALESCE(sqlc.narg('field_location'),field_location),
  is_owned = COALESCE(sqlc.narg('is_owned'),is_owned)
WHERE id = $1
  RETURNING *;


-- name: GetFieldByIdAndUser :one
select * FROM fields
WHERE deleted_at IS NULL AND fields.id = sqlc.arg('field_id') AND fields.farm_id = (
  SELECT id FROM farms
  WHERE deleted_at IS NULL AND farms.id = (
    SELECT farm_id FROM users
    WHERE deleted_at IS NULL AND users.id = sqlc.arg('user_id')
  )
);

-- name: DeleteField :exec
DELETE FROM fields
WHERE id = $1;

-- name: GetAllFields :many
select * FROM fields
WHERE deleted_at IS NULL AND fields.farm_id = (
  SELECT id FROM farms
  WHERE deleted_at IS NULL AND farms.id = (
    SELECT farm_id FROM users
    WHERE deleted_at IS NULL AND users.id = sqlc.arg('user_id')
  )
);
