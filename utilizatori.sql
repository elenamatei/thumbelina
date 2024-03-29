CREATE TYPE roluri AS ENUM('admin', 'comun');


CREATE TABLE IF NOT EXISTS utilizatori (
   id serial PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   nume VARCHAR(100) NOT NULL,
   prenume VARCHAR(100) NOT NULL,
   parola VARCHAR(100) NOT NULL,
   rol roluri NOT NULL DEFAULT 'comun',
   email VARCHAR(100) NOT NULL,
   culoare_chat VARCHAR(50) NOT NULL,
   data_inregistrare TIMESTAMP DEFAULT current_timestamp
   imagine_profil VARCHAR(300),
   telefon VARCHAR(50) NOT NULL

);

CREATE TABLE IF NOT EXISTS accesari (
   id serial PRIMARY KEY,
   ip VARCHAR(100) NOT NULL,
   user_id INT NULL REFERENCES utilizatori(id),
   pagina VARCHAR(100) NOT NULL,
   data_accesare TIMESTAMP DEFAULT current_timestamp
);