# PROMPT OPENCODE — intégrer les 40 candidats Envato dans MERCO

Tu vas intégrer dans le projet MERCO existant le fichier `MERCO_ENVATO_40_SAAS.md` fourni avec ce prompt.

## OBJECTIF

Créer dans MERCO un catalogue riche de 40 **candidats SaaS de recherche** (8 catégories × 5) avec une fiche produit détaillée contenant : source officielle CodeCanyon, informations produit, démo officielle, identifiants publics de démo quand ils existent, dépendances et coûts externes connus.

IMPORTANT : ces 40 produits ne sont PAS automatiquement disponibles dans l'abonnement MERCO.

## 1. NE PAS CASSER L'EXISTANT

- Projet existant ; ne pas le recréer.
- Conserver Next.js App Router + TypeScript + Tailwind.
- Ne pas casser `/`, `/creer-saas`, `/creer-saas/catalogue`, `/creer-saas/starter`, `/creer-saas/pro`, `/creer-saas/demo`, `/creer-saas/faq`.
- Conserver le tracking, UTM/gclid, WhatsApp et le design MERCO Business.

## 2. SÉPARER CATALOGUE COMMERCIAL ET CATALOGUE DE RECHERCHE

Créer `lib/saas-research-catalog.ts`.

Chaque produit de `MERCO_ENVATO_40_SAAS.md` doit devenir une entrée structurée avec au minimum :

```ts
export type ResearchSaaS = {
  id: string;
  slug: string;
  categoryKey: string;
  categoryLabel: string;
  selectionRank: number;
  name: string;
  author?: string;
  sourcePlatform: "CodeCanyon / Envato Market";
  productUrl: string;
  regularPriceObservedUsd?: number | null;
  extendedPriceObservedUsd?: number | null;
  salesObserved?: number | null;
  ratingObserved?: number | null;
  observedAt: "2026-09-16";
  shortDescription: string;
  targetCustomers: string[];
  techStack?: string[];
  multiTenant: true | false | "needs-audit";
  saasEligible: boolean;
  demoUrls: Array<{ label: string; url: string | null; note?: string }>;
  demoCredentials: Array<{
    role: string;
    username: string;
    password: string;
    loginUrl?: string | null;
    note?: string;
  }>;
  dependencies: string[];
  externalCosts: string[];
  riskFlags?: string[];
  sourceVerified: true;
  licenseVerified: false;
  commerciallyAvailable: false;
  status: "research";
};
```

**Ne passe aucun produit à `licenseVerified:true`, `commerciallyAvailable:true` ou `status:"active"`.** Cette décision reste manuelle après achat/audit MERCO.

GoFleet doit en plus rester `saasEligible:false` et `multiTenant:"needs-audit"`.

## 3. PAGE CATALOGUE

Sur `/creer-saas/catalogue`, afficher les 8 catégories :

- CRM & ventes
- Réservation
- E-commerce
- Éducation
- RH & gestion
- Création de sites
- Logistique
- WhatsApp & relation client

Ajouter :
- filtre catégorie ;
- recherche par nom ;
- filtre `Disponible MERCO` / `À l'étude`.

Pour le moment, les 40 nouveaux candidats doivent afficher un badge :

`À l'étude chez MERCO`

ou si `saasEligible:false` :

`Audit technique requis`

CTA candidat :

`Voir la fiche`

Ne pas afficher `Choisir ce SaaS` tant que licence + disponibilité ne sont pas validées.

## 4. FICHE PRODUIT DYNAMIQUE

Créer ou enrichir :

`/creer-saas/catalogue/[slug]`

Structure :

Breadcrumb
→ nom + catégorie
→ badge de statut MERCO
→ description
→ pour qui / cas d'usage
→ technologies si connues
→ multi-tenant / points à vérifier
→ démo officielle
→ identifiants publics de démo
→ dépendances
→ coûts API/services externes
→ informations source
→ statut licence MERCO
→ CTA approprié

## 5. BLOC SOURCE OFFICIELLE

Afficher clairement :

`Source officielle : CodeCanyon / Envato Market`

Bouton :

`Voir le produit source`

vers `productUrl`, avec :

```html
target="_blank" rel="noopener noreferrer"
```

Ajouter :

