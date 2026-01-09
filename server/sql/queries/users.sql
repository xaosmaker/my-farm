-- name: GetAllUsers :many
select * from users;


-- name: GetUserByEmail :one
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

-- name: CreateUser :exec
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
)
INSERT INTO settings(
user_id
)
select id from new_user;

