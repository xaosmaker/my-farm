-- name: GetAllUsers :many
select * from "user";


-- name: GetUserByEmail :one
SELECT * FROM "user"
WHERE email = $1;

-- name: GetUserBYId :one
SELECT * FROM "user"
WHERE id = $1;

