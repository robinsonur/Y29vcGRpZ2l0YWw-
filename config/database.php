<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'coopvirtual'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

        'coopdigital' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => 'daite.ddns.net',
            'port' => '56434',
            'database' => 'coopcanela',
            'username' => 'lortega',
            'password' => 'mira',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

        'coopmicro' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => '26.221.238.15',
            'port' => '1433',
            'database' => 'coopmicro',
            'username' => 'lortega',
            'password' => 'mira',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

        'coopemopuc' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => '26.105.213.61',
            'port' => '1433',
            'database' => 'coopmopuc',
            'username' => 'lortega',
            'password' => 'mira',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

        'coopanela' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => '26.147.215.166',
            'port' => '1433',
            'database' => 'coopcanela',
            'username' => 'lortega',
            'password' => 'mira',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

        'coopriogrande' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => '64.32.122.104',
            'port' => '51433',
            'database' => 'coopriogrande',
            'username' => 'lortega',
            'password' => 'mira',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],

    ],

];
