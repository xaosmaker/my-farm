-- +goose up

INSERT INTO farms (
 name,created_at,updated_at 
) VALUES ( 
'Δροσος Χωραφια',
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z'
  );


INSERT INTO farms (
 name,created_at,updated_at 
) VALUES ( 
'nofields',
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z'
  );




WITH new_user AS (
INSERT INTO users (
created_at,
updated_at,
email,
password,
farm_id
)values(
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z',
'test@test.com',
'$argon2id$v=19$m=65536,t=1,p=12$/Z96OO2/okqF5KHP/XjbdQ$CFppbcEbwqP1kIxGHDvK8jA+qaH6W9RD/KpfdgwOdIo', -- pass:test
  (select id FROM farms WHERE name = 'Δροσος Χωραφια' LIMIT  1)
)RETURNING *
)
INSERT INTO settings(
user_id
)
select id from new_user;


INSERT INTO users (
created_at,
updated_at,
email,
password,
farm_id
)values(
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z',
'nosettingsuser@test.com',
'$argon2id$v=19$m=65536,t=1,p=12$/Z96OO2/okqF5KHP/XjbdQ$CFppbcEbwqP1kIxGHDvK8jA+qaH6W9RD/KpfdgwOdIo', -- pass:test
  (select id FROM farms WHERE name = 'nofields' LIMIT  1)
)RETURNING *;

WITH new_user AS (
INSERT INTO users (
created_at,
updated_at,
email,
password
)values(
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z',
'nofarmuser@test.com',
'$argon2id$v=19$m=65536,t=1,p=12$/Z96OO2/okqF5KHP/XjbdQ$CFppbcEbwqP1kIxGHDvK8jA+qaH6W9RD/KpfdgwOdIo' -- pass:test
)RETURNING *
)
INSERT INTO settings(
user_id
)
select id from new_user;

WITH new_user AS (
INSERT INTO users (
created_at,
updated_at,
email,
password,
farm_id
)values(
'2025-09-11T10:00:00Z',
'2025-09-11T10:00:00Z',
'nofieldsuser@test.com',
'$argon2id$v=19$m=65536,t=1,p=12$/Z96OO2/okqF5KHP/XjbdQ$CFppbcEbwqP1kIxGHDvK8jA+qaH6W9RD/KpfdgwOdIo', -- pass:test
  (select id FROM farms WHERE name = 'nofields' LIMIT  1)
)RETURNING *
)
INSERT INTO settings(
user_id
)
select id from new_user;

