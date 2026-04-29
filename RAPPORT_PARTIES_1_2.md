# Rapport de projet - Parties 1 et 2

Ce document propose une base de rédaction en français pour les deux premières parties du rapport du projet de gestion de formation. Le contenu est aligné sur le code du projet présent dans ce dépôt : backend Spring Boot, frontend Next.js, base de données MySQL et authentification JWT.

## 1. Introduction générale

Dans un contexte où la transformation numérique touche tous les secteurs d'activité, les organismes de formation ont besoin d'outils fiables leur permettant de planifier, suivre et exploiter efficacement les informations liées aux sessions de formation. La gestion manuelle ou semi-numérique de ces activités engendre souvent des pertes de temps, des erreurs de saisie, une duplication des données et des difficultés de pilotage.

Le présent projet s'inscrit dans cette logique d'amélioration. Il vise la conception et la réalisation d'une application web de gestion des formations pour un centre de formation nommé Excellence Training. Cette application permet d'administrer les formations, les participants, les formateurs, les domaines, les structures, les profils ainsi que les utilisateurs de la plateforme, tout en offrant des indicateurs statistiques facilitant la prise de décision.

L'objectif principal de ce travail est de mettre en place une solution centralisée, sécurisée et moderne permettant d'automatiser les principales tâches de gestion de la formation. Le système développé repose sur une architecture client-serveur, avec un backend Java Spring Boot exposant des API REST et un frontend Next.js offrant une interface ergonomique aux utilisateurs selon leurs rôles.

Ce rapport présente d'abord l'étude de l'existant, la critique de cette situation et la solution proposée. Il expose ensuite la méthodologie adoptée, les besoins fonctionnels et non fonctionnels, la planification du projet selon Scrum, l'environnement matériel et logiciel, ainsi que l'architecture logique de la solution.

### 1.2.1 Étude de l'existant

Dans plusieurs centres de formation, la gestion des activités est encore réalisée à l'aide de fichiers Excel, de documents papier ou d'applications dispersées ne communiquant pas entre elles. Les responsables doivent souvent enregistrer manuellement les informations relatives aux formations, aux participants et aux formateurs, ce qui rend le suivi global difficile.

L'étude du besoin montre que les opérations suivantes sont généralement nécessaires :

- enregistrer les formations avec leur titre, leur date de début, leur durée, leur budget et leur domaine ;
- gérer les participants et leurs informations administratives ;
- gérer les formateurs internes et externes ;
- associer les participants aux formations ;
- suivre les structures, profils et employeurs ;
- sécuriser l'accès selon le type d'utilisateur ;
- obtenir des statistiques d'aide au pilotage.

Avant la mise en place de cette application, ces opérations étaient souvent traitées séparément, sans véritable centralisation ni automatisation. Cette situation limite la visibilité sur l'ensemble des données et ralentit la prise de décision.

### 1.2.2 Critique de l'existant

L'analyse de l'existant met en évidence plusieurs insuffisances.

Premièrement, l'absence d'une base centralisée entraîne une dispersion de l'information. Les données liées aux formations, aux participants et aux formateurs peuvent être stockées dans différents supports, ce qui complique leur consultation et leur mise à jour.

Deuxièmement, la gestion manuelle augmente le risque d'erreurs. La ressaisie répétée, l'oubli de mises à jour et les incohérences entre documents peuvent altérer la fiabilité des informations.

Troisièmement, les responsables ne disposent pas toujours d'indicateurs en temps réel pour suivre l'activité du centre. Sans tableau de bord ni statistiques consolidées, il devient difficile d'évaluer le nombre de formations, le volume de participants ou l'évolution des programmes.

Quatrièmement, la sécurité d'accès est généralement limitée dans les approches traditionnelles. Tous les intervenants peuvent parfois consulter ou modifier les mêmes données, sans séparation claire des responsabilités.

Enfin, les solutions classiques ne facilitent pas l'évolution du système. L'ajout de nouvelles fonctionnalités comme la réinitialisation de mot de passe, les invitations utilisateurs ou les visualisations statistiques devient plus complexe lorsqu'aucune architecture logicielle moderne n'a été prévue dès le départ.

### 1.2.3 Solution proposée

