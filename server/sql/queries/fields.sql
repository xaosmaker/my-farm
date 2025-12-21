-- name: GetAllFields :many
select * from "farm_field";



-- name: CreateField :one
INSERT INTO "farm_field"(
  created_at,
  edited_at, 
  field_name,
  field_epsg_2100_boundary, 
  field_epsg_4326_boundary, 
  field_area_in_meters, 
  field_location, 
  farm_field_id,
  is_owned 
)VALUES(
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  $1,
  sqlc.narg('field_epsg_2100_boundary'),
  sqlc.narg('field_epsg_4326_boundary'),
  $4,
  sqlc.narg('field_location'),
  $6,
  $7
  )RETURNING *;

-- name: UpdateField :one
UPDATE  "farm_field" SET
  edited_at = CURRENT_TIMESTAMP,
  field_name = COALESCE(sqlc.narg('field_name'),field_name),
  field_epsg_2100_boundary =
          COALESCE(sqlc.narg('field_epsg_2100_boundary'),field_epsg_2100_boundary),
  field_epsg_4326_boundary =
          COALESCE(sqlc.narg('field_epsg_4326_boundary'),field_epsg_4326_boundary),
  field_area_in_meters =COALESCE(sqlc.narg('field_area_in_meters'),field_area_in_meters),
  field_location = COALESCE(sqlc.narg('field_location'),field_location),
  -- farm_field_id = COALESCE(sqlc.narg('farm_field_id'),farm_field_id),
  is_owned = COALESCE(sqlc.narg('is_owned'),is_owned)
WHERE id = $1
  RETURNING *;