`Informations observées le 16 septembre 2026. Les prix, démos, notes, ventes et caractéristiques du vendeur peuvent changer.`

Ne jamais laisser croire que MERCO est l'auteur des logiciels tiers.

## 6. DÉMO OFFICIELLE

Créer `OfficialDemoCard`.

Pour chaque URL de démonstration publique disponible :
- bouton libellé selon le rôle ;
- nouvelle fenêtre ;
- `noopener noreferrer`.

Si l'URL directe de démo n'est pas confirmée :

`La démo officielle est accessible depuis la page CodeCanyon du vendeur.`

Puis bouton `Ouvrir la source officielle`.

Ne crée aucune URL de démo inventée.

## 7. IDENTIFIANTS DE DÉMONSTRATION

Créer `PublicDemoCredentials`.

Afficher uniquement les identifiants explicitement présents dans `MERCO_ENVATO_40_SAAS.md`.

Pour chaque compte :
- rôle ;
- identifiant/email ;
- mot de passe ;
- bouton copier identifiant ;
- bouton copier mot de passe ;
- bouton ouvrir la page de connexion si disponible.

Texte obligatoire :

`Identifiants publics de démonstration publiés par l'auteur. Ils peuvent changer ou être désactivés à tout moment.`

Ajouter :

`Utilisez la démo uniquement pour évaluer le produit. Ne supprimez pas et ne modifiez pas volontairement les données partagées.`

Ne jamais inventer un compte pour les produits où aucun identifiant n'est confirmé.

## 8. IMAGES

NE PAS :
- hotlinker automatiquement les images Envato ;
- télécharger/copier les screenshots Envato ;
- utiliser les previews vendeur comme images MERCO sans vérification des droits.

Pour un candidat de recherche : utiliser icône de catégorie, mockup neutre ou illustration MERCO.

Préparer :

```ts
mercoScreenshots?: string[]
```

Après achat/test MERCO, le propriétaire ajoutera ses propres captures.

## 9. LICENCES — BLOQUANT

Chaque candidat :

```ts
licenseVerified: false
commerciallyAvailable: false
status: "research"
```

Afficher :

`Licence MERCO : en cours de vérification`

et :

`La présence de ce logiciel dans le catalogue de recherche ne signifie pas qu'il est déjà inclus dans votre abonnement. MERCO vérifie la licence, l'architecture et le déploiement avant activation commerciale.`

Ne jamais déduire qu'une licence est correcte à partir du prix, du mot SaaS, du tag multi-tenant ou de l'existence d'une Extended Licence.

## 10. CTA CONDITIONNELS

Seulement lorsque, plus tard, le propriétaire change manuellement un produit en :

```ts
licenseVerified === true &&
commerciallyAvailable === true &&
saasEligible === true &&
status === "active"
```

alors afficher :

`Choisir ce SaaS`

WhatsApp :

`Bonjour MERCO 👋 Je souhaite lancer le SaaS [NOM]. Pouvez-vous m'aider à l'ajouter à mon plan ?`

Sinon afficher :

`Demander la vérification`

WhatsApp :

`Bonjour MERCO 👋 Je suis intéressé par [NOM]. Pouvez-vous vérifier sa disponibilité, sa licence et sa compatibilité avec MERCO Business ?`

## 11. PRIX CODECANYON ≠ PRIX MERCO

Les prix source doivent rester secondaires.

Libellé :

`Prix observé chez le vendeur`

Ajouter :

`Prix indicatif susceptible de changer. Ce n'est pas le tarif de l'abonnement MERCO.`

Ne modifier en aucun cas la tarification MERCO Business :
- Starter : 9 $/mois pendant 12 mois puis 45 $/mois ;
- Pro : 18 $/mois pendant 12 mois puis 65 $/mois.

## 12. DÉPENDANCES ET COÛTS EXTERNES

Si un produit dépend d'un autre logiciel (ex. Perfex CRM, Ramom School), afficher un bloc `Dépendances`.

Si WhatsApp/Meta, IA, SMS, Twilio, e-mail, stores mobiles ou autre API génèrent des coûts : afficher `Services externes possibles` et préciser qu'ils ne sont pas automatiquement inclus dans MERCO.

## 13. TRACKING

Ajouter :