Pour répondre aux limites observées, nous avons proposé le développement d'une application web de gestion des formations reposant sur une architecture moderne, modulaire et sécurisée.

La solution réalisée permet de :

- gérer l'authentification des utilisateurs avec contrôle d'accès par rôle ;
- administrer les formations, participants, formateurs, domaines, profils, structures et employeurs ;
- centraliser toutes les données dans une base de données relationnelle ;
- offrir une interface web intuitive pour la consultation et la mise à jour des informations ;
- fournir des statistiques synthétiques sur l'activité du centre ;
- améliorer la traçabilité et la cohérence des données.

Sur le plan technique, le backend a été développé avec Spring Boot, Spring Data JPA, Spring Security et JWT. Le frontend a été développé avec Next.js, React, TypeScript, Tailwind CSS et des composants d'interface modernes. La persistance des données repose sur MySQL. Cette organisation permet de séparer clairement la logique métier, l'accès aux données, la sécurité et l'interface utilisateur.

### 1.3 Méthodologie de travail et langage de modélisation (Scrum et UML)

Afin de mener à bien ce projet, nous avons adopté une démarche de développement itérative inspirée de Scrum. Cette approche permet d'organiser le travail par objectifs progressifs, de prioriser les fonctionnalités essentielles et d'ajuster la solution au fur et à mesure de l'avancement.

En parallèle, le langage UML a été utilisé comme outil de modélisation afin de représenter les besoins, les acteurs, les cas d'utilisation et l'architecture logique du système. Cette modélisation facilite la compréhension du fonctionnement global de la solution avant et pendant son implémentation.

### 1.3.1 Méthodologies de travail

La méthodologie Scrum repose sur un développement incrémental. Le projet est découpé en plusieurs tâches organisées dans un backlog, puis réparties en sprints. Chaque sprint vise la réalisation d'un ensemble de fonctionnalités opérationnelles.

Dans le cadre de ce projet, cette approche a permis :

- d'identifier les priorités fonctionnelles ;
- de commencer par les modules fondamentaux comme l'authentification et la gestion des entités principales ;
- de faire évoluer progressivement l'interface utilisateur ;
- d'intégrer ensuite les statistiques et les fonctions d'administration ;
- de tester et corriger au fur et à mesure.

Cette méthode est particulièrement adaptée aux projets web, car elle facilite l'intégration continue des fonctionnalités et la validation régulière des résultats obtenus.

### 1.3.2 Langage de modélisation : UML

UML (Unified Modeling Language) est un langage standard de modélisation utilisé pour décrire les différents aspects d'un système logiciel. Dans ce projet, UML sert à formaliser les besoins et à représenter la structure de l'application avant ou pendant son développement.

Les diagrammes les plus utiles pour ce projet sont :

- le diagramme de cas d'utilisation, pour identifier les interactions entre les acteurs et le système ;
- le diagramme de classes, pour représenter les principales entités comme Formation, Participant, Formateur, Utilisateur, Domaine et Structure ;
- le diagramme de séquence, pour illustrer certains scénarios comme l'authentification ou la création d'une formation ;
- le diagramme d'architecture logique, pour montrer la séparation entre interface utilisateur, API métier, services, couche d'accès aux données et base de données.

## 2. Planification et spécification des besoins

### 2.1 Capture des besoins

La capture des besoins constitue une étape essentielle dans la réussite du projet. Elle permet d'identifier précisément les attentes des futurs utilisateurs et de traduire ces attentes en fonctionnalités concrètes.

Dans le cadre de cette application, les besoins ont été déduits du domaine métier de la gestion de formation ainsi que des modules effectivement implémentés dans le projet. Le système doit permettre une gestion complète, cohérente et sécurisée des informations relatives à l'activité du centre.

### 2.1.1 Identification des acteurs

Le système met en évidence les acteurs suivants :

1. **Administrateur**
   - gère les utilisateurs ;
   - consulte l'ensemble des modules ;
   - administre les référentiels du système ;
   - supervise les statistiques globales.

2. **Responsable**
   - gère les formations, les participants et les formateurs ;
   - consulte les tableaux de bord ;
   - peut créer et gérer certains utilisateurs selon les droits accordés.

