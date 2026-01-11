-- name: GetSeasonsByFieldId :many
SELECT 
s.id,s.field_id,s.name,s.start_season,s.finish_season,s.crop,s.boundary,
  s.area_in_meters,s.created_at,s.updated_at,s.deleted_at,f.name as field_name,f.area_in_meters as field_area_in_meters,
  supplies.name as crop_name
FROM seasons s
JOIN supplies
ON supplies.id = crop
JOIN fields f
ON f.id = s.field_id
WHERE s.deleted_at IS NULL AND supplies.deleted_at IS NULL
AND s.field_id = $1
ORDER BY finish_season IS NULL DESC, updated_at DESC;

-- name: GetRemainingAreaOfFieldForSeason :one
SELECT
    f.area_in_meters - COALESCE(SUM(s.area_in_meters), 0) AS field_remaining_area
FROM fields f
LEFT JOIN seasons s
    ON s.field_id = f.id
    AND s.deleted_at IS NULL
    AND s.finish_season IS NULL
WHERE f.deleted_at IS NULL AND f.id = $1
GROUP BY f.area_in_meters;

-- name: CreateSeason :one
INSERT INTO seasons
(name,field_id,crop,area_in_meters,start_season)
VALUES ($1,$2,$3,$4,$5)returning *;

-- name: GetSeasonById :one
SELECT 
s.id,s.field_id,s.name,s.start_season,s.finish_season,s.crop,s.boundary,
  s.area_in_meters,s.created_at,s.updated_at,s.deleted_at,f.name as field_name,f.area_in_meters as field_area_in_meters,
  supplies.name as crop_name
FROM seasons s
JOIN supplies
ON supplies.id = crop
JOIN fields f
ON f.id = s.field_id
WHERE s.deleted_at IS NULL AND supplies.deleted_at IS NULL
AND s.field_id = $1 AND s.id = $2;