- `product_source_click`
- `product_demo_click`
- `demo_credential_copy`
- `product_verification_request`
- conserver `saas_select` pour les produits actifs futurs.

Propriétés :
`product_id`, `product_slug`, `category`, `location`, `role` si applicable.

Analytics ne doit jamais bloquer navigation/copie.

## 14. SEO

Pour les fiches `research` :

```ts
robots: { index: false, follow: true }
```

Lorsqu'un produit devient réellement disponible, il pourra devenir indexable manuellement.

Canonical = URL MERCO de la fiche.

## 15. SÉCURITÉ / PAS DE SOURCE PRIVÉE

Ne jamais créer :
- bouton de téléchargement ;
- lien ZIP ;
- lien privé de la bibliothèque MERCO ;
- purchase code Envato ;
- clé licence ;
- credentials MERCO.

Les seules informations externes autorisées ici sont les URLs publiques CodeCanyon et les démos publiques publiées par l'auteur.

## 16. VALIDATION

Exécuter :

```bash
npx tsc --noEmit
npm run build
```

Puis vérifier :
- exactement 40 candidats ;
- exactement 5 par catégorie ;
- `/creer-saas/catalogue` → HTTP 200 ;
- chaque `/creer-saas/catalogue/[slug]` → HTTP 200 ;
- aucun candidat non licencié n'affiche `Choisir ce SaaS` ;
- GoFleet reste non éligible ;
- aucun lien privé ;
- aucun identifiant inventé ;
- produits sans démo directe : pas de bouton cassé ;
- copie identifiants fonctionne ;
- responsive 375px ;
- typecheck OK ;
- build OK.

À la fin donne :
1. fichiers créés ;
2. fichiers modifiés ;
3. nombre par catégorie ;
4. routes générées ;
5. composants source/démo/credentials ;
6. tracking ;
7. protections licence ;
8. produits nécessitant vérification manuelle ;
9. typecheck ;
10. build.

Implémente réellement. Ne donne pas seulement un plan.


---

# DONNÉES À INTÉGRER — MERCO_ENVATO_40_SAAS.md

# MERCO — 40 candidats SaaS Envato/CodeCanyon

**Recherche arrêtée au 16 septembre 2026.** 8 catégories × 5 candidats. Les prix, ventes, notes, démos et identifiants sont des observations publiques et peuvent changer.

> Règle MERCO : tous les produits ci-dessous restent `status: research`, `licenseVerified: false`, `commerciallyAvailable: false` tant que MERCO n'a pas vérifié la licence adaptée, installé/testé le produit et validé son architecture. Les identifiants ci-dessous sont uniquement des comptes de démonstration publics publiés par les vendeurs. Ne jamais inventer un identifiant manquant.

## 1. CRM & ventes

### 1) Grow CRM SaaS — NextLoop
- Source : https://codecanyon.net/item/grow-crm-saas-laravel-project-management-multitenancy/45363769
- Prix Regular observé : **89 $** — env. **574 ventes**, **4,85/5**.
- Pourquoi : vrai multi-tenant, sous-domaines clients, bases séparées, produit mature.
- Démo : https://saas.growcrm.io
- Owner : https://saas.growcrm.io/app-admin — `owner@example.com` / `growcrm`
- Client : https://customer.growcrm.io — `customer@example.com` / `growcrm`
- Statut MERCO : **candidat prioritaire**.

### 2) Sales SaaS — Business Sales CRM — WorkDo
- Source : https://codecanyon.net/item/sales-saas-business-sales-crm/30241292
- Prix observé : **29 $** — env. **336 ventes**, **5,00/5**.
- Démo : https://demo.workdo.io/sales-saas/login
- Super Admin : `superadmin@example.com` / `password`
- Company : `company@example.com` / `password`
- Sales User : `sarahjohnson@example.com` / `password`

### 3) LeadHub — Multi-Tenant SaaS CRM
- Source : https://codecanyon.net/item/leadhub-multitenant-saas-crm-with-lead-pipelines-forms-automations/63311759
- Prix observé : **39 $** — env. **56 ventes**, **4,43/5**.
- Stack/angle : Laravel/Filament, pipelines, formulaires, automations.
- Démo : utiliser le bouton **Live Preview** de la page CodeCanyon (URL directe à revérifier avant publication).
- Identifiants : aucun identifiant statique confirmé — **ne rien inventer**.

