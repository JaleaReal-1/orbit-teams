#!/bin/sh
set -eu
cd /home/ec2-user/orbitjoy/docker
/usr/bin/docker run --rm -v "$PWD/certificates:/etc/letsencrypt" -v "$PWD/acme:/var/www/certbot" certbot/certbot:v5.5.0 renew --quiet --no-random-sleep-on-renew
/usr/bin/docker compose -f compose.yaml -f compose.https.yaml exec -T web nginx -t
/usr/bin/docker compose -f compose.yaml -f compose.https.yaml exec -T web nginx -s reload
