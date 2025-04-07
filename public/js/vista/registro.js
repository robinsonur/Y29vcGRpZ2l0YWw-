$(function() {

    // ! Declaración de variables
    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/`;
    let camposValidar, camposIncompletos, consulta;

    // * Arreglo para guardar los IDS de los campos a validar del formulario
    camposValidar = [{
        id: '#cedula',
        mascara: '000-0000000-0',
        longitudValor: 13
    }, {
        id: '#codigo',
        mascara: '000000'
    }];

    let camposMascara = new Array();

    // Ciclo para agregar las mascaras a los campos
    camposValidar.forEach(campo => {

        camposMascara.push(IMask(document.querySelector(campo.id), {
            mask: campo.mascara,
            lazy: true
        }));

    });

    $('#cedula').on('input', function() {

        camposValidar[0].longitudValor = 13;
        camposMascara[0].updateOptions({ mask: '000-0000000-0' })

        if ($('#formulario').length) {

            $('#formulario').remove()

        }

    });

    $('#codigo').on('input', function() {

        if ($('#formulario').length) {

            $('#formulario').remove()

        }

    });

    $('#cedula, #codigo').on('change', function() {

        if (camposMascara[0].unmaskedValue.length == 9) {

            camposValidar[0].longitudValor = 11;
            camposMascara[0].updateOptions({ mask: '000-00000-0' })

        }

    });

    // ? Ejecutar función cuando se intente enviar el formulario
    $("#botonVerificar").click(function() {

        // * Arreglo para guardar los IDS de los campos a validar del formulario
        camposValidar = [{
            id: '#cedula',
            mascara: '000-0000000-0',
            longitudValor: 13
        }, {
            id: '#codigo',
            mascara: '000000'
        }];

        if (camposMascara[0].unmaskedValue.length == 9) {

            camposValidar[0].mascara = '000-00000-0';
            camposValidar[0].longitudValor = 11

        }

        // ! Declaración de variables
        let campos;

        campos = obtenerDatosCampos(camposValidar);

        camposConsulta = new Array();

        // Ciclo para agregar la clase .campoIncompleto a los campos a validar
        campos.forEach((campo, iteracion) => {

            if (campo.incompleto) {

                campo.elemento.addClass('campoIncompleto')

            } else {

                campo.elemento.removeClass('campoIncompleto')

            }

        });

        camposIncompletos = $('.campoIncompleto').length;

        if (camposIncompletos && !$('#contenedorIzquierdo>.row~.row').length) {

            $('#etiquetaValidacion')
                .text('¡Tienes que ingresar los campos obligatorios!')
                .css('display', 'block')

            return

        }

        $('#etiquetaValidacion')
            .text('')
            .css('display', 'none');

        consulta =
            "EXEC [appmovil].[p_validar_valores_pantalla] " +
            "'" + campos[1].valor + "', " +
            "'VALIDAR_REGISTRO', " +
            "'', " +
            "'', " +
            "'" + campos[0].valor + "';";

        $.get(
            rutaConsulta + 'verificarRegistro?cedula=' + campos[0].valor + '&codigo=' + campos[1].valor,
            function(registrosConsulta, estadoConsulta) {

                $('#contenedorIzquierdo>.row~.row>div>div>.campoIncompleto').removeClass('campoIncompleto');

                if (registrosConsulta.existe == '1' && !registrosConsulta.login_usuario.trim()) {

                    if ($('#contenedorIzquierdo>.row~.row').length) {

                        $('#nombre').val(registrosConsulta.nombre);

                        $('#correo, #usuario, #contrasena, #confirmarContrasena').val('');

                        $('#etiquetaValidacion').css('display', 'none')

                        return

                    }

                    $('#contenedorIzquierdo>.row')
                        .css('margin', '3rem 0 2rem 0')
                        .after(
                            '<form action="#" method="GET" id="formulario" class="row">' +

                            '<div class="col-7">' +

                            '<div class="form-group position-relative has-icon-left">' +
                            '<input type="text" class="form-control form-control-xl" placeholder="Nombre" id="nombre" name="nombre" value="' + registrosConsulta.nombre + '" readonly>' +
                            '<div class="form-control-icon">' +
                            '<i class="bi bi-person-video2"></i>' +
                            '</div>' +
                            '</div>' +

                            '</div>' +

                            '<div class="col-7">' +

                            '<div class="form-group position-relative has-icon-left">' +
                            '<input type="email" class="form-control form-control-xl" placeholder="Correo" id="correo" name="correo">' +
                            '<div class="form-control-icon">' +
                            '<i class="bi bi-envelope"></i>' +
                            '</div>' +
                            '</div>' +

                            '</div>' +

                            '<div class="col-7">' +

                            '<div class="form-group position-relative has-icon-left">' +
                            '<input type="text" class="form-control form-control-xl" placeholder="Usuario" id="usuario" name="usuario" maxlength="30">' +
                            '<div class="form-control-icon">' +
                            '<i class="bi bi-person-circle"></i>' +
                            '</div>' +
                            '</div>' +

                            '</div>' +

                            '<div class="col-7">' +

                            '<div class="form-group position-relative has-icon-left">' +
                            '<input type="password" class="form-control form-control-xl" placeholder="Contraseña" id="contrasena" name="contrasena" minlength="6" maxlength="30">' +
                            '<div class="form-control-icon">' +
                            '<i class="bi bi-shield-lock"></i>' +
                            '</div>' +
                            '</div>' +

                            '</div>' +

                            '<div class="col-7">' +

                            '<div class="form-group position-relative has-icon-left">' +
                            '<input type="password" class="form-control form-control-xl" placeholder="Confirmar Contraseña" id="confirmarContrasena" name="confirmarContrasena" minlength="6" maxlength="30">' +
                            '<div class="form-control-icon">' +
                            '<i class="bi bi-shield-lock"></i>' +
                            '</div>' +
                            '</div>' +

                            '</div>' +

                            '<div class="col-7">' +

                            '<button class="btn btn-primary w-100" id="botonRegistrar">Registrar</button>' +

                            '</div>' +

                            '</form>'
                        );

                    $('#contenedorIzquierdo>.row~.row').css('margin', '2rem 0 3rem 0');
                    $('#contenedorIzquierdo>.row~.row>div').css('margin', '0.2rem 0');

                    $('.campoIncompleto')

                    $('#formulario').submit(function(evento) {

                        camposValidar = [{
                            id: '#usuario',
                            longitudValor: 6,
                            longitudMaximaValor: 50
                        }, {
                            id: '#contrasena',
                            longitudValor: 6,
                            longitudMaximaValor: 30
                        }, {
                            id: '#confirmarContrasena',
                            longitudValor: 6,
                            longitudMaximaValor: 30
                        }]

                        campos = obtenerDatosCampos(camposValidar);

                        // Ciclo para agregar la clase .campoIncompleto a los campos a validar
                        campos.forEach((campo) => {

                            if (campo.incompleto) {

                                campo.elemento.addClass('campoIncompleto')

                            } else {

                                campo.elemento.removeClass('campoIncompleto')

                            }

                        });

                        if ($('#contrasena').val() < 6) {

                            $('#etiquetaValidacion')
                                .text('¡Tienes que ingresar una contraseña con más de 5 carácteres!')
                                .css('display', 'block')

                        } else {

                            $('#contrasena').removeClass('campoIncompleto')
                            $('#etiquetaValidacion').css('display', 'none')

                        }

                        if ($('#contrasena').val() != $('#confirmarContrasena').val()) {

                            $('#confirmarContrasena').addClass('campoIncompleto')

                            $('#etiquetaValidacion')
                                .text('¡Tienes que ingresar la misma contraseña para confirmar!')
                                .css('display', 'block')

                        } else {

                            $('#confirmarContrasena').removeClass('campoIncompleto')
                            $('#etiquetaValidacion').css('display', 'none')

                        }

                        $.get(
                            rutaConsulta + 'verificarRegistro?cedula=USUARIO&codigo=' + $('#usuario').val(),
                            async function(registrosConsulta, estadoConsulta) {

                                if (registrosConsulta.existe == '0' && $('#usuario').val()) {

                                    if ($('#usuario').val().length >= 6) {

                                        $('#usuario')
                                            .removeClass('campoIncompleto')
                                            .addClass('campoValidado');

                                    } else {

                                        $('#etiquetaValidacion')
                                            .text('¡Tienes que ingresar un usuario con más de 5 carácteres!')
                                            .css('display', 'block')

                                    }

                                }

                                camposIncompletos = $('.campoIncompleto').length;

                                if (camposIncompletos) {

                                    if ($('#usuario').val().length < 5) {

                                        $('#etiquetaValidacion')
                                            .text('¡Tienes que ingresar un usuario con más de 5 carácteres!')
                                            .css('display', 'block')

                                    }

                                    evento.preventDefault();
                                    evento.stopPropagation();

                                    return

                                } else {

                                    $('#etiquetaValidacion').css('display', 'none')

                                }

                                if (!$('.campoValidado').length) {

                                    $('#usuario')
                                        .addClass('campoIncompleto');

                                    $('#etiquetaValidacion')
                                        .text('¡No puedes registrarte con un usuario existente!')
                                        .css('display', 'block')

                                    evento.preventDefault();
                                    evento.stopPropagation();

                                    return

                                }

                                consulta =
                                    rutaConsulta + 'registrarSesion?' +
                                    "codigo='" + $('#codigo').val() +
                                    "&cedula='" + $('#cedula').val() +
                                    "&usuario='" + $('#usuario').val() +
                                    "&correo='" + $('#correo').val() +
                                    "&contrasena=" + $('#contrasena').val();

                                $('#etiquetaValidacion')
                                    .text('Usuario registrado con éxito')
                                    .attr('class', 'alert alert-success')
                                    .css('display', 'block');

                                if ($('#correo').val()) {

                                    $.ajax({
                                        url: `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/correo/registro?nombreUsuario=${$('#usuario').val()}&correo=${$('#correo').val()}`
                                    })

                                }

                                window.location.href = consulta;

                                evento.preventDefault();
                                evento.stopPropagation();

                            });

                        evento.preventDefault();
                        evento.stopPropagation();

                    });

                } else {

                    $('#contenedorIzquierdo>.row~.row').remove()

                    if (registrosConsulta.login_usuario) {

                        $('#etiquetaValidacion')
                            .text('¡Usuario Registrado!')
                            .css('display', 'block')

                    } else {

                        $('#etiquetaValidacion')
                            .text('¡Cédula y/o ID de usuario inválidos!')
                            .css('display', 'block')

                    }


                }

            });

    });

    function obtenerDatosCampos(camposValidar) {

        let campos, campo;

        campos = new Array();

        camposValidar.forEach((campoValidar) => {

            campo = {
                id: campoValidar.id,
            };

            campo.elemento = $(campo.id);

            campo.valor = campo.elemento.val();

            campo.incompleto = (campo.valor) ? (campo.valor.length < campoValidar.longitudValor) : true;

            campos.push(campo)

        });

        return campos

    }

});