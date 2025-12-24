-- name: GetFarm :one
SELECT *
FROM farms
WHERE deleted_at IS NULL AND id = (
SELECT farm_id FROM users
where deleted_at IS NULL AND users.id = $1
);

-- name: CreateFarm :one
with ins_farm as (
INSERT INTO farms (created_at,updated_at,name)
VALUES(
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
    $1
  )RETURNING * 
),
update_user as (

UPDATE users SET farm_id=(select id from ins_farm)
  WHERE users.id = $2
) select * from ins_farm;

-- name: UpdateFarm :one
UPDATE farms
SET 
updated_at=CURRENT_TIMESTAMP,
name=COALESCE(sqlc.narg('farm_name') ,name)
WHERE id=$2
RETURNING *;
