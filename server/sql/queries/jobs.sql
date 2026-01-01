-- name: CreateJob :one
INSERT INTO jobs(
job_type,
description,
job_date,
field_id,
created_at,
updated_at
)
VALUES(
  $1,
  $2,
  $3,
  $4,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
  ) returning *;

-- name: CreateJobSupplies :one
INSERT INTO jobs_supplies (
quantity,
job_id,
supply_id,
created_at,
updated_at
)
VALUES(
  $1,
  $2,
  $3,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
  ) RETURNING *;


-- name: GetAllJobs :many

select j.id,j.job_type,j.description,j.job_date,
j.field_id,j.created_at,j.updated_at, 
COUNT(j) AS total_supplies
FROM jobs AS j
LEFT JOIN jobs_supplies AS js
ON j.id = js.job_id
WHERE j.deleted_at IS NULL AND js.deleted_at IS NULL  AND  j.field_id=$1

GROUP BY j.id;

-- name: GetJobDetails :one
select j.id,j.job_type,j.description,j.job_date,j.field_id,j.created_at,j.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id',js.id,
        'quantity',js.quantity,
        'jobId',js.job_id,
        'createdAt',js.created_at,
        'updatedAt',js.updated_at,
        'supplyName',s.name,
        'supplyAlias',s.nickname,
        'supplyId',js.supply_id,
        'supplyMeasurementUnit',s.measurement_unit
       )
  ) FILTER (WHERE js.id IS NOT NULL),
    '[]'::json
  ) AS jobs_supplies
FROM jobs AS j
LEFT JOIN jobs_supplies AS js
ON j.id = js.job_id
JOIN supplies AS s
ON js.supply_id = s.id
WHERE j.deleted_at IS NULL AND js.deleted_at IS NULL AND job_id=$1 AND  j.field_id=$2
GROUP BY j.id;


