-- ========================================
-- SCRIPT DE POPULATION - BASE DE DONNÉES
-- Données sur 2 dernières années (2024-2026)
-- ========================================








-- 4. INSÉRER LES FORMATEURS
INSERT INTO formateur (nom, prenom, email, tel, type, date_embauche) VALUES
('Dupont', 'Jean', 'jean.dupont@formation.com', '0123456789', 'Interne', '2023-01-15'),
('Martin', 'Marie', 'marie.martin@formation.com', '0123456790', 'Externe', '2023-02-20'),
('Bernard', 'Pierre', 'pierre.bernard@formation.com', '0123456791', 'Interne', '2023-03-10'),
('Dubois', 'Sophie', 'sophie.dubois@formation.com', '0123456792', 'Externe', '2023-04-05'),
('Laurent', 'Thomas', 'thomas.laurent@formation.com', '0123456793', 'Interne', '2023-05-12'),
('Moreau', 'Claire', 'claire.moreau@formation.com', '0123456794', 'Externe', '2023-06-18'),
('Petit', 'Marc', 'marc.petit@formation.com', '0123456795', 'Interne', '2023-07-22'),
('Garcia', 'Anne', 'anne.garcia@formation.com', '0123456796', 'Externe', '2023-08-30'),
('Rodriguez', 'Michel', 'michel.rodriguez@formation.com', '0123456797', 'Interne', '2023-09-14'),
('Lefevre', 'Isabelle', 'isabelle.lefevre@formation.com', '0123456798', 'Externe', '2023-10-25'),
('Leclerc', 'François', 'francois.leclerc@formation.com', '0123456799', 'Interne', '2023-11-08'),
('David', 'Nathalie', 'nathalie.david@formation.com', '0123456800', 'Externe', '2024-01-10'),
('Durand', 'Laurent', 'laurent.durand@formation.com', '0123456801', 'Interne', '2024-02-15'),
('Leroy', 'Valérie', 'valerie.leroy@formation.com', '0123456802', 'Externe', '2024-03-20'),
('Mercier', 'Olivier', 'olivier.mercier@formation.com', '0123456803', 'Interne', '2024-04-25');

-- 5. INSÉRER LES FORMATIONS (2024-2026)
INSERT INTO formation (titre, description, date_debut, date_fin, domaine_id, formateur_id, budget, capacite, lieu) VALUES
-- Janvier 2024
('Développement Web React', 'Formation approfondie React', '2024-01-08', '2024-01-12', 1, 1, 15000, 20, 'Salle A1'),
('Leadership Stratégique', 'Développer ses compétences managériales', '2024-01-15', '2024-01-17', 2, 2, 12000, 25, 'Salle B2'),

-- Février 2024
('Excel Avancé', 'Maîtriser les fonctionnalités avancées', '2024-02-05', '2024-02-06', 4, 3, 8000, 30, 'Salle C1'),
('Communication Professionnelle', 'Améliorer sa communication', '2024-02-19', '2024-02-21', 3, 4, 9000, 28, 'Salle A2'),

-- Mars 2024
('Cybersécurité Fondamentale', 'Notions de base en sécurité', '2024-03-04', '2024-03-06', 5, 5, 18000, 22, 'Salle D1'),
('Gestion de Projet Agile', 'Méthodologies Agile/Scrum', '2024-03-18', '2024-03-22', 2, 6, 16000, 24, 'Salle B1'),

-- Avril 2024
('Python pour Data Science', 'Introduction à Python', '2024-04-08', '2024-04-12', 1, 7, 17000, 20, 'Salle E1'),
('Anglais Professionnel', 'Améliorer l''anglais des affaires', '2024-04-22', '2024-04-26', 6, 8, 10000, 25, 'Salle F1'),

-- Mai 2024
('Power BI Essentials', 'Créer des dashboards', '2024-05-06', '2024-05-08', 4, 9, 13000, 20, 'Salle C2'),
('Gestion des Ressources Humaines', 'Fondamentaux RH', '2024-05-20', '2024-05-24', 3, 10, 14000, 30, 'Salle A3'),

-- Juin 2024
('DevOps et CI/CD', 'Intégration continue', '2024-06-03', '2024-06-07', 1, 1, 19000, 18, 'Salle D2'),
('Finance pour Non-financiers', 'Lire un bilan', '2024-06-17', '2024-06-19', 4, 3, 11000, 28, 'Salle C3'),

