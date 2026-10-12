FROM nginx:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/web/ /usr/share/nginx/html/orbit-soft/
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1/orbit-soft/health.json || exit 1
