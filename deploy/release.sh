#!/usr/bin/env bash
set -euo pipefail
release_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
case "$release_dir" in /home/ec2-user/orbit-soft/releases/*) ;; *) echo 'Invalid release directory' >&2; exit 1 ;; esac
cd "$release_dir"
commit=$(cat RELEASE_COMMIT)
[[ "$commit" =~ ^[a-f0-9]{40}$ ]] || exit 1
export RELEASE_COMMIT="$commit"
sudo env RELEASE_COMMIT="$commit" docker compose -p orbit-soft up -d --build --wait
curl --fail --silent http://127.0.0.1:8082/health.json | grep -q "$commit"
if ! sudo docker inspect orbitjoy-web-1 --format '{{json .NetworkSettings.Networks}}' | grep -q 'orbit-soft-public'; then
  sudo docker network connect orbit-soft-public orbitjoy-web-1
fi
ingress=/home/ec2-user/orbitjoy/docker/deploy/docker-nginx-https.conf
backup="/home/ec2-user/orbit-soft/ingress-before-$commit.conf"
cp "$ingress" "$backup"
sed '/# BEGIN ORBIT SOFT/,/# END ORBIT SOFT/d' "$backup" > "$ingress"
cat deploy/ingress-server.conf >> "$ingress"
if ! sudo docker exec orbitjoy-web-1 nginx -t; then
  cp "$backup" "$ingress"
  echo 'Ingress validation failed; previous file restored.' >&2
  exit 1
fi
sudo docker exec orbitjoy-web-1 nginx -s reload
verified=false
for attempt in {1..10}; do
  if curl --fail --silent -H 'Host: ec2-18-224-68-11.us-east-2.compute.amazonaws.com' http://127.0.0.1/health.json | grep -q "$commit"; then
    verified=true
    break
  fi
  sleep 1
done
if [ "$verified" != true ]; then
  echo 'Public ingress did not return the expected commit.' >&2
  exit 1
fi
ln -sfn "$release_dir" /home/ec2-user/orbit-soft/current
echo "Deployed commit: $commit"
