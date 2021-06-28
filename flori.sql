CREATE DATABASE db_test ENCODING 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

CREATE USER 'elena' WITH ENCRYPTED PASSWORD 'elena';
GRANT ALL PRIVILEGES ON DATABASE db_test TO elena
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO elena;

CREATE TYPE categorie_flori AS ENUM('buchet_mare','buchet_mic','aranjament','cadou_complet','cosulet','normal');
CREATE TYPE categorie_scop AS ENUM('cadou_normal','aranjament_eveniment','cutie_flori');

CREATE TABLE IF NOT EXISTS flori (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   nr_flori INT NOT NULL CHECK (nr_flori>0),   
   tip_produs categorie_scop DEFAULT 'cadou_normal',
   culoare VARCHAR(50) NOT NULL ,
   categorie categorie_flori DEFAULT 'normal',
   componente VARCHAR [],
   curier BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);
INSERT into public.flori (nume,descriere,nr_flori,pret,tip_produs, culoare, categorie, componente, curier, imagine) VALUES 
('Buchet mic trandafiri', 'Buchet superb de trandafiri',5, 40, 'cadou_normal', 'rosu', 'buchet_mic', '{"trandafiri","feriga","fire uscate","ambalaj"}', True , 'trandafiri-rosu-mic.jpg'),
('Buchet mic trandafiri', 'Buchet superb de trandafiri',5, 40, 'cadou_normal', 'alb', 'buchet_mic', '{"trandafiri","feriga","fire uscate","ambalaj"}', True , 'trandafiri-rosu-mare.jpg'),
('Buchet mic trandafiri', 'Buchet superb de trandafiri',5, 40, 'cadou_normal', 'roz', 'buchet_mic', '{"trandafiri","feriga","fire uscate","ambalaj"}', True , 'trandafiri-roz-mic.jpg'),
('Buchet mare trandafiri', 'Buchet superb de trandafiri',15, 100, 'cadou_normal', 'rosu', 'buchet_mare', '{"trandafiri","feriga","fire uscate","ambalaj","panglica"}', True , 'trandafiri-roz-mare.jpg'),
('Buchet mare trandafiri', 'Buchet superb de trandafiri',7, 60, 'cadou_normal', 'alb', 'buchet_mare', '{"trandafiri","feriga","fire uscate","ambalaj","panglica"}', True , 'trandafiri-alb-mic.jpg'),
('Buchet mare trandafiri', 'Buchet superb de trandafiri',15, 100, 'cadou_normal', 'alb', 'buchet_mare', '{"trandafiri","feriga","fire uscate","ambalaj","panglica"}', True , 'trandafiri-alb-mare.jpg'),
('Buchet mixt', 'Buchet superb dintr-un mix de flori',17, 120, 'cadou_normal', 'multicolor', 'buchet_mare' ,'{"orhidee","crini","trandafiri","fire uscate","ambalaj","panglica"}', True , 'multicolor.jpg'),
('Cos mare flori', 'Cos superb cu flori',35, 110, 'cadou_normal', 'alb', 'cosulet', '{"trandafiri","feriga","fire uscate","ambalaj","panglica"}', True , 'cos-mare.jpg'),
('Cos mic flori', 'Cos superb cu flori',25, 70, 'cutie_flori', 'multicolor', 'cosulet' ,'{"trandafiri","garoafe","fire uscate","orhidee","crini"}', True , 'cos-mic.jpg'),
('Aranjament mic nunta', 'Aranjament masa pentru nunta',31, 70, 'aranjament_eveniment', 'alb', 'aranjament', '{"trandafiri","garoafe","fire uscate","orhidee","crini"}', True , 'aranjament-nunta-mic.jpg'),
('Aranjament mare nunta', 'Aranjament masa pentru nunta',41, 100, 'aranjament_eveniment', 'alb', 'aranjament' ,'{"trandafiri","garoafe","fire uscate","orhidee","crini"}', True , 'aranjament-nunta-mare.jpg'),
('Aranjament mic eveniment', 'Aranjament pentru evenimente',27, 60, 'aranjament_eveniment', 'multicolor', 'aranjament' ,'{"trandafiri","gerbera","fire uscate","orhidee","crini"}', True , 'aranjament-eveniment-mic.jpg'),
('Aranjament mare eveniment', 'Aranjament pentru evenimente',31, 90, 'aranjament_eveniment', 'multicolor', 'aranjament', '{"trandafiri","garoafe","fire uscate","orhidee","crini"}', True , 'aranjament-eveniment-mare.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',7, 100, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet trandafiri","ursulet de plus"}', True , 'cadou1.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',15, 150, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet trandafiri","ursulet de plus"}', True , 'cadou2.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',7, 110, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet trandafiri","ursulet de plus","ciocolata"}', True , 'cadou3.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',15, 160, 'cadou_normal', 'multicolor', 'cadou_complet', '{"buchet trandafiri","ursulet de plus","ciocolata"}', True , 'cadou4.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',7, 70, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet trandafiri","bomboane de ciocolata"}', True , 'cadou5.jpg'),
('Cadou', 'Cadou complet pentru evenimente speciale',15, 100, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet trandafiri","bomboane de ciocolata"}', True , 'cadou6.jpg'),
('MEGA-Cadou', 'Cadou mega-complet pentru evenimente speciale',31, 300, 'cadou_normal', 'multicolor', 'cadou_complet' ,'{"buchet mare trandafiri","ursulet mare de plus","mega cutie de ciocolata"}', True , 'mega-cadou.jpg');