INSERT INTO fields
(
name,
area_in_meters,
field_location,
is_owned,
farm_id,
created_at,
updated_at
)
VALUES
('γουρουνια',35000,'γουρουνια',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('στραπατσαλου',42000,'στραπατσαλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('τεσαροματη',17000,'τεσαροματη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('σταυριδη',45000 ,'σταυριδη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('φραγκακη',37000 ,'φραγκακη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('βερεμη',21000 ,'βερεμη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('ανδρεου',24000 ,'ανδρεου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('παπια',20000 ,'παπια',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('ευστρατιου',14000,'ευστρατιου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('βιβης',23000,'βιβης',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('κεραμιτσογλου',33000,'κεραμιτσογλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('αλεκας',16000,'αλεκας',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('παπαζογλου',31000,'παπαζογλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('φοκλαντ',60000,'φοκλαντ',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('κουρουπη',14000 ,'κουρουπη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('ζηγκα',18000 ,'ζηγκα',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('γκιντακι',14000 ,'γκιντακι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('νησι',16000     ,'νησι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('μανου',31000,'μανου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('ευστρατιου33',33000 ,'ευστρατιου33',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('τζημα',14000 ,'τζημα',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('παρθενιο',7000 ,'παρθενιο',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('νοτη',18000 ,'νοτη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('πλατανος',83000 ,'πλατανος',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z'),
('κλειδι',130000  ,'κλειδι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),'2026-10-11T00:00:00Z','2026-10-11T00:00:00Z');

INSERT INTO supplies(
name,
supply_type,
measurement_unit,
farm_id
)
 VALUES
('Akito','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('Ortiva','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('Tonik','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('Focus','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('Permit','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('Dash','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('GLORIA','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('26-0-0','fertilizers','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('PVL','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com')),
('DIVA','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'test@test.com'));

INSERT INTO seasons (
crop,
name,
field_id,
area_in_meters,
updated_at,
created_at,
start_season
)
VALUES(
  (select id FROM supplies WHERE supplies.name = 'DIVA'),
  'season 2025',
  (select id FROM fields WHERE name = 'γουρουνια'),
  (select area_in_meters FROM fields WHERE name = 'γουρουνια'),
  '2026-10-11T00:00:00Z',
  '2026-10-11T00:00:00Z',
  '2025-05-11T22:00:00Z'
  );

WITH new_job AS (
    INSERT INTO jobs (
        job_type,
        description,
        job_date,
        area_in_meters,
        season_id
    )
    VALUES (
        'sowing',
        'spora',
        '2025-05-10T22:00:00Z',
  (SELECT area_in_meters FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια')),
  (SELECT id FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια'))
    )
    RETURNING id
)
INSERT INTO jobs_supplies (
    quantity,
    job_id,
    supply_id
)
VALUES
  (560,(SELECT id FROM new_job),
    (SELECT id FROM supplies WHERE name = 'DIVA')
);

WITH new_job AS (
    INSERT INTO jobs (
        job_type,
        description,
        job_date,
        area_in_meters,
        season_id
    )
    VALUES (
        'spraying',
        'sprayin mix multiple chemicals',
        '2025-05-30T22:00:00Z',
  (SELECT area_in_meters FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια')),
  (SELECT id FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια'))
    )
    RETURNING id
)
INSERT INTO jobs_supplies (
    quantity,
    job_id,
    supply_id
)
VALUES
  (7,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Dash')
),
  (7,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Focus')
),
  (7,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Permit')
);

WITH new_job AS (
    INSERT INTO jobs (
        job_type,
        description,
        job_date,
        area_in_meters,
        season_id
    )
    VALUES (
        'spraying',
        'sprayin mix multiple chemicals',
        '2025-06-11T22:00:00Z',
  (SELECT area_in_meters FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια')),
  (SELECT id FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια'))
    )
    RETURNING id
)
INSERT INTO jobs_supplies (
    quantity,
    job_id,
    supply_id
)
VALUES
  (7,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Dash')
),
  (17.5,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Focus')
),
  (7,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'Permit')
);

WITH new_job AS (
    INSERT INTO jobs (
        job_type,
        description,
        job_date,
        area_in_meters,
        season_id
    )
    VALUES (
        'fertilizing',
        'fertilizing one or many doent mater',
        '2025-07-11T22:00:00Z',
  (SELECT area_in_meters FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια')),
  (SELECT id FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια'))
    )
    RETURNING id
)
INSERT INTO jobs_supplies (
    quantity,
    job_id,
    supply_id
)
VALUES
  (577.5,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = '26-0-0')
);

WITH new_job AS (
    INSERT INTO jobs (
        job_type,
        description,
        job_date,
        area_in_meters,
        season_id
    )
    VALUES (
        'harvesting',
        'fertilizing one or many doent mater',
        '2025-09-11T22:00:00Z',
  (SELECT area_in_meters FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια')),
  (SELECT id FROM seasons WHERE seasons.name ='season 2025' AND seasons.field_id =
  (select id FROM fields WHERE name = 'γουρουνια'))
    )
    RETURNING id
)
INSERT INTO jobs_supplies (
    quantity,
    job_id,
    supply_id
)
VALUES
  (35040,(SELECT id FROM new_job),
(SELECT id FROM supplies WHERE name = 'DIVA')
);

-- +goose down
DELETE FROM seasons;

DELETE FROM supplies;

DELETE FROM fields;

DELETE FROM users;

DELETE FROM farms;

