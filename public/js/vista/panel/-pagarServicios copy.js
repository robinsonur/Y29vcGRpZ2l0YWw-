$(function() {

    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var
        datosCuentaOrigen,

        cuentaOrigen = {
            cuenta: '',
            tipo: '',
            balance: ''
        },

        cuentaDestino = {
            cuenta: '',
            tipo: '',
            balance: ''
        },

        consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script de los filtros
    // * Datos cuenta origen
    consulta = "EXEC [appmovil].[p_traer_cuentas] '{idUsuario}', 'CUENTA_ORIGEN';";

    $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',
        success: function(datos) {

            datos.forEach(dato => {

                $('#cuentaOrigen').last().append('<option value="' + dato['cuenta'] + '">' + dato['cuentas'] + '</option>');

            });

            datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

            cuentaOrigen.cuenta = datosCuentaOrigen[0];
            cuentaOrigen.tipo = datosCuentaOrigen[1];
            cuentaOrigen.balance = parseFloat(datosCuentaOrigen[2].replaceAll('RD$', ''));

            cambiarTamanoCampos();

            // * Datos cuenta destino
            consulta =
                "EXEC [appmovil].[p_traer_cuentas] " +
                "'{idUsuario}', " +
                "'CUENTA_DESTINO', " +
                "'', " +
                "'', " +
                "'" + cuentaOrigen.cuenta + "';";

            $.ajax({
                url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
                type: 'GET',
                dataType: 'JSON',
                success: function(datos) {

                    datos.forEach(dato => {

                        $('#cuentaDestino').last().append('<option value="' + dato['cuenta'] + '">' + dato['cuentas'] + '</option>');

                    });

                }
            });

            var mascaraMontoTransferir = IMask(document.querySelector('#montoTransferir'), {
                mask: Number,
                signed: false,
                thousandsSeparator: ',',
                radix: '.',
                scale: 2,
                min: 0,
                max: cuentaOrigen.balance
            });

            $('#cuentaOrigen').change(function() {

                datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

                cuentaOrigen.cuenta = datosCuentaOrigen[0];

                // * Datos cuenta destino
                consulta =
                    "EXEC [appmovil].[p_traer_cuentas] " +
                    "'{idUsuario}', " +
                    "'CUENTA_DESTINO', " +
                    "'', " +
                    "'', " +
                    "'" + cuentaOrigen.cuenta + "';";

                $.ajax({
                    url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
                    type: 'GET',
                    dataType: 'JSON',
                    success: function(datos) {

                        $('#cuentaDestino').find('option').remove().end();

                        datos.forEach(dato => {

                            $('#cuentaDestino').last().append('<option value="' + dato['cuenta'] + '">' + dato['cuentas'] + '</option>');

                        });

                    }
                });

                mascaraMontoTransferir.updateOptions({
                    max: cuentaOrigen.balance
                });

            });

            $('#botonEnviar').click(function() {

                $('#montoTransferir, #concepto').removeClass('campoIncompleto');

                $('#etiquetaValidacionMontoTransferir, #etiquetaValidacionConcepto').empty();

                let campoMontoTransferirVacio = (!$('#montoTransferir').val());
                let campoConceptoVacio = (!$('#concepto').val().trim());

                if (campoMontoTransferirVacio && campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar un montoTransferir y contraseña!');

                    $('#montoTransferir, #concepto').addClass('campoIncompleto');

                    $('#etiquetaValidacionmontoTransferir, #etiquetaValidacionconcepto').append('*');

                } else if (campoMontoTransferirVacio && !campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar un montoTransferir!');

                    $('#montoTransferir').addClass('campoIncompleto');

                    $('#etiquetaValidacionmontoTransferir').append('*')

                } else if (!campoMontoTransferirVacio && campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar una contraseña!');

                    $('#concepto').addClass('campoIncompleto');

                    $('#etiquetaValidacionconcepto').append('*')

                } else {

                    let datosCuentaDestino = $('#cuentaDestino > option:selected').text().split(' - ');

                    cuentaDestino.cuenta = datosCuentaDestino[0];
                    cuentaDestino.tipo = datosCuentaDestino[1];
                    cuentaDestino.balance = parseFloat(datosCuentaDestino[2].replaceAll('RD$', ''));

                    let montoTransferir = $('#montoTransferir').val().replaceAll(',', '');
                    let concepto = $('#concepto').val();

                    let alertaDosBotones = Swal.mixin({

                        customClass: {

                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger'

                        },
                        buttonsStyling: false

                    })

                    alertaDosBotones.fire({

                        title: '¿Realizar Transferencia?',
                        html: '<hr></hr>' +
                            'Cuenta Origen: ' + cuentaOrigen.cuenta + ' - ' + cuentaOrigen.tipo + '<br />' +
                            '<hr></hr>' +
                            'Cuenta Destino: ' + cuentaDestino.cuenta + ' - ' + cuentaDestino.tipo + '<br />' +
                            '<hr></hr>' +
                            'Monto Transferir: RD$' + montoTransferir + '<br />' +
                            'Concepto: ' + concepto,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Proceder',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true

                    }).then((result) => {

                        let mensajeResultado = Swal.mixin({

                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }

                        })

                        if (result.isConfirmed) {

                            consulta =
                                "EXEC [dbo].[p_guarda_transferencia_entre_cuentas] " +
                                "'" + cuentaOrigen.cuenta + "', " +
                                "'" + cuentaDestino.cuenta + "', " +
                                "''," +
                                "'" + concepto + "'," +
                                "'AHORROS_APORTES'," +
                                "'01'," +
                                "'001'," +
                                montoTransferir;

                            $.ajax({

                                type: 'GET',
                                url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta='

                            });

                            alertaDosBotones.fire({

                                html: '<div class="card">' +
                                    '<div class="card-header text-center">' +
                                    '<h4>Comprobante</h4>' +
                                    '<h5>Nombre: <span style="color: #607080">' + $('#nombreUsuario').text().trim() + '</span></h5>' +
                                    '<h5>Fecha: <span style="color: #607080">' + moment().format('DD/MM/YYYY') + '</span> </h5>' +
                                    '</div>' +
                                    '<hr class="card-body">' +
                                    '<div class="table-responsive">' +
                                    '<h4 class="text-center">Cuenta Origen</h4>' +
                                    '</div>' +
                                    '<div class="table-responsive">' +
                                    '<table class="table table-hover table-lg">' +
                                    '<thead>' +
                                    '<tr>' +
                                    '<th>Cuenta</th>' +
                                    '<th>Descripción</th>' +
                                    '<th>Monto</th>' +
                                    '</tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                    '<tr>' +
                                    '<td class="col-2">' +
                                    '<div class="d-flex align-items-center">' +
                                    '<p class="font-bold ms-3 mb-0">' + cuentaOrigen.cuenta + '</p>' +
                                    '</div>' +
                                    '</td>' +
                                    '<td class="col-4">' +
                                    '<p class=" mb-0">' + cuentaOrigen.tipo + '</p>' +
                                    '</td>' +
                                    '<td class="col-3">' +
                                    '<p class=" mb-0">RD$' + montoTransferir + '</p>' +
                                    '</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</div>' +
                                    '<hr></hr>' +
                                    '<div class="table-responsive">' +
                                    '<h4 class="text-center">Cuenta Destino</h4>' +
                                    '</div>' +
                                    '<div class="table-responsive">' +
                                    '<table class="table table-hover table-lg">' +
                                    '<thead>' +
                                    '<tr>' +
                                    '<th>Cuenta</th>' +
                                    '<th>Descripción</th>' +
                                    '<th>Monto</th>' +
                                    '</tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                    '<tr>' +
                                    '<td class="col-2">' +
                                    '<div class="d-flex align-items-center">' +
                                    '<p class="font-bold ms-3 mb-0">' + cuentaDestino.cuenta + '</p>' +
                                    '</div>' +
                                    '</td>' +
                                    '<td class="col-4">' +
                                    '<p class=" mb-0">' + cuentaDestino.tipo + '</p>' +
                                    '</td>' +
                                    '<td class="col-3">' +
                                    '<p class=" mb-0">RD$' + montoTransferir + '</p>' +
                                    '</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>',
                                showCancelButton: false,
                                confirmButtonText: 'Imprimir'

                            }).then(async(result) => {

                                if (result.isConfirmed) {

                                    $('.swal2-html-container > .card').print({

                                        iframe: false

                                    });

                                    await new Promise(resolve => setTimeout(resolve, 1000));

                                    location.reload()

                                } else {

                                    await new Promise(resolve => setTimeout(resolve, 1000));

                                    location.reload()

                                }

                            });

                        } else if (result.dismiss === Swal.DismissReason.cancel) {

                            mensajeResultado.fire({
                                icon: 'error',
                                title: '¡Transferencia cancelada!'
                            })

                        }

                    })

                }

            });

        }
    });

    // Evento para cuando se re ajuste el tamaño de pantalla
    $(window).on('resize', function() {

        cambiarTamanoCampos();

    });

    function cambiarTamanoCampos() {

        if (window.innerWidth > 575) {

            $('.columnaCampo, #cuentaDestino, #montoTransferir, #concepto, #botonEnviar')
                .css('width', 100 * parseInt($('#cuentaOrigen').css('width')) / window.innerWidth + 'vw');

        }

    }

    $('#concepto').on('keydown focusout', function() {

        $(this).val($(this).val().toUpperCase())

    });

    $('print-preview-app').keydown(function(evento) {

        if (evento.keyCode == '27') {

            location.reload()

        }

    });

})