# Workflow Git — Projet IL (Groupe N)

## 1. Règles d'or

- **main** : Code stable uniquement (ne jamais coder dessus).
- **develop** : Branche commune de l'équipe. On part toujours d'ici et on fusionne ici.
- **Branches de tâches** : 1 tâche = 1 branche temporaire (`front/...`, `back/...`, `sync/...`, `video/...`), supprimée après le merge.
- **Mention IA obligatoire** : Ajouter `[AI-Assisted]` dans le commit si une IA a été utilisée.

---

## 2. Cycle de vie d'une tâche

### Étape 1 — Créer sa branche

Depuis `develop` à jour :

    git switch develop
    git pull origin develop
    git switch -c front/nom-tache
    git push -u origin front/nom-tache

### Étape 2 — Coder et sauvegarder

**1 tâche = 1 commit**

    git add .
    git commit -m "feat(front): description courte [AI-Assisted]"
    git push

### Étape 3 — Fusionner dans `develop`

Une fois la tâche terminée :

    git switch develop
    git pull origin develop
    git merge front/nom-tache
    git push origin develop

### Étape 4 — Supprimer la branche terminée

**Local + GitHub**

    git branch -d front/nom-tache
    git push origin -d front/nom-tache

---

## 3. Conventions de commits

**Format :**

    type(domaine): description

| Type | Utilisation |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `style` | Design / CSS uniquement |
| `docs` | Documentation |