### 4) Perfex CRM SaaS Module
- Source : https://codecanyon.net/item/perfex-crm-saas-module-transform-your-perfex-crm-into-a-powerful-multitenancy-solution/46070331
- Prix observé : **99 $** — env. **1,1K ventes**, **4,98/5**.
- Dépendance : **Perfex CRM 3.1+** à acheter/licencier séparément.
- Démo : https://perfextosaas.com
- Admin : https://perfextosaas.com/admin — `admin@admin.com` / `password`
- Client : https://perfextosaas.com — `customer@customer.com` / `password`
- Note : revérifier les identifiants juste avant publication ; la démo peut être réinitialisée.

### 5) Coravo — AI-Powered CRM & ERP SaaS — SoftEntra
- Source : https://codecanyon.net/item/coravo-aipowered-crm-erp-saas-platform/64710287
- Prix observé : **79 $** — produit très récent, faible historique de ventes.
- Stack : Laravel 13 + Vue 3 ; multi-tenant/white-label annoncé.
- Démo : https://coravo-saas.softentra.com
- Connexion : démo **one-click** sur le site, pas d'identifiants statiques nécessaires.
- Statut : **recherche**, pas activation immédiate.

## 2. Réservation

### 1) BookingGo SaaS — WorkDo
- Source : https://codecanyon.net/item/bookinggo-saas-multi-business-appointment-booking-and-scheduling/50585829
- Prix observé : **69 $** — env. **268 ventes**, **4,94/5**.
- Démo : https://bookinggo-demo.workdo.io/login
- Super Admin : `superadmin@example.com` / `1234`
- Company : `company@example.com` / `1234`

### 2) Aoxio — SaaS Multi-Business Booking
- Source : https://codecanyon.net/item/aoxio-saas-multibusiness-service-booking-software/33026229
- Prix observé : **39 $** — env. **715 ventes**, **4,81/5**.
- Démo principale : https://aoxiosaas.site
- Exemple domaine personnalisé : https://aoxio.online
- Identifiants : aucun statique confirmé.

### 3) Bookapp — Service & Appointment Booking Laravel Marketplace (SAAS)
- Source : https://codecanyon.net/item/bookapp-multivendor-service-appointment-booking-laravel-website-subscription-based/54240416
- Prix observé : **49 $** — env. **171 ventes**.
- Front : https://php82.kreativdev.com/bookapp/
- Admin : https://php82.kreativdev.com/bookapp/demo/admin/ — `admin` / `admin`
- Vendor : https://php82.kreativdev.com/bookapp/demo/vendor/login/ — `tomhughes` / `123456`
- Staff : https://php82.kreativdev.com/bookapp/demo/staff/login/ — `liamjohnson` / `12345678`

### 4) Bookin SaaS — Multi Vendor Service Booking
- Source : https://codecanyon.net/item/bookin-saas-multi-vendor-service-booking-system/55623951
- Prix observé : **59 $** — env. **89 ventes**, **4,00/5**.
- Démo à vérifier : https://nativecode.in/demo/bookin
- Identifiants : aucun statique confirmé.

### 5) BookingDo SaaS
- Source : https://codecanyon.net/item/bookingdo-saas-multi-business-appointment-service-booking-saas/42347177
- Prix observé : env. **29 $** — env. **286 ventes**.
- Démo : https://bookingdo.paponapps.co.in
- Super Admin : `admin@gmail.com` / `123456`
- Service Provider : `vendor1@gmail.com` / `123456`

## 3. E-commerce

### 1) Ecommet — White-Label Multitenant Ecommerce Website Builder
- Source : https://codecanyon.net/item/ecommet-multitenant-ecommerce-website-saas/57240303
- Prix observé : **49 $** — env. **229 ventes**, **5,00/5**.
- Main : https://ecommet.xyz/
- Admin : https://ecommet.xyz/admin/
- Tenant login : https://ecommet.xyz/login/
- Customer login : https://ecommet.xyz/skinflow/customer/login/
- Exemple boutique : https://manti.ecommet.xyz/
- Identifiants : non confirmés statiquement.

