<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

// ! Configuración
use Illuminate\Support\Facades\Config;

// ! Base de datos
use Illuminate\Support\Facades\DB;

class HandleConnections {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next) {

        // ! Asignando la conexión hacia la base de datos
        $connection = $request->get('connection') ?? 'coopdigital';
        Config::set("database.default", $connection);

        // ! Reestableciendo la configuración
        // ! de la base de datos
        DB::purge();

        return $next($request);

    }
}
