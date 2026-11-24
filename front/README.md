# NomadLink - Front-end Angular

Application Angular 17 utilisée pour l'interface utilisateur NomadLink. Ce README couvre les écrans et services liés à mon périmètre : packs, plans tarifaires, remises, factures, Reward Points, ainsi que l'intégration du chatbot.

## Technologies

- Angular 17
- TypeScript 5.2
- RxJS
- NgRx
- Bootstrap 5
- Angular Material
- Angular Leaflet
- Chart.js/ApexCharts
- jsPDF
- Stripe/PayPal côté interface

## Installation

```bash
cd front
npm install
npm start
```

Application : `http://localhost:4200`

Alternative avec Angular CLI :

```bash
npx ng serve
```

## Mon périmètre

### Front-office

- consultation des packs ;
- consultation des détails d'un pack ;
- consultation des plans tarifaires ;
- consultation des remises ;
- consultation des Reward Points ;
- interface du chatbot voyage.

### Back-office

- création et suivi des packs ;
- gestion des plans tarifaires ;
- ajout, édition et suppression des remises ;
- consultation des factures ;
- consultation et mise à jour des Reward Points ;
- interface conversationnelle.

Les écrans existants liés aux utilisateurs, réservations, boutique ou autres domaines sont cités uniquement comme composants de l'application globale et n'ont pas fait partie de mon travail principal.

## Services Angular responsables

| Service | Fonction |
|---|---|
| `PackService` | récupération des packs |
| `PricePlanService` | CRUD des plans tarifaires |
| `DiscountService` | CRUD des remises |
| `RewardPointsService` | points, code promotionnel |
| `TravelQaService` | appels au chatbot Flask |

## Configuration API

Les URL sont centralisées dans `src/environments/environment.ts`.

```ts
apiBaseUrl: 'http://localhost:9000/picloud'
```

Le chatbot utilise :

```ts
http://localhost:5000/api
```

Pour l'environnement de production, remplacer ces valeurs dans les fichiers `environment.prod.ts` ou par une configuration adaptée au pipeline Kubernetes.

## Chatbot Angular

Le composant `AiChatComponent` :

- affiche un message d'accueil ;
- envoie le message utilisateur à `/api/generate` ;
- affiche la réponse générée ;
- gère l'état de chargement ;
- affiche un message d'erreur en cas d'échec.

## Build

```bash
npm run build
```

Pour un build de production :

```bash
npx ng build --configuration production
```

## Docker

Build the production image from the `front` directory:

```bash
docker build -t nomadlink-frontend .
```

Run it on a Docker/Kubernetes network where the backend is reachable as `backend-service:9000`:

```bash
docker run --rm -p 8080:80 nomadlink-frontend
```

Nginx serves the Angular single-page application and proxies `/picloud` requests to `http://backend-service:9000`. The custom configuration is in [`nginx.conf`](nginx.conf) and replaces the image's `/etc/nginx/conf.d/default.conf`.

## Tests

```bash
npm test
```

Angular utilise Jasmine/Karma pour les tests unitaires.

## Captures d'écran

Ajouter les captures dans `front/screenshots/` puis les référencer ici :

```md
![Gestion des packs](screenshots/packs.png)
![Plans tarifaires](screenshots/price-plans.png)
![Remises](screenshots/discounts.png)
![Reward Points](screenshots/reward-points.png)
![Chatbot voyage](screenshots/travel-chatbot.png)
```

## Documentation du projet

- [Documentation globale](../README.md)
- [Back-end](../back/README.md)
- [Chatbot IA](../travel_chatbot/README.md)
- [Déploiement OpenStack/Kubernetes](../openstack-deployment/README.md)
