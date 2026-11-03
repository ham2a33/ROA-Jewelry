\getenv app_user APP_DB_USER
\getenv app_password APP_DB_PASSWORD
\getenv app_database POSTGRES_DB

SELECT format(
  'CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD %L',
  :'app_user',
  :'app_password'
)\gexec

GRANT CONNECT, CREATE, TEMPORARY ON DATABASE :"app_database" TO :"app_user";
ALTER SCHEMA public OWNER TO :"app_user";
GRANT ALL PRIVILEGES ON SCHEMA public TO :"app_user";
