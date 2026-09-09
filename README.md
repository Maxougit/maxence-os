```bash
docker build -t maxence-os .
```

# and

```bash
sudo docker run -d -p 3001:3000 --restart always --name maxenceOS maxence-os
```

## Statistiques (maxa-analytics)

Le site peut envoyer des statistiques sans cookie à l'instance auto-hébergée maxa-analytics. Google Analytics reste actif en parallèle.

Copier `.env.example` vers `.env`, renseigner `MAXA_ANALYTICS_HOST=https://t.maxadev.fr` et `MAXA_ANALYTICS_SITE_ID` avec l'identifiant fourni par le dashboard, puis relancer `make docker-build`. Les deux valeurs vides désactivent le tracker. Le domaine à déclarer dans le dashboard est `cv.maxenceleroux.fr`.