-- Juillet 2024
('Android Development', 'Créer des applications mobiles', '2024-07-08', '2024-07-12', 1, 2, 16000, 20, 'Salle E2'),
('Négociation Commerciale', 'Techniques de négociation', '2024-07-22', '2024-07-26', 2, 4, 12000, 25, 'Salle B3'),

-- Août 2024
('Machine Learning Basics', 'Introduction au ML', '2024-08-05', '2024-08-09', 1, 5, 20000, 22, 'Salle F2'),
('Conformité RGPD', 'Mise en conformité RGPD', '2024-08-19', '2024-08-21', 5, 7, 9000, 30, 'Salle A4'),

-- Septembre 2024
('SQL Avancé', 'Optimiser les requêtes', '2024-09-09', '2024-09-13', 1, 6, 14000, 20, 'Salle D3'),
('Prise de Parole en Public', 'Vaincre le stress', '2024-09-23', '2024-09-25', 3, 8, 8000, 25, 'Salle B4'),

-- Octobre 2024
('AWS Certified', 'Services cloud AWS', '2024-10-07', '2024-10-11', 1, 9, 21000, 18, 'Salle E3'),
('Stratégie Digitale', 'Transformation digitale', '2024-10-21', '2024-10-25', 2, 10, 15000, 24, 'Salle C4'),

-- Novembre 2024
('Docker & Kubernetes', 'Conteneurisation', '2024-11-04', '2024-11-08', 1, 1, 18000, 20, 'Salle F3'),
('Allemand Professionnel', 'Allemand des affaires', '2024-11-18', '2024-11-22', 6, 2, 11000, 22, 'Salle A5'),

-- Décembre 2024
('TypeScript Avancé', 'Typage fort en JavaScript', '2024-12-02', '2024-12-06', 1, 3, 13000, 20, 'Salle D4'),
('Innovation Managériale', 'Manager l''innovation', '2024-12-16', '2024-12-18', 2, 4, 12000, 25, 'Salle B5'),

-- Janvier 2025
('Vue.js Framework', 'Framework Vue.js', '2025-01-13', '2025-01-17', 1, 5, 15000, 20, 'Salle E4'),
('Tableaux de Bord Financiers', 'Financial planning', '2025-01-27', '2025-01-29', 4, 6, 10000, 28, 'Salle C5'),

-- Février 2025
('Angular Complet', 'Framework Angular', '2025-02-03', '2025-02-07', 1, 7, 16000, 20, 'Salle F4'),
('Gestion du Changement', 'Change management', '2025-02-17', '2025-02-19', 3, 8, 11000, 30, 'Salle A6'),

-- Mars 2025
('Spring Boot Microservices', 'Architecture microservices', '2025-03-03', '2025-03-07', 1, 9, 18000, 20, 'Salle D5'),
('Leadership Féminin', 'Leadership au féminin', '2025-03-17', '2025-03-21', 2, 10, 13000, 24, 'Salle B6'),

-- Avril 2025
('GraphQL API Design', 'Concevoir avec GraphQL', '2025-04-07', '2025-04-11', 1, 1, 14000, 20, 'Salle E5'),
('Intelligence Émotionnelle', 'Développer l''IE', '2025-04-21', '2025-04-23', 3, 2, 9000, 28, 'Salle C6'),

-- Mai 2025
('Firebase & Realtime DB', 'Backend avec Firebase', '2025-05-05', '2025-05-09', 1, 3, 12000, 20, 'Salle F5'),
('Contrôle de Gestion', 'Contrôle de gestion', '2025-05-19', '2025-05-23', 4, 4, 15000, 25, 'Salle A7'),

-- Juin 2025
('Electron Desktop Apps', 'Créer des apps desktop', '2025-06-02', '2025-06-06', 1, 5, 13000, 18, 'Salle D6'),
('Économie Verte', 'Transition écologique', '2025-06-16', '2025-06-18', 3, 6, 10000, 30, 'Salle B7'),

-- Juillet 2025
('WebAssembly & WASM', 'Performance avec WASM', '2025-07-07', '2025-07-11', 1, 7, 15000, 20, 'Salle E6'),
('Espagnol Commercial', 'Espagnol des affaires', '2025-07-21', '2025-07-25', 6, 8, 11000, 24, 'Salle C7'),

