-- name: GetAllUsers :many
select * from users;


-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUserBYId :one
SELECT * FROM users
WHERE id = $1;

-- name: CreateUser :one
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
)RETURNING * ;

