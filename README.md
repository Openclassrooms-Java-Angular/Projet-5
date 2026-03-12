# 📘 README – Yoga App

## 📌 Description

Yoga App est une application full-stack permettant la gestion de sessions de yoga.
Elle permet :  
- l’authentification des utilisateurs
- la gestion des sessions (création, modification, suppression)
- la participation / désinscription aux sessions
- la gestion des enseignants

Le projet est composé :
- d’un front-end Angular
- d’un back-end Spring Boot
- d’une base de données MySQL
- de tests :
  - unitaires front-end
  - unitaires back-end
  - end-to-end

## ⚙️ Prérequis

Avant installation, vous devez disposer de :
- [Node.js 16](https://nodejs.org/fr/download)
- [Angular CLI 14](https://angular.dev/tools/cli/setup-local#install-the-angular-cli)
- [Java 11](https://www.oracle.com/fr/java/technologies/javase/jdk11-archive-downloads.html)
- [Maven](https://maven.apache.org/download.cgi)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/install/)

## 📥 Récupération du projet

```
git clone https://github.com/Openclassrooms-Java-Angular/Projet-3.git
cd Projet-3
```

## 🗄️ Installation de la base de données

### 1️⃣ Créer la base  
```
CREATE DATABASE YOUR_DATABASE;
```
(remplacer `YOUR_DATABASE` par le nom de votre base de données)

### 2️⃣ Importer la structure et les données dans la base
```
/ressources/sql/script.sql
```

### 3️⃣ Configurer le fichier application.properties
Dans :
```
back/src/main/resources/application.properties
```

Configurer :
```
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DATABASE
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```
(remplacer `YOUR_DATABASE`, `YOUR_USERNAME` et `YOUR_PASSWORD` par vos propres valeurs)

## 📦 Installation des dépendances

### 🔹 Back-end (Spring Boot)

Depuis le dossier `back` :
```
cd back
mvn clean install
```

Cela permet de :
- télécharger les dépendances Maven
- compiler le projet

### 🔹 Front-end (Angular)

Depuis le dossier `front`, télécharger les dépendances node.js :
```
cd front
npm install
```

## 🚀 Lancement de l’application

1. Lancer le back-end
```
cd back
mvn spring-boot:run
```

Le serveur démarre sur :
```
http://localhost:8080
```

2. Lancer le front-end
```
cd front
npm run start
```

Application accessible sur :
```
http://localhost:4200
```

## 🧪 Lancer les tests

### ✅ Tests Back-End (Spring Boot)

#### Tests unitaires et d'intégration avec JUnit

Depuis le dossier `back/` :
```
mvn clean test
```

Le rapport de couverture de code (généré par [JaCoCo](https://www.jacoco.org/jacoco/)) est disponible ici :
```
back/target/site/jacoco/index.html
```

### ✅ Tests Front-End (Angular)

#### Tests unitaires et d'intégration avec Jest

Depuis le dossier `front/` :
```
npm run test -- --coverage
```
Le rapport de couverture de code (généré par [istanbul](https://istanbul.js.org/)) est disponible ici :
```
front/coverage/jest/lcov-report/index.html
```

#### Tests end-to-end (E2E) avec Cypress

Depuis le dossier `front` :

1️⃣ Mode interactif (GUI)

```
npx cypress open
```

* Lance Cypress en mode graphique
* Permet d’exécuter les tests individuellement
* Utile pour le développement et le débogage
* Utilise automatiquement la version instrumentée du front-end pour la couverture de code

> ⚠️ La console restera attachée tant que le GUI est ouvert 

2️⃣ Mode headless (CLI, intégration continue)

Pour exécuter tous les tests E2E **en arrière-plan** et collecter la couverture correctement :

1. Lancer le serveur Angular instrumenté dans une console séparée :
```
ng run yoga:serve-coverage
```

2. Lancer Cypress headless dans une autre console :
```
npx cypress run
```

* Exécute tous les tests E2E en arrière-plan
* Utilise la configuration Angular définie dans `angular.json`
* Idéal pour intégration continue ou génération de rapports

> ⚠️ Ne pas utiliser `npx cypress run` seul avec `ng serve`, sinon la couverture ne sera pas collectée correctement.

##### Génération du rapport de couverture pour les tests E2E

Après avoir exécuté les tests E2E (GUI ou headless) :
```
npm run e2e:coverage
```
Le rapport de couverture de code (généré par [istanbul](https://istanbul.js.org/)) est disponible ici :
```
front/coverage/lcov-report/index.html
```

⚠️ **Points importants**
1. Toujours exécuter les commandes dans cet ordre :
   1. `ng run yoga:serve-coverage`
   2. `npx cypress run`
   3. `npm run e2e:coverage`
2. Sur Windows, la console du serveur Angular reste attachée : il faut la laisser ouverte pendant l’exécution des tests headless.
3. GUI ou headless fonctionnent, mais headless est recommandé pour l’intégration continue. 

### 🎯 Résultat attendu

- Tous les tests s'exécutent correctement
- La couverture de code est supérieure ou égale à 80%