### 2) StoreGo SaaS — Online Store Builder — WorkDo
- Source : https://codecanyon.net/item/storego-saas-online-store-builder/31116337
- Prix observé : env. **24 $** — env. **1,47K ventes**, **5,00/5**.
- Démo : https://demo.workdo.io/storego-saas/login
- Super Admin : `superadmin@example.com` / `password`
- Company : `company@example.com` / `password`

### 3) Botble Ecommerce SaaS — Multi-tenant Store Platform
- Source : https://codecanyon.net/item/botble-ecommerce-saas-multitenant-store-platform/65116868
- Prix observé : **69 $** — produit très récent.
- Landing : https://saas.botble.com
- Operator : https://saas.botble.com/saas-admin/operator — `operator@botble.com` / `12345678`
- Store 1 : https://demo1.saas.botble.com
- Store 1 admin : https://demo1.saas.botble.com/saas-admin — `demo1@botble.com` / `12345678`
- Store 2 : https://demo2.saas.botble.com
- Store 2 admin : https://demo2.saas.botble.com/saas-admin — `demo2@botble.com` / `12345678`

### 4) Nazmart — Multi-Tenancy eCommerce Platform (SAAS)
- Source : https://codecanyon.net/item/nazmart-multitenancy-ecommerce-platform-saas/42802410
- Prix observé : **69 $** — env. **533 ventes**, **4,51/5**.
- Main : https://nazmart.net/
- Super Admin : `super_admin` / `12345678`
- Front user : `test` / `12345678`
- Custom domain admin : https://hexfashion.xyz/admin — `super_admin` / `12345678`

### 5) StoreMart SaaS — Grocery Delivery System
- Source : https://codecanyon.net/item/storemart-saas-grocery-delivery-system/38430497
- Prix Regular observé : env. **14 $** — env. **329 ventes**.
- Démo : https://store-mart.paponapps.co.in
- Admin : `admin@gmail.com` / `123456`
- Shop Owner : `user@yopmail.com` / `123456`

## 4. Éducation

### 1) eSchool SaaS — WRTeam
- Source : https://codecanyon.net/item/eschool-saas-school-management-system-with-student-parents-teacher-flutter-app-laravel-admin/49307764
- Prix observé : **79 $** — env. **993 ventes**, **4,94/5**.
- Vrai multi-school avec base/branding par école.
- Landing : https://eschool-saas.wrteam.me
- Démo école : https://crestwood-academy.eschool-saas.wrteam.me
- Identifiants statiques : non confirmés.

### 2) Ekattor 8 Laravel School Management System (SAAS)
- Source : https://codecanyon.net/item/ekattor-8-school-management-system/39611172
- Prix Regular observé : **55 $** — Extended observée env. **350 $** — env. **546 ventes**.
- Démo : https://demo.creativeitem.com/ekattor8/login
- Comptes souvent publiés dans l'écosystème Creativeitem, **à revérifier avant affichage** : `admin@example.com` / `1234`, `teacher@example.com` / `1234`, `student@example.com` / `1234`.

### 3) Ramom School Subscription (SaaS)
- Source : https://codecanyon.net/item/ramom-school-subscription-saas/45121444
- Prix observé : **50 $** — env. **354 ventes**.
- Dépendance : Ramom School Multi Branch.
- SaaS : https://saas.ramomcoder.com
- Démo école 1 : https://iconschool.ramomcoder.com
- Démo école 2 : https://oxford.ramomcoder.com
- Identifiants statiques : non confirmés.

### 4) Quizora — AI Quiz & Exam SaaS Platform
- Source : https://codecanyon.net/item/quizora-ai-quiz-exam-saas-platform-with-payments-and-certificates/63989606
- Prix observé : **59 $**.
- Base : https://quizora.ishalabs.com/
- Admin : https://quizora.ishalabs.com/admin — `admin@quizora.app` / `password`
- Creator : https://quizora.ishalabs.com/creator — `priya@demo.quiz` / `password`
- Customer : https://quizora.ishalabs.com/login — `alice@demo.quiz` / `password`
- Attention : coûts API IA possibles.

