# Configuration du Formulaire de Contact

Ce document explique comment configurer le système d'envoi d'emails avec protection anti-spam.

## Variables d'environnement requises

Ajoutez les variables suivantes dans votre fichier `.env.local` :

```env
# Resend API Key
# Obtenez votre clé sur https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# reCAPTCHA v3
# Obtenez vos clés sur https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## Configuration Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Obtenez votre API key depuis le dashboard
3. **Important** : Modifiez l'adresse `from` dans `/src/app/api/contact/route.ts` :
   - Remplacez `"Portfolio Contact <onboarding@resend.dev>"` par votre domaine vérifié
   - Ou utilisez votre domaine personnalisé après vérification

## Configuration reCAPTCHA v3

1. Allez sur [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Créez un nouveau site avec le type **reCAPTCHA v3**
3. Ajoutez vos domaines (localhost pour le dev, votre domaine pour la prod)
4. Copiez la **Site Key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
5. Copiez la **Secret Key** → `RECAPTCHA_SECRET_KEY`

## Fonctionnalités implémentées

### ✅ Protection anti-spam

- **reCAPTCHA v3** : Vérification invisible basée sur un score
- **Rate limiting** : 5 requêtes maximum par IP toutes les 15 minutes
- **Validation côté serveur** : Vérification stricte des données

### ✅ Envoi d'emails

- **Resend** : Service d'email transactionnel moderne
- **Templates HTML** : Emails formatés avec les informations du formulaire
- **Reply-To** : Les réponses arrivent directement à l'expéditeur

### ✅ Tracking

- **Statistiques simples** : Nombre total d'emails envoyés/bloqués
- **Endpoint GET** : `/api/contact` pour consulter les stats (protégez-le en production)

## Endpoint API

### POST `/api/contact`

Envoie un email depuis le formulaire de contact.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "subject": "Prise de contact",
  "message": "Bonjour...",
  "recaptchaToken": "token_from_recaptcha"
}
```

**Réponses:**

- `200` : Email envoyé avec succès
- `400` : Données invalides ou reCAPTCHA échoué
- `429` : Rate limit dépassé
- `500` : Erreur serveur

### GET `/api/contact`

Retourne les statistiques d'envoi (protégez cet endpoint en production).

## Améliorations futures possibles

- [ ] Base de données pour stocker les soumissions et statistiques
- [ ] Dashboard admin pour visualiser les stats
- [ ] Webhooks Resend pour tracking avancé
- [ ] Redis pour rate limiting distribué
- [ ] Honeypot field supplémentaire
- [ ] Validation d'email plus stricte (disposable emails, etc.)

## Notes de sécurité

- ⚠️ Ne commitez jamais vos clés API dans le repository
- ⚠️ Protégez l'endpoint GET `/api/contact` en production (authentification)
- ⚠️ Configurez CORS si nécessaire
- ⚠️ Envisagez d'utiliser Redis pour le rate limiting en production (au lieu de la mémoire)
