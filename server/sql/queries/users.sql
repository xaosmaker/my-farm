-- name: GetAllUsers :many
select * from "user";


-- name: GetUserByEmail :one
SELECT * FROM "user"
WHERE email = $1;