3. **Simple utilisateur**
   - consulte les informations autorisées ;
   - accède au tableau de bord ;
   - peut interagir avec certains modules selon les permissions définies.

4. **Système de messagerie**
   - intervient dans l'envoi des invitations et des réinitialisations de mot de passe.

### 2.1.2 Identification des besoins fonctionnels

Les besoins fonctionnels du système sont les suivants :

- authentifier les utilisateurs via une page de connexion ;
- permettre le premier accès avec changement de mot de passe ;
- permettre la réinitialisation du mot de passe par email ;
- gérer les utilisateurs et leurs rôles ;
- ajouter, modifier, supprimer et consulter les formations ;
- ajouter, modifier, supprimer et consulter les participants ;
- ajouter, modifier, supprimer et consulter les formateurs ;
- gérer les domaines, profils, structures et employeurs ;
- associer les participants aux formations ;
- consulter un tableau de bord récapitulatif ;
- afficher des statistiques sur les formations, les participants et les formateurs ;
- filtrer certaines données par domaine, structure ou année ;
- sécuriser l'accès aux fonctionnalités selon le rôle connecté.

### 2.1.3 Identification des besoins non fonctionnels

En plus des besoins fonctionnels, le système doit satisfaire plusieurs besoins non fonctionnels :

- **sécurité** : authentification par JWT, protection des accès et chiffrement des mots de passe ;
- **performance** : temps de réponse raisonnable lors du chargement des listes et tableaux de bord ;
- **ergonomie** : interface claire, moderne et responsive ;
- **maintenabilité** : architecture en couches facilitant la maintenance ;
- **évolutivité** : possibilité d'ajouter de nouvelles fonctionnalités sans refonte complète ;
- **fiabilité** : validation des données et gestion centralisée des erreurs ;
- **portabilité** : accessibilité via navigateur web sur différents postes.

### 2.2 Diagramme de cas d'utilisation

Le diagramme de cas d'utilisation de ce projet doit représenter les interactions entre les trois acteurs principaux et le système.

Les principaux cas d'utilisation sont :

- se connecter ;
- compléter la première connexion ;
- réinitialiser le mot de passe ;
- gérer les formations ;
- gérer les participants ;
- gérer les formateurs ;
- gérer les domaines ;
- gérer les profils ;
- gérer les structures ;
- gérer les employeurs ;
- gérer les utilisateurs ;
- consulter les statistiques ;
- consulter le tableau de bord.

Une représentation textuelle simplifiée peut être formulée ainsi :

- l'administrateur interagit avec tous les cas d'utilisation ;
- le responsable interagit avec la gestion métier et la consultation ;
- le simple utilisateur accède principalement à la consultation et aux opérations autorisées ;
- le service de messagerie intervient dans l'envoi des emails système.

### 2.3 Pilotage du projet avec Scrum

Le pilotage du projet s'appuie sur une logique Scrum, avec une progression par incréments. Chaque phase de développement produit un résultat exploitable et rapproche le système de sa version finale.

Le projet a été structuré autour d'étapes cohérentes :

- analyse du besoin ;
- modélisation ;
- mise en place du backend ;
- implémentation de la sécurité ;
- réalisation du frontend ;
- intégration des tableaux de bord et statistiques ;
- tests et ajustements.

### 2.3.2 Backlog du produit

Le backlog du produit peut être formulé sous forme d'histoires utilisateur :

- en tant qu'administrateur, je veux créer des utilisateurs afin de gérer les accès à l'application ;
- en tant qu'utilisateur, je veux me connecter afin d'accéder à mon espace ;
- en tant qu'utilisateur, je veux réinitialiser mon mot de passe en cas d'oubli ;
- en tant que responsable, je veux gérer les formations afin d'organiser les sessions ;
- en tant que responsable, je veux gérer les participants afin de suivre les inscriptions ;
- en tant que responsable, je veux gérer les formateurs afin d'affecter les intervenants ;
- en tant qu'administrateur, je veux gérer les domaines, profils, structures et employeurs afin de maintenir les référentiels ;
- en tant que décideur, je veux consulter des statistiques afin de piloter l'activité.

### 2.3.3 Planification des sprints

