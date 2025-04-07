# Etapa 1: Construcción de dependencias con Composer
FROM composer:2.6 AS composer

WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY composer.json composer.lock ./

# Instalar dependencias de Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Etapa 2: Configuración del servidor web con PHP y Nginx
FROM php:8.1-fpm

# Instalar extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Node.js y npm para compilar assets
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos de la aplicación
COPY . .

# Copiar las dependencias instaladas por Composer
COPY --from=composer /app/vendor ./vendor

# Configurar permisos para Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer el puerto 9000 para PHP-FPM
EXPOSE 9000

# Comando por defecto para iniciar PHP-FPM
CMD ["php-fpm"]
