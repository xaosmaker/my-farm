-- name: GetSeasonStatistics :many
SELECT SUM(js.quantity) as total_quantity,SUM(
  CASE
    WHEN j.job_type = 'harvesting' THEN js.quantity
    ELSE 0
  END
  ) as harvest_quantity,js.supply_id as supply_id, s.name as supply_name, s.measurement_unit
FROM jobs_supplies js
LEFT JOIN supplies s
ON s.id = js.supply_id
LEFT JOIN jobs j
ON j.id = js.job_id
LEFT JOIN seasons 
ON j.season_id = seasons.id
WHERE seasons.id = $1
GROUP BY js.supply_id,s.name,s.measurement_unit;