Une planification possible des sprints pour ce projet est la suivante :

**Sprint 1 : Analyse et conception**
- étude du besoin ;
- définition des acteurs ;
- préparation des diagrammes UML ;
- conception de la base de données.

**Sprint 2 : Mise en place du backend**
- création des entités JPA ;
- création des repositories ;
- développement des services métier ;
- exposition des API REST.

**Sprint 3 : Sécurité et gestion des accès**
- configuration de Spring Security ;
- authentification par JWT ;
- gestion des rôles ;
- mise en place du premier login et de la réinitialisation de mot de passe.

**Sprint 4 : Développement du frontend**
- mise en place de l'interface Next.js ;
- création des pages dashboard et administration ;
- intégration des appels API ;
- création des formulaires de gestion.

**Sprint 5 : Statistiques, tests et finalisation**
- ajout des vues statistiques ;
- amélioration de l'ergonomie ;
- tests fonctionnels ;
- correction des anomalies ;
- préparation de la livraison.

### 2.4 Environnement matériel

Le développement et l'exécution du projet nécessitent un environnement matériel standard pour une application web moderne :

- ordinateur de développement avec processeur multi-cœur ;
- mémoire vive de 8 Go minimum ;
- espace disque suffisant pour le code source, les dépendances et la base de données ;
- connexion réseau locale pour la communication entre frontend, backend et base de données.

### 2.5 Environnement logiciel

Le projet s'appuie sur un ensemble d'outils et de technologies cohérents avec le développement d'une application web full stack.

### 2.5.1 Outils de développement, conception et gestion de version

Les principaux outils mobilisés sont :

- **IntelliJ IDEA ou VS Code** pour le développement ;
- **Postman** pour tester les API REST ;
- **Gradle** pour la gestion du build backend ;
- **npm** ou **pnpm** pour la gestion des dépendances frontend ;
- **MySQL** pour la persistance des données ;
- **Git** pour la gestion de version ;
- **UML** pour la modélisation ;
- **navigateur web** pour les tests de l'interface.

### 2.5.2 Choix technologiques : frameworks et langages

Les choix technologiques retenus sont les suivants :

- **Java 17** : langage principal du backend ;
- **Spring Boot** : développement rapide d'API REST ;
- **Spring Data JPA** : persistance orientée objet ;
- **Spring Security** : sécurisation des accès ;
- **JWT** : gestion des sessions stateless ;
- **Next.js 15** : framework frontend moderne basé sur React ;
- **React 19** : construction de l'interface utilisateur ;
- **TypeScript** : typage côté frontend ;
- **Tailwind CSS** : stylisation rapide et cohérente ;
- **Recharts** : visualisation statistique ;
- **MySQL** : système de gestion de base de données relationnelle.

Le choix de ces technologies s'explique par leur robustesse, leur large adoption et leur compatibilité avec une architecture web moderne en couches.

### 2.6 Architecture du projet : l'architecture logique

L'architecture logique du projet est de type client-serveur multicouche.

Elle se compose des éléments suivants :

1. **Couche présentation**
   - développée avec Next.js ;
   - contient les pages, composants, tableaux de bord et formulaires ;
   - communique avec le backend via des requêtes HTTP.

2. **Couche API / contrôleurs**
   - implémentée avec les contrôleurs Spring Boot ;
   - reçoit les requêtes du frontend ;
   - valide les entrées et renvoie des réponses structurées.

3. **Couche métier / services**
   - contient la logique métier ;
   - applique les règles de gestion ;
   - orchestre les traitements nécessaires.

4. **Couche accès aux données**
   - basée sur Spring Data JPA ;
   - assure la communication avec la base de données ;
   - manipule les entités via les repositories.

5. **Couche persistance**
   - représentée par la base MySQL ;
   - stocke les utilisateurs, formations, participants, formateurs et référentiels.

6. **Couche sécurité**
   - prise en charge par Spring Security et JWT ;
   - contrôle l'authentification et les autorisations selon les rôles.

Une représentation textuelle simple de cette architecture est :

`Utilisateur -> Interface Next.js -> API REST Spring Boot -> Services métier -> Repositories JPA -> Base de données MySQL`

