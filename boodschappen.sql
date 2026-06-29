-- Mama's boodschappenlijst toevoegen aan de bestaande lijst.
-- Plak dit in de Supabase SQL editor en klik Run.
-- (Upload eerst de nieuwe app.js, want die bevat de categorie "Eten & boodschappen".)

-- 1) Bestaande items die mama ook had: locatie op Beveren zetten (geen dubbels maken).
update public.items set loc = 'Beveren'
where list = 'inpak' and lower(name) in (
  'koffie','thee','afwasborstel','afwasmiddel','handzeep','keukenrol',
  'keukenhanddoeken','kurkentrekker','zakdoeken','zilverpapier','vuilniszakken',
  'lucifers','snijplank & mes','gezelschapspelletjes','verlengkabel / stekkerdoos',
  'gourmet (stel + pannetjes)'
);

-- Toiletpapier zette mama bij Zweden -> kopen in Zweden.
update public.items set source = 'kopen', loc = ''
where list = 'inpak' and lower(name) = 'toiletpapier';

-- 2) Nieuwe items toevoegen.
insert into public.items (list, name, category, loc, source, qty, done, position) values
-- Beveren, meenemen (huishouden/keuken)
('inpak','Servetten','Huisje & keuken','Beveren','meenemen',1,false,1001),
('inpak','Plastic zakjes (1L)','Huisje & keuken','Beveren','meenemen',1,false,1002),
('inpak','Wondersponsje','Huisje & keuken','Beveren','meenemen',1,false,1003),
('inpak','Vershoudfolie','Huisje & keuken','Beveren','meenemen',1,false,1004),
('inpak','Boodschappentassen','Huisje & keuken','Beveren','meenemen',1,false,1005),
('inpak','Fleecedekentjes','Huisje & keuken','Beveren','meenemen',1,false,1006),
('inpak','Handdoeken (handen wassen)','Huisje & keuken','Beveren','meenemen',1,false,1007),
('inpak','Koffiepot','Huisje & keuken','Beveren','meenemen',1,false,1008),
('inpak','Plakband','Huisje & keuken','Beveren','meenemen',1,false,1009),
('inpak','Theepot','Huisje & keuken','Beveren','meenemen',1,false,1010),
('inpak','Vaatwastabletten','Huisje & keuken','Beveren','meenemen',1,false,1011),
('inpak','Vliegenmepper (2)','Huisje & keuken','Beveren','meenemen',1,false,1012),
-- Beveren, meenemen (eten)
('inpak','Olie','Eten & boodschappen','Beveren','meenemen',1,false,1013),
('inpak','Wijn (wit 2x, rood)','Eten & boodschappen','Beveren','meenemen',1,false,1014),
('inpak','Kruiden','Eten & boodschappen','Beveren','meenemen',1,false,1015),
('inpak','Peper','Eten & boodschappen','Beveren','meenemen',1,false,1016),
('inpak','Zout','Eten & boodschappen','Beveren','meenemen',1,false,1017),
-- Beveren, meenemen (gezondheid)
('inpak','Medicatie','Gezondheid & verzorging','Beveren','meenemen',1,false,1018),
-- Kopen in Zweden (eten)
('inpak','Appelsiensap','Eten & boodschappen','','kopen',1,false,1019),
('inpak','Chips','Eten & boodschappen','','kopen',1,false,1020),
('inpak','Ketchup','Eten & boodschappen','','kopen',1,false,1021),
('inpak','Granola','Eten & boodschappen','','kopen',1,false,1022),
('inpak','Kruidenboter','Eten & boodschappen','','kopen',1,false,1023),
('inpak','Lunchworst','Eten & boodschappen','','kopen',1,false,1024),
('inpak','Mayonaise','Eten & boodschappen','','kopen',1,false,1025),
('inpak','Mosterd','Eten & boodschappen','','kopen',1,false,1026),
('inpak','Salami','Eten & boodschappen','','kopen',1,false,1027),
('inpak','Smeerboter','Eten & boodschappen','','kopen',1,false,1028),
('inpak','Water','Eten & boodschappen','','kopen',1,false,1029),
('inpak','Yoghurt','Eten & boodschappen','','kopen',1,false,1030),
('inpak','Confituur','Eten & boodschappen','','kopen',1,false,1031),
('inpak','Choco','Eten & boodschappen','','kopen',1,false,1032);
