#!/bin/sh
# Un seul build par utilisateur, partagé entre les projets de ce VPS Linux.
# BuildKit est plafonné réellement : NODE_OPTIONS seul ne borne pas ses processus.
set -eu
mode=${1:-}
case "$mode" in
  compose|image) shift ;;
  *) echo "Usage: $0 compose [options/services] | image [options docker buildx]" >&2; exit 2 ;;
esac
command -v flock >/dev/null 2>&1 || {
  echo "Ce build de production nécessite Linux avec flock et Docker Buildx. Sur le Mac/Podman, utiliser podman build pour les essais locaux." >&2
  exit 1
}
docker buildx version >/dev/null
state_dir="${XDG_CACHE_HOME:-$HOME/.cache}/maxa-build"
umask 077
mkdir -p "$state_dir"
exec 9>"$state_dir/build.lock"
echo "Attente du verrou de build commun aux applications…"
flock 9
builder=maxa-low-memory-v1
config="$state_dir/buildkitd.toml"
cat > "$config" <<'EOF'
[worker.oci]
  max-parallelism = 1
  gc = true
  reservedSpace = "256MB"
  maxUsedSpace = "1GB"
  minFreeSpace = "2GB"
EOF
if ! docker buildx inspect "$builder" >/dev/null 2>&1; then
  docker buildx create --name "$builder" --driver docker-container \
    --driver-opt memory=768m,memory-swap=1536m,cpu-period=100000,cpu-quota=100000,default-load=true,restart-policy=no \
    --buildkitd-config "$config" >/dev/null
fi
# Arrêter le builder rend sa RAM au VPS. Son volume garde le cache utile.
cleanup() { docker buildx stop "$builder" >/dev/null 2>&1 || true; }
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
if [ "$mode" = compose ]; then
  docker compose --parallel 1 build --builder "$builder" "$@"
else
  docker buildx build --builder "$builder" --load "$@"
fi
