-- name: GetFarm :one
SELECT * 
FROM "farm" 
WHERE id = (
SELECT farm_id FROM "user"
where "user".id = $1
);



-- name: CreateFarm :one
with ins_farm as (
INSERT INTO "farm" (created_at,edited_at,farm_name)
VALUES(
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
    $1
  )RETURNING * 
),
update_user as (

UPDATE "user" SET farm_id=(select id from ins_farm)
  WHERE "user".id = $2
) select * from ins_farm;

-- name: UpdateFarm :one
UPDATE "farm" 
SET 
edited_at=CURRENT_TIMESTAMP,
farm_name=COALESCE(sqlc.narg('farm_name') ,farm_name)
WHERE id=$2
RETURNING * ;
