#!/bin/sh
pg_dump $DB_URL_LOCAL --schema-only > sql/schema.sql 
sed -i '/restrict/ s/^/--/' sql/schema.sql
