# Multi-stage Dockerfile to build front_end (Vite/React) and back_end (Laravel)

# ---- Frontend build stage ----
FROM node:18-alpine AS frontend-build
WORKDIR /app/front_end
COPY front_end/package*.json ./
RUN npm ci --silent
COPY front_end/ ./
RUN npm run build


# ---- Composer install stage ----
FROM composer:2 AS composer-install
WORKDIR /app/back_end
COPY back_end/composer.json back_end/composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
COPY back_end/ ./
RUN composer dump-autoload -o


# ---- Final PHP + Apache image ----
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    zip unzip git libzip-dev libpng-dev libonig-dev && \
    docker-php-ext-install pdo_mysql mbstring zip gd && \
    rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy Laravel app from composer-install stage
COPY --from=composer-install /app/back_end/ /var/www/html/

# Copy frontend build into Laravel public folder
COPY --from=frontend-build /app/front_end/dist/ /var/www/html/public/

# Ensure storage and cache directories exist and are writable
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache || true
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

# Adjust Apache document root to Laravel public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