-- Août 2025
('Blockchain Développeur', 'Blockchain development', '2025-08-04', '2025-08-08', 1, 9, 22000, 18, 'Salle F6'),
('Qualité et ISO', 'Systèmes qualité', '2025-08-18', '2025-08-20', 5, 10, 8000, 28, 'Salle A8'),

-- Septembre 2025
('API REST & Node.js', 'Créer des APIs', '2025-09-08', '2025-09-12', 1, 1, 14000, 20, 'Salle D7'),
('Optimisation Fiscale', 'Stratégies fiscales', '2025-09-22', '2025-09-26', 4, 2, 16000, 24, 'Salle B8'),

-- Octobre 2025
('Testing et QA', 'Automatiser les tests', '2025-10-06', '2025-10-10', 1, 3, 13000, 20, 'Salle E7'),
('Médiation Professionnelle', 'Résoudre les conflits', '2025-10-20', '2025-10-24', 3, 4, 10000, 25, 'Salle C8'),

-- Novembre 2025
('Performance Web', 'Optimisation performance', '2025-11-03', '2025-11-07', 1, 5, 12000, 20, 'Salle F7'),
('Logistique Moderne', 'Gestion logistique', '2025-11-17', '2025-11-21', 2, 6, 14000, 28, 'Salle A9'),

-- Décembre 2025
('AI & ChatGPT', 'IA générative', '2025-12-01', '2025-12-05', 1, 7, 17000, 20, 'Salle D8'),
('Droit du Travail', 'Fondamentaux du droit', '2025-12-15', '2025-12-17', 3, 8, 9000, 30, 'Salle B9'),

-- Janvier 2026
('Quantum Computing Intro', 'Introduction quantique', '2026-01-12', '2026-01-16', 1, 9, 19000, 18, 'Salle E8'),
('Bilan Social Entreprise', 'Reporting social', '2026-01-26', '2026-01-28', 3, 10, 11000, 26, 'Salle C9'),

-- Février 2026
('Edge Computing', 'Computing en edge', '2026-02-02', '2026-02-06', 1, 1, 16000, 20, 'Salle F8'),
('Audit Interne', 'Audit et conformité', '2026-02-16', '2026-02-20', 5, 2, 13000, 24, 'Salle A10'),

-- Mars 2026
('Web 3.0 & Metaverse', 'Web 3 et métavers', '2026-03-02', '2026-03-06', 1, 3, 18000, 20, 'Salle D9'),
('Bilan Carbone', 'Calcul empreinte carbone', '2026-03-16', '2026-03-20', 5, 4, 10000, 28, 'Salle B10');

