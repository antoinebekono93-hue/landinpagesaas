# MERCO – Landing Page

Landing page Next.js (App Router, TypeScript, Tailwind CSS) pour la campagne
Google Ads Search de MERCO. Elle présente l'offre **Accès à vie – 10 000 FCFA**
et pousse le visiteur à démarrer une conversation WhatsApp.

## Stack

- Next.js (latest stable, App Router)
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Déployable sur Vercel, sans backend

## Prérequis

- Node.js 18+ (testé avec Node 22)

## Installation locale

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000.

## Build de production

```bash
npm run build
npm run start
```

## Lien WhatsApp

Tous les boutons WhatsApp pointent vers `lib/constants.ts` > `WHATSAPP_LINK` :

```
https://wa.me/237698105696?text=Bonjour%20MERCO%20%F0%9F%91%8B%20Je%20viens%20de%20Google%20et%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20solutions%20pour%20lancer%20un%20SaaS%20ou%20un%20business%20digital.
```

Aucune redirection automatique vers WhatsApp : le visiteur charge la page puis
clique sur un bouton. Les paramètres UTM reçus (`utm_*`, `gclid`) sont transmis
au lien WhatsApp au clic (`lib/utm.ts`).

## Conformité Google Ads

- Page affichée sur le domaine Vercel (URL finale), pas de lien `wa.me` direct.
- Pas de cloaking, pas de redirection automatique, contenu identique pour tous.
- Pas de faux témoignages, pas de faux compteurs, aucune promesse de revenus.
- Mention légale dans le footer.

## Déploiement sur Vercel

1. Créer un dépôt GitHub avec ce projet (ou pousser ce dossier).

   ```bash
   git init
   git add .
   git commit -m "MERCO landing page"
   git remote add origin https://github.com/<utilisateur>/page-acceuil.git
   git push -u origin main
   ```

2. Créer un compte sur https://vercel.com.

3. Cliquer **Add New Project**, importer le dépôt GitHub, puis **Deploy**.

   Détection automatique : framework `Next.js`, build command `npm run build`,
   output `out` (adaptative) — aucun réglage obligatoire.

4. Une fois déployé, une URL `https://<projet>.vercel.app` est générée.
   Utiliser cette URL comme **URL finale** de la landing page dans Google Ads.

### Comme URL finale Google Ads

- Configurer dans Google Ads un **lien de suivi** : ajouter les paramètres
  `utm` souhaités en query string (ex : `?utm_source=google&utm_medium=cpc&utm_campaign=nom`).
  L'URL reste valide.

## Tracking WhatsApp (optionnel)

Chaque clic WhatsApp envoie l'événement `whatsapp_click` avec la propriété
`location` (hero, header, demo, categories, pricing, final_cta, sticky_mobile…).
Le tracking ne bloque jamais l'ouverture de WhatsApp.

Configurer Google Analytics 4 avec une variable d'environnement :

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Sans cette variable, le site fonctionne normalement sans GA. Le message
WhatsApp reste prérempli : `lib/constants.ts` > `WHATSAPP_MESSAGE`.

## Démo vidéo

L'URL de démonstration se centralise dans `lib/constants.ts` > `DEMO_URL`.
Tant qu'elle est vide, la page affiche un mockup léger avec le bouton
« Voir la démo » menant à WhatsApp. Aucune vidéo n'est chargée au chargement
initial ; le player n'est monté qu'au clic.

## Personnalisation

Numéro / message WhatsApp : `lib/constants.ts`
Prix : `lib/constants.ts` > `PRICE_TEXT`
Badge, H1, sous-titre, catégories, CTA : `lib/content.ts` > `heroContent`
Textes des sections : fichiers dans `components/`

## Vérification

- `npm run build` doit réussir.
- Tous les boutons WhatsApp utilisent `WHATSAPP_LINK` (voir `components/WhatsAppButton.tsx`).
- Aucune redirection automatique vers `wa.me` (aucune logique `redirect()` dans le code).