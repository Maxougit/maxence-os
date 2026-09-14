## Builds sur un petit VPS

Les cibles Docker du Makefile utilisent `scripts/build-low-memory.sh`. Ce script est
prévu pour **Docker Engine + Buildx + Compose et `flock` sur Linux**. Il crée un builder
partagé entre les projets de l’utilisateur, avec 768 Mio de RAM physique, 1 536 Mio au
total RAM + swap, 1 CPU et une seule étape de build à la fois. Un verrou empêche deux
projets de construire simultanément. Le builder s’arrête après succès ou échec ; son
cache est conservé, avec une cible de collecte de 1 Go.

Ces valeurs ont été vérifiées sur le serveur de 2 Go `192.168.1.224`. Ce sont des plafonds,
pas une garantie qu’un build donné rentre en mémoire. Un échec de compilation conserve
le conteneur en service. `NODE_OPTIONS` borne le tas JavaScript, pas toute la mémoire du
build : le plafond du conteneur BuildKit est donc nécessaire. Ne pas remplacer le
wrapper par `docker compose build --memory`, option ignorée par BuildKit.

Le premier build télécharge BuildKit et les dépendances. Conserver le cache pour les
mises à jour habituelles ; un rebuild sans cache doit rester exceptionnel. Le wrapper
ne lance aucune purge globale des images ou des volumes et ne supprime pas de sauvegarde.

Sur le Mac équipé de Podman, les essais se font directement avec `podman build --layers
--format docker ...` et des ports publiés sur `127.0.0.1`. Le Mac est ARM64 et le serveur
est AMD64 : une image destinée au serveur doit être construite avec `--platform
linux/amd64` puis validée sur cette architecture avant transfert.

Commande : `make update` construit la version locale du dépôt et attend la santé du nouveau conteneur. `make update` ne fait pas de `git pull`. Pour tester Compose sur une autre interface : `WEB_BIND=127.0.0.1 WEB_PORT=3101`.
