$(function() {

    // ! Declaración de variables
    const rutaConsultaRecuperarContrasena = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/recuperarContrasena`;
    let consulta, camposValidar, camposVacios;

    // * Arreglo para guardar los IDS de los campos a validar del formulario
    camposValidar = [
        "#correo",
        "#cedula"
    ];

    // ? Agregando el formato de cédula al campo {'#cedula'}
    IMask(document.querySelector("#cedula"), {
        mask: "000-0000000-0",
        lazy: true
    });

    // ? Ejecutar función cuando se intente enviar el formulario
    $("#formulario").submit(function(evento) {

        // ! Declaración de variables
        let campo;

        campo = {
            correo: $('#correo').val(),
            cedula: $('#cedula').val()
        }

        campos = obtenerDatosCampos(camposValidar);

        // Ciclo para agregar la clase .campoIncompleto a los campos a validar
        campos.forEach(campo => {

            if (campo.vacio) {

                campo.elemento.addClass('campoIncompleto')

            } else {

                campo.elemento.removeClass('campoIncompleto')

            }

        });

        camposVacios = $('.campoIncompleto').length;

        if (camposVacios) {

            $('#etiquetaValidacion')
                .text('¡Tienes que ingresar los campos obligatorios!')
                .css('display', 'block')

            evento.preventDefault();
            evento.stopPropagation();

            return

        }

        $('#etiquetaValidacion')
            .text('')
            .css('display', 'none');

        $.ajax({

            url: rutaConsultaRecuperarContrasena + '?correo=' + campo.correo + '&cedula=' + campo.cedula,
            type: 'POST',
            data: $(this).serialize(),

            success: async function(registros) {

                if (registros.length) {

                    $('#etiquetaValidacion')
                        .text('Correo de Recuperación de Usuario enviado con éxito')
                        .attr('class', 'alert alert-success')
                        .css('display', 'block');

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    window.location.href =
                        location.origin + '/' + location.pathname.split('/')[1] + '/correo/recuperarContrasena?' +
                        'correo=' + campo.correo +
                        '&usuario=' + registros[0].login_usuario +
                        '&contrasena=' + registros[0].clave;

                } else {

                    $('#etiquetaValidacion')
                        .text('¡Correo electrónico y/o cédula inválidos!')
                        .css('display', 'block')

                    return

                }

                $('#etiquetaValidacion')
                    .text('')
                    .css('display', 'none')

            }

        });

        evento.preventDefault();
        evento.stopPropagation();

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

});