-- 6. INSÉRER LES PARTICIPANTS (200+ participants)
INSERT INTO participant (nom, prenom, email, structure_id, profil_id, date_inscription) VALUES
('Lemoine', 'Julien', 'julien.lemoine@company.com', 1, 2, '2024-01-05'),
('Arnaud', 'Christophe', 'christophe.arnaud@company.com', 2, 1, '2024-01-06'),
('Blanchard', 'Stéphane', 'stephane.blanchard@company.com', 3, 3, '2024-01-07'),
('Chauvel', 'Frédéric', 'frederic.chauvel@company.com', 1, 2, '2024-01-08'),
('Deschamps', 'Virginie', 'virginie.deschamps@company.com', 4, 4, '2024-01-09'),
('Emery', 'Sandrine', 'sandrine.emery@company.com', 5, 1, '2024-01-10'),
('Fontaine', 'Hervé', 'herve.fontaine@company.com', 6, 5, '2024-01-11'),
('Germain', 'Nadia', 'nadia.germain@company.com', 7, 3, '2024-01-12'),
('Hubert', 'Didier', 'didier.hubert@company.com', 1, 2, '2024-02-01'),
('Jouve', 'Mireille', 'mireille.jouve@company.com', 2, 1, '2024-02-02'),
('Keller', 'Gérald', 'gerald.keller@company.com', 3, 3, '2024-02-03'),
('Laurent', 'Sylvie', 'sylvie.laurent@company.com', 1, 2, '2024-02-04'),
('Marechal', 'Yannick', 'yannick.marechal@company.com', 4, 4, '2024-02-05'),
('Normand', 'Patricia', 'patricia.normand@company.com', 5, 1, '2024-02-06'),
('Olier', 'Benjamin', 'benjamin.olier@company.com', 6, 5, '2024-02-07'),
('Papineau', 'Corinne', 'corinne.papineau@company.com', 7, 3, '2024-02-08'),
('Quelet', 'Jérôme', 'jerome.quelet@company.com', 1, 2, '2024-03-01'),
('Roussel', 'Valérie', 'valerie.roussel@company.com', 2, 1, '2024-03-02'),
('Schneider', 'Cécile', 'cecile.schneider@company.com', 3, 3, '2024-03-03'),
('Thibault', 'Alain', 'alain.thibault@company.com', 1, 2, '2024-03-04'),
('Urbain', 'Marie-Claire', 'marie-claire.urbain@company.com', 4, 4, '2024-03-05'),
('Vincent', 'Éric', 'eric.vincent@company.com', 5, 1, '2024-03-06'),
('Walton', 'Danielle', 'danielle.walton@company.com', 6, 5, '2024-03-07'),
('Xeres', 'Raymond', 'raymond.xeres@company.com', 7, 3, '2024-03-08'),
('Yanez', 'Fabrice', 'fabrice.yanez@company.com', 1, 2, '2024-04-01'),
('Zacharie', 'Sylvain', 'sylvain.zacharie@company.com', 2, 1, '2024-04-02'),
('Adam', 'Claire', 'claire.adam@company.com', 3, 3, '2024-04-03'),
('Barbier', 'Denis', 'denis.barbier@company.com', 1, 2, '2024-04-04'),
('Bontemps', 'Agnès', 'agnes.bontemps@company.com', 4, 4, '2024-04-05'),
('Carlier', 'André', 'andre.carlier@company.com', 5, 1, '2024-04-06'),
('Delorme', 'Francine', 'francine.delorme@company.com', 6, 5, '2024-04-07'),
('Emond', 'Michaël', 'michael.emond@company.com', 7, 3, '2024-04-08'),
('Fontanel', 'Lucette', 'lucette.fontanel@company.com', 1, 2, '2024-05-01'),
('Garnier', 'Christiane', 'christiane.garnier@company.com', 2, 1, '2024-05-02'),
('Hachet', 'Serge', 'serge.hachet@company.com', 3, 3, '2024-05-03'),
('Imbault', 'Camille', 'camille.imbault@company.com', 1, 2, '2024-05-04'),
('Jamaillé', 'Roseline', 'roseline.jamaille@company.com', 4, 4, '2024-05-05'),
('Karpf', 'Lionel', 'lionel.karpf@company.com', 5, 1, '2024-05-06'),
('Lague', 'Evelyne', 'evelyne.lague@company.com', 6, 5, '2024-05-07'),
('Manière', 'Roger', 'roger.maniere@company.com', 7, 3, '2024-05-08'),
('Noel', 'Andrée', 'andree.noel@company.com', 1, 2, '2024-06-01'),
('Ollivier', 'Stéphene', 'stephene.ollivier@company.com', 2, 1, '2024-06-02'),
('Passot', 'Francine', 'francine.passot@company.com', 3, 3, '2024-06-03'),
('Quillerm', 'Antoine', 'antoine.quillerm@company.com', 1, 2, '2024-06-04'),
('Renuard', 'Solange', 'solange.renuard@company.com', 4, 4, '2024-06-05'),
('Sentis', 'François', 'francois.sentis@company.com', 5, 1, '2024-06-06'),
('Thibout', 'Marguerite', 'marguerite.thibout@company.com', 6, 5, '2024-06-07'),
('Ugarte', 'Gilles', 'gilles.ugarte@company.com', 7, 3, '2024-06-08'),
('Vaillant', 'Marinette', 'marinette.vaillant@company.com', 1, 2, '2024-07-01'),
('Warnier', 'Théo', 'theo.warnier@company.com', 2, 1, '2024-07-02');

-- 7. AJOUTER DES INSCRIPTIONS PARTICIPANTS AUX FORMATIONS (relation many-to-many)
-- À faire selon votre structure JPA @ManyToMany ou avec une table d'association

COMMIT;