### 5) SmartSchool SaaS — ASP.NET Core
- Source : https://codecanyon.net/item/smartschool-saas-aspnet-core-school-management-system/64279997
- Prix observé : **59 $** — produit très récent, env. **1 vente** observée.
- Démo : http://smartschoolsaas.linacode.pro/login
- Identifiants : aucun statique confirmé.
- Statut : **audit renforcé avant activation**.

## 5. RH & gestion

### 1) ERPGo SaaS — WorkDo
- Source : https://codecanyon.net/item/erpgo-saas-all-in-one-business-erp-with-project-account-hrm-crm-pos/33263426
- Prix observé : **69 $** — env. **2,39K ventes**, **4,90/5**.
- Démo : https://demo.workdo.io/erpgo-saas/login
- Super Admin : `superadmin@example.com` / `1234`
- Company : `company@example.com` / `1234`
- Employee : `john.smith@company.com` / `1234`
- Customer : `sarah.johnson@client.com` / `1234`
- Vendor : `alex.vendor@supplier.com` / `1234`

### 2) HRM SaaS — HR and Payroll Tool — WorkDo
- Source : https://codecanyon.net/item/hrm-saas-hr-and-payroll-tool/25982934
- Prix observé : **39 $** — env. **1,28K ventes**, **4,88/5**.
- Démo : https://demo.workdo.io/hrm-saas/login
- Super Admin : `superadmin@example.com` / `password`
- Company : `company@example.com` / `password`
- HR : `maggie93@example.com` / `password`
- Employee : `qwaters@example.com` / `password`

### 3) HRM SAAS — Human Resource Management — ajay138
- Source : https://codecanyon.net/item/hrm-saas-human-resource-management/23400912
- Prix Regular observé : **49 $** — Extended observée : **124 $**.
- Démo : https://hrm-saas.froid.works
- Admin : `admin@example.com` / `123456`
- Employee : `employee@example.com` / `123456`
- Super Admin : `superadmin@example.com` / `123456`

### 4) Stocky SaaS — POS / Inventory / ERP / HRM
- Source : https://codecanyon.net/item/stocky-pos-inventory-management-saas/62663753
- Prix observé : **59 $** — env. **130 ventes**, **5,00/5**.
- Landing : https://stockysaas.xyz/
- Central admin : https://stockysaas.xyz/super/login — `superadmin@stockysaas.site` / `123456`
- Tenant : https://john.stockysaas.xyz — `john@stockysaas.site` / `12345678`

### 5) Hrmifly SAAS
- Source : https://codecanyon.net/item/hrmifly-saas-complete-payroll-and-hr-management-system-hrm/58648534
- Prix observé : **49 $** — env. **68 ventes**, **5,00/5**.
- Démo : https://hrmifly.codeifly.in
- Admin : `admin@example.com` / `12345678`

## 6. Création de sites

### 1) Businesso — AI Powered Website Builder SaaS
- Source : https://codecanyon.net/item/businesso-business-website-builder-saas-multitenancy/34880110
- Prix Regular observé : **49 $** — Extended observée : **199 $** — env. **1,1K ventes**, **4,78/5**.
- Main : https://biznesso.vip/
- Admin : https://biznesso.vip/admin/
- Tenant : https://biznesso.vip/login/
- Customer : https://boutique.biznesso.vip/user/login/
- Identifiants statiques : non confirmés.

### 2) MultiSaas — Multi-Tenancy Multipurpose Website Builder
- Source : https://codecanyon.net/item/multisass-multitenancy-multipurpose-website-builder-sass/41892997
- Prix observé : **59 $** — env. **654 ventes**, **4,46/5**.
- Super Admin : https://multipurposesass.com/admin — `super_admin` / `12345678`
- Front user : `test` / `12345678`
- Custom domain : https://picajobfinder.xyz/admin — `super_admin` / `12345678`
- Subdomain : https://donation.multipurposesass.com/admin — `super_admin` / `12345678`
- Note : mise à jour moins récente, audit sécurité/compatibilité nécessaire.

### 3) Webby — AI No-Code Website Builder SaaS
- Source : https://codecanyon.net/item/webby-aipowered-nocode-website-builder-saas-platform/61857601
- Prix promo observé : env. **29 $**, Extended observée env. **350 $** — env. **213 ventes**, **4,11/5**.
- Démo à revérifier : https://webby.titansys.dev/
- Identifiants : non confirmés.
- Coûts API IA possibles.

