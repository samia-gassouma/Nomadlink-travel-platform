# NomadLink - Back-end Spring Boot

Ce README décrit l'API Java de NomadLink sur laquelle j'ai implémenté les gestionnaires de packs, plans tarifaires, remises, factures, Stripe et Reward Points.

## Technologies

- Java 21
- Spring Boot 3.4.3
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL
- Lombok
- Stripe Java SDK
- Spring Mail
- Springdoc/OpenAPI

## Architecture

Le back-end suit une organisation Controller / Service / Repository / Entity.

```text
src/main/java/tn/cloudcrafters/picloud/
├── Controller/gestionPack/
├── Service/gestionPack/
├── Repository/gestionPack/
├── Entity/gestionPack/
└── SecurityAll/
```

## Périmètre responsable

- Pack
- PricePlan
- Discount
- Facture
- Paiement
- Stripe Checkout et webhook
- RewardPoints
- interfaces front/back associées à ces domaines

Les autres modules sont présents dans le dépôt mais n'ont pas fait partie de mes responsabilités.

## Installation

```bash
cd back
./mvnw spring-boot:run
```

Sur Windows, si le wrapper n'est pas disponible :

```bash
cd back
mvn spring-boot:run
```

API : `http://localhost:9000/picloud`

## Docker

Build the image from the `back` directory:

```bash
docker build -t nomadlink-backend .
```

Run it on the same container network as MySQL and provide connection details and secrets through environment variables:

```bash
docker run --rm -p 9000:9000 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/final \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=<database-password> \
  -e STRIPE_SECRET_KEY=<stripe-secret-key> \
  nomadlink-backend
```

The image exposes port `9000`. The `/app/uploads` directory is a volume so uploaded files can be persisted outside the container.

## Configuration

Configurer au minimum :

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `stripe.secret.key`
- `stripe.webhook.secret`
- les identifiants SMTP
- la clé JWT

Les secrets doivent être injectés par variables d'environnement ou profils Spring, jamais dans le dépôt.

## Modèle métier

### Pack

- nom
- type
- description
- date de début
- date de fin
- image
- remise
- plans tarifaires
- paiements

Types : `CULTURE`, `FESTIVAL`, `FAMILY`, `ADVENTURE`, `ECO_TOURISM`, `CRUISE`.

### PricePlan

- nom : `Basic`, `Standard`, `Advanced` ou `Premium`
- description
- prix
- pack associé

### Discount

- pourcentage de réduction
- date de début
- date de fin
- packs associés

### Facture

- date d'émission
- montant total
- URL PDF
- utilisateur
- paiement associé

### RewardPoints

- solde de points
- date de validité
- date de mise à jour
- état actif
- valeur
- code promotionnel
- indicateur d'utilisation

## Endpoints responsables

| Ressource | Méthodes principales |
|---|---|
| `/pack` | création, consultation |
| `/price-plan` | CRUD |
| `/discount` | CRUD |
| `/getFacture/*`, `/getAllFacture`, `/addFacture` | factures |
| `/create-checkout-session` | session Stripe |
| `/getPromo/{id_user}` | conversion points vers promotion |
| `/webhook` | événements Stripe |
| `/reward-points` | lecture, création et mise à jour |

## Flux Stripe

1. Angular crée une session Checkout.
2. Le navigateur est redirigé vers Stripe.
3. Stripe envoie un événement `checkout.session.completed`.
4. Le back-end identifie l'utilisateur, le pack et le montant.
5. Les Reward Points sont mis à jour.
6. Une facture locale est créée.
7. Le PDF Stripe est récupéré.
8. La facture est envoyée par e-mail selon le flux configuré.

## Tests

```bash
cd back
mvn test
```

La génération OpenAPI peut être consultée via Swagger lorsque Springdoc est activé.

## Documentation du projet

- [Documentation globale](../README.md)
- [Front-end](../front/README.md)
- [Chatbot IA](../travel_chatbot/README.md)
- [Déploiement OpenStack/Kubernetes](../openstack-deployment/README.md)
