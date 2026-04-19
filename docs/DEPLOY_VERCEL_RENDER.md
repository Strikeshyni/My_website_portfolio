# Deploy Front Vercel + Back Render

Ce guide déploie:
- Frontend React/Vite sur Vercel
- Backend en services séparés sur Render

## 1. Préparer GitHub

1. Push ce repo sur GitHub.
2. Vérifie que ces fichiers existent:
- `render.yaml`
- `vercel.json`

## 2. Déployer les services Render (un service par API)

Dans Render:
1. `New` -> `Blueprint`
2. Sélectionne ce repo GitHub
3. Render va créer automatiquement les services définis dans `render.yaml`:
- `portfolio-api` (Node/Express)
- `sudoku-api` (Flask)
- `mushroom-api` (Flask)
- `ocr-sudoku-api` (FastAPI)

### Variables Render à renseigner

#### Service `portfolio-api`
- `MONGODB_URI` = URI MongoDB Atlas
- `NODE_ENV` est déjà défini à `production`

#### Service `mushroom-api`
- `CORS_ORIGINS` = `https://ton-projet.vercel.app,http://localhost:5173`

## 3. Déployer le frontend sur Vercel

Dans Vercel:
1. `Add New` -> `Project`
2. Import ce repo
3. Framework: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`

## 4. Mettre à jour les rewrites Vercel

Le fichier `vercel.json` route déjà:
- `/api/*` -> service Render Express
- `/sudoku/*` -> service Render Sudoku
- `/mushroom/*` -> service Render Mushroom
- `/ocr-sudoku/*` -> service Render OCR
- `/chatbot/*` -> service chatbot externe (placeholder)
- `/stock/*` -> service stock externe (placeholder)

### Action obligatoire
Remplace dans `vercel.json`:
- `YOUR-CHATBOT-RENDER-URL`
- `YOUR-STOCK-RENDER-URL`

par les vrais noms Render de ces services.

Puis redeploy Vercel.

## 5. Services externes Chatbot et Stock

Ils ne sont pas dans ce repo. Tu dois les déployer séparément sur Render (depuis leurs repos dédiés), puis reporter leurs URLs dans `vercel.json`.

## 6. Vérification finale

Une fois déployé, teste:

- `https://TON-VERCEL-DOMAIN/api/health`
- `https://TON-VERCEL-DOMAIN/sudoku/api/sudoku/health`
- `https://TON-VERCEL-DOMAIN/mushroom/health`
- `https://TON-VERCEL-DOMAIN/ocr-sudoku/health`

Si ces URLs répondent, le front et les backends sont correctement connectés.

## 7. Notes importantes

- Les rewrites Vercel évitent la majorité des problèmes CORS côté navigateur.
- Les plans free Render peuvent "sleep" (première requête lente).
- Si un endpoint renvoie 502/504, teste d'abord l'URL Render directe du service pour isoler le problème.
