$(function() {

    formatearCampoTextoTelefono('#telefono');
    formatearCampoTextoTelefono('#celular');

    // ! Declaración de variables
    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var usuario, consulta, camposVacios, peticion = null, codi = null;

    consulta = "EXEC [appmovil].[p_traer_cuentas] '{idUsuario}', 'DATOS_CLIENTE';";

    $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',

        success: function(registros) {

            usuario = {
                id: $('#idUsuario').text().trim(),
                nombre: $('#nombreUsuario').text().trim()
            }

            registros.forEach(registro => {

                $('#codigo').val(usuario.id).text(usuario.id);
                $('#cedula').val(registro['cedula'].trim()).text(registro['cedula'].trim());
                $('#cliente').val(usuario.nombre).text(usuario.nombre);
                $('#direccion').val(registro['direccion'].trim()).text(registro['direccion'].trim());
                $('#telefono').val(registro['telefono'].trim()).text(registro['telefono'].trim());
                $('#celular').val(registro['celular'].trim()).text(registro['celular'].trim());
                $('#correo').val(registro['correo'].trim()).text(registro['correo'].trim());
                $('#nacimiento').val(registro['fechanacimiento'].trim()).text(registro['fechanacimiento'].trim());
                notificacionInicioSesion.checked = parseInt(registro.enviar_notificacion_login);

            });

        }

    });

    $('#botonActualizarDatos').click(function() {

        consulta =
            `EXEC [AppMovil].[p_actualiza_perfil]
            '{idUsuario}',
            '${direccion.value}',
            '${telefono.value}',
            '${celular.value}',
            '${correo.value}',
            '',
            ${notificacionInicioSesion.checked ? 1 : 0};`;

        peticion && peticion.abort();

        peticion = $.get(`${rutaConsultaTablaRegistros}?consulta=${consulta}&tipoConsulta=unprepared`, function() {

            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            }).fire({
                icon: 'success',
                title: '¡Datos Actualizados!'
            })

        });

    });

    // * Arreglo para guardar los IDS de los campos a validar del formulario
    camposValidar = [
        "#contrasena",
        "#confirmarContrasena"
    ];

    // ? Ejecutar función cuando se intente presionar el botón {#botonActualizarContrasena}
    $("#botonActualizarContrasena").click(function() {

        // ! Declaración de variables
        let campos, contrasena, valorCampoAnterior;

        contrasena = $('#contrasena').val();

        campos = obtenerDatosCampos(camposValidar);

        // Ciclo para agregar la clase .campoIncompleto a los campos a validar
        campos.forEach(campo => {

            if (campo.vacio) {

                campo.elemento.addClass('campoIncompleto')

            } else {

                campo.elemento.removeClass('campoIncompleto')

            }

            if (valorCampoAnterior != null) {

                if (valorCampoAnterior != campo.valor) {

                    campo.elemento.addClass('campoIncompleto')

                }

            }

            valorCampoAnterior = campo.valor;

        });

        camposVacios = $('.campoIncompleto').length;

        if (camposVacios) {

            return

        }

        consulta = "EXEC [appmovil].[p_actualiza_clave]  '{idUsuario}', '" + contrasena + "'";

        $.get(`${rutaConsultaTablaRegistros}?consulta=${consulta}`, function() {

            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            }).fire({
                icon: 'success',
                title: '¡Contraseña Actualizada!'
            })

        });

    });

    // ?
    $('.nav-item #tarjeta-pestana').click(function() {

        peticion && peticion.abort()

        peticion = $.get(`
            ${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta?
            _token=${$('[name="_token"]').val()}&
            consulta=
                SET NOCOUNT ON;
                EXEC [appmovil].[p_traer_tarjetas]
                '{idUsuario}',
                'TARJETA',
                '',
                '${datosUsuario.cedula}'
            &
            tipoConsulta=select`,
            (registros) => {

                if (!registros.length) {

                    $('#registroTarjeta').removeClass('d-none');
                    $('#visualizacionTarjeta').remove()


                } else {

                    codi = registros;

                    $('#registroTarjeta').remove();
                    $('#visualizacionTarjeta').removeClass('d-none')

                }

            }

        )

    });

    // ?
    $('.nav-item :not(#tarjeta-pestana)').click(function() {

        if ($('.contenedorCodigosVerificacion .row div').length) {

            $('.contenedorCodigosVerificacion .row div a').text('******');
            $('#botonVisualizarTarjeta').removeClass('d-none')

        }

    });

    // ?
    $('#botonGenerarTarjetas').click(function() {

        $('#cedulaTarjeta, #pinTarjeta, #confirmarPinTarjeta')
            .removeClass('is-invalid')
        ;

        if ($('#pinTarjeta').val().length < 4) {

            $('#pinTarjeta').addClass('is-invalid').focus();

            Swal.mixin({

                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }

            }).fire({
                icon: 'error',
                title: '¡Tienes que ingresar un PIN mayor o igual a 4 digitos!'
            });

            return

        } else if (
            $('#pinTarjeta').val() != $('#confirmarPinTarjeta').val()
        ) {

            $('#confirmarPinTarjeta').addClass('is-invalid').focus();

            Swal.mixin({

                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }

            }).fire({
                icon: 'error',
                title: '¡La confirmación del PIN no es válida!'
            });

            return

        }

        $('#puk').val($('#pinTarjeta').val());

        $.get(`${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`, {
            _token: $('[name="_token"]').val(),
            consulta: `
                SET NOCOUNT ON;
                EXEC [AppMovil].[p_registrar_tarjetas]
                '{idUsuario}',
                '',
                '',
                '',
                '${datosUsuario.cedula}',
                ${$('#pinTarjeta').val() * 1}
            `
        });

        $('#tarjeta-pestana').click()

    });

    // ?
    $('#botonVisualizarTarjeta').click(function() {

        let valido = false;

        Swal.fire({
            title: 'Confirmar PIN',
            input: 'password',
            inputAttributes: {
                placeholder: 'Confirmar PIN'
            },
            showCloseButton: true,
            confirmButtonText: 'Confirmar',
            customClass: {
                title: 'text-start text-white bg-primary cabezaModal',
                actions: 'w-240px mt-0',
                confirmButton: 'w-100 bg-primary codigoPin'
            },
            didRender: (sw) => {

            $('input', sw).on('input', function() {

                this.value = this.value.replace(/[^0-9]/g, '')

            });

            },
            preConfirm: (codigoPin) => {
            
                let validado = false;
            
                if (
                $('#puk').val() === codigoPin
                ) validado = true;
                else
                Swal.showValidationMessage(
                `PIN Invalido`
                )
            },
            allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
            if (result.isConfirmed) {

                codi.forEach(function(registro, iteracion) {

                    $('.contenedorCodigosVerificacion .row div a')
                        .eq(iteracion)
                        .text(registro.codigo)
                    ;
            
                });

                $('#botonVisualizarTarjeta').addClass('d-none')

            }
            })

    });

    function obtenerDatosCampos(camposValidar) {

        let campos, campo;

        campos = new Array();

        camposValidar.forEach((campoValidar) => {

            campo = {
                id: campoValidar,
            };

            campo.elemento = $(campo.id);

            campo.valor = campo.elemento.val();

            campo.vacio = !campo.valor;

            campos.push(campo)

        });

        return campos

    }

    function formatearCampoTextoTelefono(campoFormatear) {

        IMask(
            document.querySelector(campoFormatear), {
                mask: '800-000-0000'
            });

    }
});