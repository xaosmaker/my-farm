-- name: GetSeasonsByFieldId :many
SELECT * FROM seasons 
WHERE deleted_at IS NULL
AND field_id = $1;