### 4) Profilex — Multitenant Portfolio Website Builder
- Source : https://codecanyon.net/item/profilex-portfolio-builder-saas-multiuser-profile/33283445
- Prix observé : **49 $** — env. **627 ventes**.
- Main : https://profilez.xyz/
- Admin : https://profilez.xyz/admin/
- Tenant login : https://profilez.xyz/login/
- Customer : https://profilez.xyz/Rabiot/user/login/
- Exemple : https://profilez.xyz/Rabiot/

### 5) Krikkit — AI Website Builder SaaS Platform
- Source : https://codecanyon.net/item/krikkit-ai-website-builder-saas-platform-for-promptbased-site-generation/65055559
- Prix Regular observé : **49 $** — Extended observée env. **297 $** — env. **23 ventes**, **5,00/5** initial.
- Démo : bouton Live Preview sur la source, URL exacte à revérifier.
- Produit très récent : garder en **recherche**.

## 7. Logistique

### 1) Deprixa Plus — Courier & Delivery Management System | Logistics SaaS
- Source : https://codecanyon.net/item/deprixa-plus-the-ultimate-courier-logistics-saas-platform/63216725
- Prix observé : **79 $** — env. **45 ventes**.
- Architecture annoncée : **vrai multi-tenant**, une installation pour plusieurs organisations, Laravel 12 + React 19.
- Démo : bouton Live Preview de la page source (URL directe à revérifier).
- Super Admin : `admin@deprixa.com` / `Admin@1234`
- Admin demo : `admin@demo.deprixa.com` / `Admin@1234`
- Employee : `employee@demo.deprixa.com` / `Admin@1234`
- Driver : `driver@demo.deprixa.com` / `Driver@1234`

### 2) We Courier SAAS — Multi-Tenancy Courier & Logistics
- Source : https://codecanyon.net/item/we-courier-saas-multitenancy-courier-and-logistics-management-merchant-delivery-app-with-admin/51166784
- Prix observé : **99 $** — env. **68 ventes**, **4,00/5**.
- Admin : https://wemaxdevs.xyz — `admin@wemaxdevs.com` / `12345678`
- Company : https://company.wemaxdevs.xyz — `company@wemaxdevs.com` / `12345678`
- Branch : https://company.wemaxdevs.xyz/login — `branch@wemaxdevs.com` / `12345678`
- Merchant : même login — `merchant@wemaxdevs.com` / `12345678` — Merchant ID `2024`.

### 3) Delivery Hub SaaS — Parcel & Courier Management Tool
- Source : https://codecanyon.net/item/courier-management-system-saas/54499134
- Prix observé : **39 $** — env. **34 ventes**, **5,00/5**.
- Démo : https://demo.smartwebinfotech.com
- Super Admin : `superadmin@gmail.com` / `123456`
- Owner : `owner@gmail.com` / `123456`
- Customer : `customer@gmail.com` / `123456`
- Driver : `driver@gmail.com` / `123456`

### 4) Smart Fleet SaaS — Vehicle Tracking System
- Source : https://codecanyon.net/item/vehicle-management-saas-addon/50627270
- Prix Regular observé : **39 $** — Extended : **199 $** — env. **60 ventes**.
- Démo : https://demo.smartwebinfotech.com
- Super Admin : `superadmin@gmail.com` / `123456`
- Owner : `owner@gmail.com` / `123456`
- Manager : `manager@gmail.com` / `123456`
- Cas d'usage : flottes, transporteurs, location de véhicules, maintenance, drivers, fuel, dépenses.

### 5) SaaS GoFleet Control
- Source : https://codecanyon.net/item/gofleet-complete-courier-delivery-management-system-with-web-app-admin-dashboard-driver-app/58388789
- Prix observé : **304 $**, mais seulement env. **2 ventes** observées.
- Admin : https://apptechmobile.com/apptech/Onfleet/index.php/Admin/login — `admin@gmail.com` / `123456`
- Dispatcher : https://apptechmobile.com/apptech/Onfleet/Dispatch/login — `dispatch@gmail.com` / `123456` **à revérifier**.
- User : https://apptechmobile.com/apptech/Onfleet/Website/index — `7225862195` / `123456`
- Driver : `driver@gmail.com` / `123456`
- **MERCO : `saasEligible: false` tant que le vrai multi-tenant n'est pas audité.** C'est justement un exemple où prix élevé ≠ meilleure preuve qualité.

