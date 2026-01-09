-- +goose up

INSERT INTO farms (
 name,created_at,updated_at 
) VALUES ( 
'Δροσος Χωραφια',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
  );


WITH new_user AS (
INSERT INTO users (
created_at,
updated_at,
email,
password,
farm_id
)values(
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP,
'xaos@xaos.com',
 '$argon2id$v=19$m=65536,t=1,p=8$6hu5WXopdNfDoXsURWtaCA$0cdNGayvCSGyX8mf1Nl4g4naC5LRaZlM5ZjrmZbn+jk',
  (select id FROM farms WHERE name = 'Δροσος Χωραφια' LIMIT  1)
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
('γουρουνια',35000,'γουρουνια',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('στραπατσαλου',42000,'στραπατσαλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('τεσαροματη',17000,'τεσαροματη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('σταυριδη',45000 ,'σταυριδη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('φραγκακη',37000 ,'φραγκακη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('βερεμη',21000 ,'βερεμη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ανδρεου',24000 ,'ανδρεου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('παπια',20000 ,'παπια',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ευστρατιου',14000,'ευστρατιου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('βιβης',23000,'βιβης',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('κεραμιτσογλου',33000,'κεραμιτσογλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('αλεκας',16000,'αλεκας',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('παπαζογλου',31000,'παπαζογλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('φοκλαντ',60000,'φοκλαντ',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('κουρουπη',14000 ,'κουρουπη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ζηγκα',18000 ,'ζηγκα',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('γκιντακι',14000 ,'γκιντακι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('νησι',16000     ,'νησι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('μανου',31000,'μανου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ευστρατιου33',33000 ,'ευστρατιου33',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('τζημα',14000 ,'τζημα',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('παρθενιο',7000 ,'παρθενιο',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('νοτη',18000 ,'νοτη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('πλατανος',83000 ,'πλατανος',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('κλειδι',130000  ,'κλειδι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO supplies(
name,
supply_type,
measurement_unit,
farm_id
)
 VALUES
('Akito','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('Ortiva','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('Tonik','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('Focus','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('Permit','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('Dash','chemicals','L',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('GLORIA','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('PVL','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com')),
('DIVA','seeds','KG',(SELECT farm_id from users  WHERE deleted_at IS NULL AND users.email = 'xaos@xaos.com'));

-- +goose down
DELETE FROM supplies
WHERE farm_id = (select id FROM farms WHERE name = 'Δροσος Χωραφια');

DELETE FROM fields
WHERE farm_id = (select id FROM farms WHERE name = 'Δροσος Χωραφια');

DELETE FROM users
WHERE users.email = 'xaos@xaos.com';

DELETE FROM farms
WHERE name = 'Δροσος Χωραφια';

