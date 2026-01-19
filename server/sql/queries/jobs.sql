-- name: DeleteJob :exec
DELETE FROM jobs
WHERE id = $1;
-- name: JobExists :one
SELECT farms.id FROM jobs
JOIN seasons
ON season_id = seasons.id
AND jobs.id = sqlc.arg('job_id')
JOIN fields
ON fields.id = seasons.field_id
JOIN farms
ON farms.id = sqlc.arg('farm_id');

-- name: CreateJob :one
INSERT INTO jobs(
job_type,
description,
job_date,
season_id,
area_in_meters,
created_at,
updated_at
)
VALUES(
  $1,
  $2,
  $3,
  $4,
  $5,
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

select j.id,j.job_type,j.description,j.job_date,j.season_id,j.area_in_meters,j.boundary,j.created_at,j.updated_at,
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
LEFT JOIN supplies AS s
ON js.supply_id = s.id
WHERE j.deleted_at IS NULL AND js.deleted_at IS NULL AND s.deleted_at IS NULL AND  j.season_id=$1
GROUP BY j.id
ORDER BY job_date DESC;



-- name: GetJobDetails :one
select j.id,j.job_type,j.description,j.job_date,j.season_id,j.area_in_meters,j.boundary,j.created_at,j.updated_at,
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
LEFT JOIN supplies AS s
ON js.supply_id = s.id
WHERE j.deleted_at IS NULL AND js.deleted_at IS NULL AND s.deleted_at IS NULL AND job_id=$1 AND  j.season_id=$2
GROUP BY j.id;

-- name: GetLastJobBySeasonId :one
select *
FROM jobs j 
WHERE j.deleted_at IS NULL  AND j.season_id=$1
ORDER BY job_date DESC
LIMIT 1;

-- name: GetFirstJobBySeasonId :one
select *
FROM jobs j 
WHERE j.deleted_at IS NULL  AND j.season_id=$1
ORDER BY job_date ASC
LIMIT 1;