## 8. WhatsApp & relation client

### 1) WhatsCRM
- Source : https://codecanyon.net/item/whatscrm-chatbot-flow-builder-api-access-whatsapp-crm-saas-system/51122205
- Prix observé : **69 $** — env. **1,216 ventes**, **4,50/5**.
- Démo : https://crm.oneoftheprojects.com
- Admin : `admin@admin.com` / `Password@123`
- User : `user@user.com` / `password`
- Agent : `john@agent.com` / `password`
- Coût externe : WhatsApp Cloud API/Meta selon usage.

### 2) Wapi — WhatsApp CRM SaaS
- Source : https://codecanyon.net/item/wapi-whatsapp-crm-saas-with-chatbot-flow-builder-api-automation-multitenant-system/62205973
- Prix Regular observé : **149 $** — Extended observée env. **699 $**.
- Front : https://wapi-front-red.vercel.app
- Admin : https://wapi-admin.vercel.app — `admin@example.com` / `123456789`
- User : `john@example.com` / `123456789`
- Agent : `jack@example.com` / `123456789`
- Coûts WhatsApp/API externes possibles.

### 3) Whoxa Business
- Source : https://codecanyon.net/item/whoxa-business-crm-chat-messenger-nodejs-script-for-whatsapp-with-admin-panel/63265500
- Prix observé : **79 $**.
- Stack : Node.js/PostgreSQL ; VPS/root à prévoir.
- Super Admin : https://whoxa-super-admin.vercel.app — `admin@admin.com` / `Admin@123`
- User/Agent : https://whoxacrmweb.vercel.app/login
- User : `alicejohn@yopmail.com` / `123456`
- Agent : `agent@yopmail.com` / `123456`

### 4) WACRM — AI-Powered Messaging & Communication SaaS
- Source : https://codecanyon.net/item/swiftchat-the-ultimate-aipowered-messaging-communication-saas-platform/61419649
- Prix observé : **79 $**.
- Démo : https://wacrm.wrapcoders.com
- User : `user@demo.com` / `User123!`
- Agent : `agent@demo.com` / `Agent123!`
- Admin : `admin@demo.com` / `Admin123!`
- Coûts IA/messaging externes possibles.

### 5) WaDesk SaaS
- Source : https://codecanyon.net/item/wadesk-saas-aipowered-whatsapp-crm-automation-chatbot-builder-and-bulk-messenger/63755235
- Prix observé : **49 $** — env. **144 ventes**, **4,86/5**.
- Démo : https://wadesk.mediacity.co.in
- Admin : `admin@mediacity.co.in` / `12345678`
- Trial User : `trialuser@gmail.com` / `12345678`
- Premium User : `user@mediacity.co.in` / `12345678`
- Coûts WhatsApp/IA externes possibles.

---

# Sélection de déploiement MERCO recommandée en premier

Pour éviter de payer/maintenir 40 logiciels immédiatement, commence par **1 candidat par catégorie** puis active les autres après validation commerciale :

| Catégorie | Premier candidat à auditer/déployer |
|---|---|
| CRM & ventes | Grow CRM SaaS |
| Réservation | BookingGo SaaS |
| E-commerce | Ecommet |
| Éducation | eSchool SaaS |
| RH & gestion | ERPGo SaaS |
| Création de sites | Businesso |
| Logistique | Deprixa Plus |
| WhatsApp & relation client | WhatsCRM |

# Règles avant activation commerciale

1. Acheter/vérifier la licence adaptée au modèle payant MERCO.
2. Installer sur un environnement de test MERCO.
3. Vérifier le vrai multi-tenant et l'isolation des données.
4. Vérifier les coûts API externes et les limites serveur.
5. Tester les rôles, l'onboarding, le paiement, le domaine/subdomaine, backups et mises à jour.
6. Prendre des **captures MERCO** après achat/test ; ne pas hotlinker automatiquement les images Envato.
7. Passer seulement ensuite à `licenseVerified: true`, `commerciallyAvailable: true`, `status: active`.
