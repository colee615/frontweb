#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

sed -i 's|^APP_ENV=.*|APP_ENV=production|' .env
sed -i 's|^APP_DEBUG=.*|APP_DEBUG=false|' .env
sed -i 's|^APP_URL=.*|APP_URL=https://172.65.10.55:8118|' .env
sed -i 's|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|' .env
grep -q '^DB_HOST=' .env && sed -i 's|^DB_HOST=.*|DB_HOST=172.65.10.51|' .env || echo 'DB_HOST=172.65.10.51' >> .env
grep -q '^DB_PORT=' .env && sed -i 's|^DB_PORT=.*|DB_PORT=5432|' .env || echo 'DB_PORT=5432' >> .env
grep -q '^DB_DATABASE=' .env && sed -i 's|^DB_DATABASE=.*|DB_DATABASE=website|' .env || echo 'DB_DATABASE=website' >> .env
grep -q '^DB_USERNAME=' .env && sed -i 's|^DB_USERNAME=.*|DB_USERNAME=postgres|' .env || echo 'DB_USERNAME=postgres' >> .env
grep -q '^DB_PASSWORD=' .env && sed -i 's|^DB_PASSWORD=.*|DB_PASSWORD=Correos.2025|' .env || echo 'DB_PASSWORD=Correos.2025' >> .env
sed -i 's|^SESSION_DRIVER=.*|SESSION_DRIVER=file|' .env
sed -i 's|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=false|' .env

echo 'Esperando conexion a PostgreSQL...'
until pg_isready -h 172.65.10.51 -p 5432 -U postgres 2>/dev/null; do
    echo 'Reintentando en 3s...'
    sleep 3
done
echo 'PostgreSQL conectado.'

php artisan key:generate --force || true
php artisan jwt:secret --force || true

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
chmod -R ug+rw storage bootstrap/cache || true

# Increase upload limits for CMS media (carousel images/videos).
cat > /usr/local/etc/php/conf.d/99-uploads.ini << 'EOF'
upload_max_filesize=32M
post_max_size=32M
memory_limit=256M
max_file_uploads=50
max_execution_time=120
max_input_time=120
EOF

php artisan migrate --force || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan storage:link --force || true

exec php artisan serve --host=0.0.0.0 --port=8000
