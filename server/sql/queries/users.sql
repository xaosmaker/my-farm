-- name: GetAllUsers :many
select * from users;

-- name: UpdateUser :exec
UPDATE users SET
password = COALESCE(sqlc.narg('password'),password),
is_active = COALESCE(sqlc.narg('is_active'),is_active),
farm_id = COALESCE(sqlc.narg('farm_id'),farm_id),
updated_at = now()
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE users.deleted_at IS NULL AND users.is_active = TRUE AND email = $1;

-- name: GetUserByEmailNotActive :one
SELECT * FROM users
WHERE users.deleted_at IS NULL AND email = $1;

-- name: GetUserBYId :one
SELECT * FROM users
WHERE users.deleted_at IS NULL AND id = $1;

-- name: GetUserByIdWithSettings :one
SELECT * FROM users
JOIN settings
ON users.id = settings.user_id
WHERE users.deleted_at IS NULL AND users.id = $1;

-- name: CreateUser :one
WITH new_user AS (
INSERT INTO users (
created_at,
updated_at,
email,
password
)values(
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP,
    $1,
    $2 
)RETURNING *
),
new_settings as(

INSERT INTO settings(
user_id
)
select id from new_user
)
select * from new_user;

