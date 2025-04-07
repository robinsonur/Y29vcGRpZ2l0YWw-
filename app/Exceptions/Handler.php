<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            Log::info("Ha ocurrido una excepción (reportable): ". now(tz:'America/Caracas'));
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                $code = $e->getCode();
                Log::info($code);
                if($code == 500 || $code == 'IMSSP') {
                    return response()->json([
                        'title' => 'Algo ha salido mal',
                        'message' => 'Ha ocurrido una excepción inesperada, intente de nuevo más tarde',
                    ], 500);
                }

                // Manejando una excepción de la base de datos
                if ($e instanceof \Illuminate\Database\QueryException && strpos($e->getMessage(), 'SQLSTATE[08001]') !== false) {
                    return response()->json([
                        'title' => 'Algo ha salido mal',
                        'message' => 'Ha ocurrido una excepción inesperada, intente de nuevo más tarde',
                    ], 500);
                }
                
            }

        });
    }
}
