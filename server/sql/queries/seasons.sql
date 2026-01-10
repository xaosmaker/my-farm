-- name: GetSeasonsByFieldId :many
SELECT 
s.id,s.field_id,s.name,s.start_season,s.finish_season,s.crop,s.boundary,
  s.area_in_meters,s.created_at,s.updated_at,s.deleted_at,
  supplies.name as crop_name
FROM seasons s
JOIN supplies
ON supplies.id = crop
WHERE s.deleted_at IS NULL AND supplies.deleted_at IS NULL
AND s.field_id = $1;
