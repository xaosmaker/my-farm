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
('στραπατσαλου',91000,'στραπατσαλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('τεσαροματη',17000,'τεσαροματη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('σταυριδη',41000 ,'σταυριδη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('φραγκακη',17000 ,'φραγκακη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('αλεκος',16000   ,'αλεκος',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('παπαζογλου',31000,'παπαζογλου',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('κουρουπη',13000 ,'κουρουπη',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('νησι',18000     ,'νησι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('πλατανος',83000 ,'πλατανος',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('κλειδι',130000  ,'κλειδι',false,(select id FROM farms WHERE name = 'Δροσος Χωραφια'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- +goose down
DELETE FROM fields
WHERE farm_id = (select id FROM farms WHERE name = 'Δροσος Χωραφια');

DELETE FROM users
WHERE users.email = 'xaos@xaos.com';

DELETE FROM farms
WHERE name = 'Δροσος Χωραφια';

