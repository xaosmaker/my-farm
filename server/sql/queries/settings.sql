-- name: UpdateSettings :one
update settings set land_unit=$1
WHERE user_id = $2
returning *;

-- name: GetUserSettings :one
SELECT * FROM settings
WHERE user_id = $1;
