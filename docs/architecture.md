# Architecture du projet

## État du document

Ce document décrit l'organisation technique actuelle du projet.

Le cahier des charges étant encore en cours de finalisation, certains choix concernant les fonctionnalités et l'architecture pourront évoluer.

## Technologies

Le projet utilise actuellement :

- Next.js
- React
- JavaScript
- JSX
- Tailwind CSS
- ESLint

## Organisation du projet

Le code de l'application se trouve dans le dossier `src`.

Les principaux dossiers sont :

- `src/app/` : pages et structure principale de l'application
- `src/components/` : composants React réutilisables
- `src/lib/` : fonctions et traitements techniques communs

## Fonctionnalités prévues

La plateforme doit notamment permettre :

- de créer et rejoindre des salons ;
- de regarder des vidéos YouTube de manière synchronisée ;
- d'utiliser un chat textuel en temps réel ;
- de gérer une file d'attente de vidéos ;
- de voir les utilisateurs présents dans un salon ;
- de gérer les droits d'administration d'un salon ;
- de créer des salons privés.

Cette liste pourra évoluer en fonction de la version définitive du cahier des charges.

## Architecture applicative

L'application est construite avec Next.js et React.

Les pages et composants React sont utilisés pour l'interface utilisateur.

Les fonctionnalités nécessitant une communication avec le serveur et une gestion des données en temps réel seront intégrées progressivement au cours du développement.

Les choix concernant la base de données, la gestion des utilisateurs, la communication temps réel et l'hébergement seront précisés lorsque ces éléments seront définitivement définis.