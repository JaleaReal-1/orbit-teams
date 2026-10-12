#!/usr/bin/env bash
set -euo pipefail
release_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
case "$release_dir" in /home/ec2-user/orbit-soft/releases/*) ;; *) echo 'Invalid release directory' >&2; exit 1 ;; esac
cd "$release_dir"
commit=$(cat RELEASE_COMMIT)
[[ "$commit" =~ ^[a-f0-9]{40}$ ]] || exit 1
export RELEASE_COMMIT="$commit"
sudo env RELEASE_COMMIT="$commit" docker compose -p orbit-soft build
image="orbit-soft-web:$commit"
sudo docker run --rm --entrypoint nginx "$image" -t
candidate="orbit-soft-preflight-${commit:0:12}"
cleanup() { sudo docker rm -f "$candidate" >/dev/null 2>&1 || true; }
trap cleanup EXIT
sudo docker run -d --name "$candidate" -p 127.0.0.1:8083:80 "$image" >/dev/null
candidate_ok=false
for attempt in {1..10}; do
  if curl --fail --silent http://127.0.0.1:8083/orbit-soft/health.json | grep -q "$commit"; then
    candidate_ok=true
    break
  fi
  sleep 1
done
if [ "$candidate_ok" != true ]; then
  echo 'Candidate did not return the expected commit.' >&2
  exit 1
fi
cleanup
trap - EXIT
sudo env RELEASE_COMMIT="$commit" docker compose -p orbit-soft up -d --wait --wait-timeout 60
curl --fail --silent http://127.0.0.1/orbit-soft/health.json | grep -q "$commit"
ln -sfn "$release_dir" /home/ec2-user/orbit-soft/current
echo "Deployed commit: $commit"
