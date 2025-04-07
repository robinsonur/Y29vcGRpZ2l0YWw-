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

    $('#tarjetasVerificacion').click(function() {

        let codi = null;

        $.get(`
            ${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta?
            _token=${$('[name="_token"]').val()}&
            consulta=
                SET NOCOUNT ON;
                EXEC [appmovil].[p_traer_tarjetas]
                '{idUsuario}',
                'TARJETA',
                '',
                '${datosUsuario.cedula}';
            &
            tipoConsulta=select`,
            (registros) => {

                if (!registros.length) {

                    Swal.fire({
                        title: 'Generar Tarjeta',
                        showCloseButton: true,
                        confirmButtonText: 'Generar',
                        html: `
            
                            <div class="row w-100 justify-content-center m-0 text-start pt-3">
            
                                <div class="col-auto">
                                    <div class="form-group has-icon-left">
                                        <div class="position-relative">
                                            <input
                                                type="text"
                                                class="form-control my-0"
                                                placeholder="000-0000000-0"
                                                id="cedulaTarjeta"
                                                value="${datosUsuario.cedula}"
                                                style="width: 240px"
                                                disabled
                                            >
                                            <div class="form-control-icon">
                                                <i class="bi bi-person"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
                                <div class="col-auto">
                                    <div class="form-group has-icon-left">
                                        <div class="position-relative">
                                            <input
                                                type="text"
                                                inputmode="numeric"
                                                class="form-control my-0 soloNumero"
                                                placeholder="PIN"
                                                id="pinTarjeta"
                                                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                                                style="width: 240px"
                                            >
                                            <div class="form-control-icon">
                                                <i class="bi bi-lock-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
                                <div class="col-auto">
                                    <div class="form-group has-icon-left">
                                        <div class="position-relative">
                                            <input
                                                type="text"
                                                inputmode="numeric"
                                                class="form-control my-0 soloNumero"
                                                placeholder="Confirmar PIN"
                                                id="confirmarPinTarjeta"
                                                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                                                style="width: 240px"
                                            >
                                            <div class="form-control-icon">
                                                <i class="bi bi-lock-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
                            </div>
            
                        `,
                        customClass: {
                            title: 'text-start text-white bg-primary cabezaModal',
                            actions: 'w-240px mt-0',
                            confirmButton: 'w-100 bg-primary'
                        },
                        preConfirm: () => {

                            $('#cedulaTarjeta, #pinTarjeta, #confirmarPinTarjeta')
                                .removeClass('is-invalid')
                            ;

                            if (
                                $('#pinTarjeta').val().length < 4
                            ) {

                                $('#pinTarjeta').addClass('is-invalid').focus();

                                Swal.showValidationMessage('¡Tienes que ingresar un PIN mayor o igual a 4 digitos!')

                                return

                            } else if (
                                $('#pinTarjeta').val() != $('#confirmarPinTarjeta').val()
                            ) {

                                $('#confirmarPinTarjeta').addClass('is-invalid').focus();

                                Swal.showValidationMessage('¡La confirmación del PIN no es válida!')

                                return

                            }

                            $('#puk').val($('#pinTarjeta').val())

                            return $.get(`${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`, {

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

                            }).fail(function() {

                                Swal.showValidationMessage('¡Ha ocurrido un error al intentar generar las tarjetas!')

                            })

                        },
                        allowOutsideClick: () => !Swal.isLoading()
                        }).then((resultado) => {

                            resultado.isConfirmed &&
                            $(this).trigger('click')

                        })

                } else {

                    Swal.fire({
                        title: 'Tarjeta de Códigos',
                        showCloseButton: true,
                        confirmButtonText: 'Visualizar Códigos',
                        html: `
                        <textarea id="portapapeles" hidden></textarea>
                            <div class="row w-100 justify-content-center m-0 text-start py-3">

                                <div class="accordion">
                                    <div class="accordion" id="acordeon1">
                                        <div class="accordion-item">
                                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#acordeon1" style="">
                                                <div class="accordion-body">
                                                    <div class="row text-center contenedorCodigosVerificacion">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
            
                        `,
                        customClass: {
                            title: 'text-start text-white bg-primary cabezaModal',
                            actions: 'w-240px mt-0',
                            confirmButton: 'w-100 bg-primary'
                        },
                        didRender: () => {

                            let columnaCodigosVerificacion = $('<div>').addClass('col-6');

                            codi = registros;

                            registros.forEach(function(registro) {

                                columnaCodigosVerificacion
                                    .clone()
                                    .append(`${registro.numero}. <a>${registro.codigo.replaceAll(/\d/g, '*')}</a>`)
                                    .appendTo('.contenedorCodigosVerificacion')
                                ;

                            })

                        },
                        preConfirm: () => {
                            
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
                                    Swal.fire({
                                        title: 'Tarjeta de Códigos',
                                        showCancelButton: true,
                                        showConfirmButton: false,
                                        cancelButtonText: 'Cerrar',
                                        html: `
                                        <textarea id="portapapeles" hidden></textarea>
                                            <div class="row w-100 justify-content-center m-0 text-start py-3">
                                      
                                                <div class="accordion">
                                                    <div class="accordion" id="acordeon1">
                                                        <div class="accordion-item">
                                                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#acordeon1" style="">
                                                                <div class="accordion-body">
                                                                    <div class="row text-center contenedorCodigosVerificacion">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                      
                                            </div>
                                      
                                        `,
                                        customClass: {
                                            title: 'text-start text-white bg-primary cabezaModal',
                                            actions: 'w-240px mt-0',
                                            cancelButton: 'w-100'
                                        },
                                        didRender: () => {
                                      
                                            let columnaCodigosVerificacion = $('<div>').addClass('col-6');
                                      
                                            codi.forEach(function(registro) {
                                      
                                                columnaCodigosVerificacion
                                                    .clone()
                                                    .append(`${registro.numero}. <a href="#" class="badge codigoVerificacion" onclick="$('#codigoVerificacion').val(this.text) && $('.swal2-cancel').click()">${registro.codigo}</a>`)
                                                    .appendTo('.contenedorCodigosVerificacion')
                                                ;
                                      
                                            })
                                      
                                        },
                                        preConfirm: () => {}
                                        }).then((resultado) => {
                                      
                                            // resultado.isConfirmed &&
                                            // $(this).trigger('click')
                                      
                                        })
                                }
                              })


                        },
                        allowOutsideClick: () => !Swal.isLoading()
                        }).then((resultado) => {

                            // resultado.isConfirmed &&
                            // $(this).trigger('click')

                        })


                }

            })

    });

    $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',
        success: function(datos) {

            datos.forEach(dato => {

                $('#cuentaOrigen').last().append('<option value="' + dato['cuenta'] + ' - ' + dato.clasificacion + '">' + dato['cuentas'] + '</option>');

            });

            datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

            cuentaOrigen.cuenta = datosCuentaOrigen[0];
            cuentaOrigen.tipo = $('#cuentaOrigen').val().split(' - ')[1];
            cuentaOrigen.balance = ($('#cuentaOrigen').val() != null) ? parseFloat(datosCuentaOrigen[2].replaceAll('RD$', '').replaceAll(',', '')) : null;

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

                        $('#cuentaDestino').last().append('<option value="' + dato['cuenta'] + ' - ' + dato.clasificacion + '">' + dato['cuentas'] + '</option>');

                    });

                }
            }).then(function() {

                if ($('#cuentaDestino > option').length == 1) {

                    $('#formulario > :nth-child(3)').after(
                        '<div class="row">' +
                        '<label for="cuentaBeneficiario" class="columnaTexto col-form-label">No. Cuenta</label>' +
                        '<div class="columnaCampo" style="width: 24.0476vw;">' +
                        '<input type="text" class="form-control" id="cuentaBeneficiario" name="cuentaBeneficiario" placeholder=""></input>' +
                        '</div>' +
                        '</div>'
                    );

                    IMask(document.querySelector('#cuentaBeneficiario'), {
                        mask: '00000000000000000000',
                        lazy: true
                    });

                    $('#formulario > :nth-child(4)').after(
                        '<div class="row">' +
                        '<label for="cedulaBeneficiario" class="columnaTexto col-form-label">Cédula</label>' +
                        '<div class="columnaCampo" style="width: 24.0476vw;">' +
                        '<input type="text" class="form-control" id="cedulaBeneficiario" name="cedulaBeneficiario" placeholder="000-0000000-0"></input>' +
                        '</div>' +
                        '</div>'
                    );

                    IMask(document.querySelector('#cedulaBeneficiario'), {
                        mask: '000-0000000-0',
                        lazy: true
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

                if ($('.row').length > 8) {

                    $('#formulario #cedulaBeneficiario').closest('.row').remove();
                    $('#formulario #nombreBeneficiario').closest('.row').remove();
                    $('#formulario #cuentaBeneficiario').closest('.row').remove();

                }

                datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

                cuentaOrigen.cuenta = datosCuentaOrigen[0];
                cuentaOrigen.tipo = $('#cuentaOrigen').val().split(' - ')[1];
                cuentaOrigen.balance = parseFloat(datosCuentaOrigen[2].replaceAll('RD$', '').replaceAll(',', ''));

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

                            $('#cuentaDestino').last().append('<option value="' + dato['cuenta'] + ' - ' + dato.clasificacion + '">' + dato['cuentas'] + '</option>');

                        });

                    }
                });

                mascaraMontoTransferir.updateOptions({
                    max: cuentaOrigen.balance
                });

            });

            $('#cuentaDestino').change(function() {

                var tiempoEspera = null;

                if ($(this).val() == 'BENEFICIARIO - TERCERO') {

                    $('#formulario > :nth-child(3)').after(`
                        <div class="row">
                        <label for="cedulaBeneficiario" class="columnaTexto col-form-label">Cédula / RNC</label>
                        <div class="columnaCampo" style="width: 24.0476vw;">
                        <input type="text" class="form-control" id="cedulaBeneficiario" name="cedulaBeneficiario"></input>
                        </div>
                        </div>
                    `);

                    IMask(document.querySelector('#cedulaBeneficiario'), {
                        mask: '00000000000',
                        lazy: true
                    });

                    $('#cedulaBeneficiario').off().on('input', function() {

                        let cedulaBeneficiario = this.value;

                        if ($('#nombreBeneficiario').length) {

                            $('#nombreBeneficiario').val('');

                            $('#cuentaBeneficiario').find('option').remove().end();

                        }

                        clearTimeout(tiempoEspera);

                        tiempoEspera = setTimeout(function() {

                            if (cedulaBeneficiario.length == 9 || cedulaBeneficiario.length == 11) {

                                consulta = `EXEC [AppMovil].[p_traer_cuentas] '','CUENTAS_TERCERO','','','${cedulaBeneficiario}'`;

                                $.ajax({
                                    url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
                                    type: 'GET',
                                    dataType: 'JSON',
                                    success: function(registros) {

                                        if (registros.length) {

                                            $('#nombreBeneficiario').val(registros[0].nombre_tercero);

                                            registros.forEach(registro => {

                                                $('#cuentaBeneficiario').last().append('<option value="' + registro.cuenta + ' - ' + registro.clasificacion + '">' + registro.cuentas.split(' - ')[0] + ' - ' + registro.cuentas.split(' - ')[1] + '</option>');

                                            });

                                        }

                                    }
                                });

                            }

                        }, 500)

                    });

                    $('#formulario > :nth-child(4)').after(`
                        <div class="row">
                        <label for="nombreBeneficiario" class="columnaTexto col-form-label">Beneficiario</label>
                        <div class="columnaCampo" style="width: ${$('#cuentaDestino').css('width')};">
                        <input type="text" class="form-control" id="nombreBeneficiario" name="nombreBeneficiario" value="" style="width: ${$('#cuentaDestino').css('width')};" disabled></input>
                        </div>
                        </div>
                    `);

                    $('#formulario > :nth-child(5)').after(`
                        <div class="row">
                        <label for="cuentaBeneficiario" class="columnaTexto col-form-label">No. Cuenta</label>
                        <div class="columnaCampo" style="width: ${$('#cuentaDestino').css('width')};">
                        <select class="form-select" id="cuentaBeneficiario" name="cuentaBeneficiario" style="width: ${$('#cuentaDestino').css('width')}">
                        </select>
                        </div>
                        </div>
                    `);

                } else {

                    if ($('.row').length > 8) {

                        $('#formulario #cedulaBeneficiario').closest('.row').remove();
                        $('#formulario #nombreBeneficiario').closest('.row').remove();
                        $('#formulario #cuentaBeneficiario').closest('.row').remove();

                    }

                }

            });

            $('#botonEnviar').click(async function() {

                let camposValidar, camposFormularioVacio;

                camposValidar = [
                    '#cuentaOrigen',
                    '#cuentaDestino',
                    '#cuentaBeneficiario',
                    '#cedulaBeneficiario',
                    '#correo',
                    '#montoTransferir',
                    '#concepto'
                ];

                camposValidar.forEach(campoValidar => {

                    let campoValidarVacio = $(campoValidar).length ? (!$(campoValidar).val()) : false;

                    if (campoValidarVacio) {

                        $(campoValidar).addClass('campoIncompleto')

                    } else {

                        $(campoValidar).removeClass('campoIncompleto')

                    }

                    camposFormularioVacio = campoValidarVacio;

                });

                let campoCodigoVerificacionInvalido = false;

                campoCodigoVerificacionInvalido = !codigoVerificacion.value.length;

                $(codigoVerificacion).removeClass('campoIncompleto');

                if (camposFormularioVacio || codigoVerificacion.value != tiempoTranscurrido.value) {

                    codigoVerificacion.value != tiempoTranscurrido.value &&
                    $(codigoVerificacion).addClass('campoIncompleto') &&
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
                        title: '¡El código de verificación no coincide con el código (1)!'
                    })

                    return

                }

                let datosCuentaDestino = $('#cuentaDestino > option:selected').text().split(' - ');

                cuentaDestino.cuenta = datosCuentaDestino[0];
                cuentaDestino.tipo = $('#cuentaDestino').val().split(' - ')[1];
                cuentaDestino.balance = ($('#cuentaDestino').val() == 'BENEFICIARIO - TERCERO') ?
                    '' :
                    parseFloat(datosCuentaDestino[2].replaceAll('RD$', '').replaceAll(',', ''));

                // if ($('#cuentaDestino').val() == 'BENEFICIARIO - TERCERO') {

                //     if ($('#cuentaBeneficiario') != '1') {

                //         $('#cuentaBeneficiario, #cedulaBeneficiario').removeClass('campoValidado');

                //         Swal.mixin({

                //             toast: true,
                //             position: 'top-end',
                //             showConfirmButton: false,
                //             timer: 3000,
                //             timerProgressBar: true,
                //             didOpen: (toast) => {
                //                 toast.addEventListener('mouseenter', Swal.stopTimer)
                //                 toast.addEventListener('mouseleave', Swal.resumeTimer)
                //             }

                //         }).fire({
                //             icon: 'error',
                //             title: '¡No. Cuenta o Cédula inválidas!'
                //         })

                //     } else {

                //         $('#cuentaBeneficiario, #cedulaBeneficiario').addClass('campoValidado');

                //     }

                // }

                // if (!$('.campoValidado').length && $('#cuentaBeneficiario').length) {

                //     return

                // }

                let montoTransferir = $('#montoTransferir').val().replaceAll(',', '');
                let concepto = $('#concepto').val();

                consulta = "EXEC [appmovil].[p_validar_valores_pantalla] '', 'BALANCE_CUENTA', '" + cuentaOrigen.cuenta + "'";

                $.ajax({
                    url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
                    type: 'GET',
                    dataType: 'JSON',
                    success: function(registros) {

                        let balanceCuentaOrigenSeleccionada;

                        balanceCuentaOrigenSeleccionada = parseFloat(datosCuentaOrigen[2].replaceAll('RD$', '').replaceAll(',', ''));

                        cuentaOrigen.balance = registros[0].balance;

                        if (balanceCuentaOrigenSeleccionada != parseFloat(cuentaOrigen.balance)) {

                            $('#cuentaOrigen > option:selected')
                                .text(
                                    cuentaOrigen.cuenta + ' - ' +
                                    cuentaOrigen.tipo + ' - ' +
                                    'RD$' + cuentaOrigen.balance
                                )

                        }

                        mascaraMontoTransferir.updateOptions({
                            max: cuentaOrigen.balance
                        });

                        if ($('#montoTransferir').val() == '') {

                            return;

                        }

                        $('#montoTransferir').val('');

                        if (parseFloat(cuentaOrigen.balance) < parseFloat(montoTransferir)) {

                            return

                        }

                        enviarTransferencia(montoTransferir, concepto);

                    }
                });

            });

        }
    });

    // Evento para cuando se re ajuste el tamaño de pantalla
    $(window).on('resize', function() {

        cambiarTamanoCampos();

    });

    async function cambiarTamanoCampos() {

        if (window.innerWidth > 575) {

            $('.columnaCampo, #cuentaDestino, #correo, #concepto, #botonEnviar')
                .css('width', 100 * parseInt($('#cuentaOrigen').css('width')) / window.innerWidth + 'vw');

            if ($('#cuentaOrigen').val() == null) {

                $('#cuentaDestino').css('width', 'auto');

                await new Promise(resolve => setTimeout(resolve, 1000));

                $('.columnaCampo, #cuentaOrigen, #correo, #concepto, #botonEnviar')
                    .css('width', 100 * parseInt($('#cuentaDestino').css('width')) / window.innerWidth + 'vw');

            }

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

    function enviarTransferencia(montoTransferir, concepto) {

        let alertaDosBotones = Swal.mixin({

            customClass: {

                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'

            },
            buttonsStyling: false

        })

        alertaDosBotones.fire({

            title: '¿Realizar Transferencia?',
            html: `
            <hr></hr>
            <strong>Beneficiario</strong>: <br /> ${datosImpresion.usuario}
            <br />
            <strong>Cuenta Origen</strong>: <br /> ${cuentaOrigen.cuenta} - ${cuentaOrigen.tipo} - ${textoFormatoNumerico([cuentaOrigen.balance], 2)}
            <br />
            <hr></hr>
            <strong>Beneficiario</strong>: <br /> ${($('#nombreBeneficiario').length) ? $('#nombreBeneficiario').val() : datosImpresion.usuario}
            <br />
            <strong>Cuenta Destino</strong>: <br /> ${((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#cuentaBeneficiario').val() : cuentaDestino.cuenta)}  -  ${cuentaDestino.tipo} ${(cuentaDestino.cuenta == 'BENEFICIARIO') ? '' : '- ' + textoFormatoNumerico([cuentaDestino.balance.toString()], 2)}
            <br />
            <hr></hr>
            <strong>Monto</strong>: RD$${textoFormatoNumerico([montoTransferir], 2)}
            <br />
            <strong>Concepto</strong>: <br /> ${concepto}
            <br />
            <hr></hr>
            `,
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

            let tipoTransferencia = (
                    $('#cuentaDestino').val().includes('AHORROS')
                ) ?
                'AHORROS_AHORROS' :
                'AHORROS_APORTES';

            tipoTransferencia = (cuentaDestino.cuenta == 'BENEFICIARIO') ? tipoTransferencia.split('_')[0] + '_' + 'TERCERO' : tipoTransferencia;

            if (result.isConfirmed) {

                consulta =
                    "EXEC [dbo].[p_guarda_transferencia_entre_cuentas] " +
                    "'" + cuentaOrigen.cuenta + "', " +
                    "'" + ((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#cuentaBeneficiario').val() : cuentaDestino.cuenta) + "', " +
                    "''," +
                    "'" + concepto + "'," +
                    "'" + tipoTransferencia + "'," +
                    "'01'," +
                    "'001'," +
                    montoTransferir;

                $.ajax({

                    type: 'GET',
                    url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta='

                });

                alertaDosBotones.fire({

                    html: `
                    <table class="table dataTable dtr-inline report-container" style="text-align:left;background-color:#fff!important">
                        <thead class="report-header">
                            <tr>
                                <th class="report-header-cell" colspan="100%" style="background-color:#fff!important;font-size:11px;font-weight:400!important;border:none!important">
                                    <div class="header-info">
                                        <div class="container" style="min-width:100%">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row align-items-center">
                                                        <div class="col-7">
                                                            <img src="https://www.daite.com.do/archivos/imagenes/${ location.origin.includes('daite.com.do') ? location.pathname.split('/')[1] : location.host.split('.')[1] }/logotipo.png" width="100" height="auto">
                                                            <p class="text-uppercase m-0 mt-3">${datosImpresion.direccion}</p>
                                                            <p class="m-0">Teléfono: ${datosImpresion.telefono}</p>
                                                            <p class="m-0">RNC: ${datosImpresion.RNC}</p>
                                                        </div>
                                                        <div class="col-5" style="display:inline-flex!important;border:4px solid rgba(127,179,68,.25);border-radius:10px!important;align-items:center;height:100%;align-self:center">
                                                            <div class="row align-items-center">
                                                                <div class="col-3">Fecha:</div>
                                                                <div class="col-9">${datosImpresion.fecha}</div>
                                                                <div class="col-3">Hora:</div>
                                                                <div class="col-9">${datosImpresion.hora}</div>
                                                                <div class="col-3">Usuario:</div>
                                                                <div class="col-9">${datosImpresion.usuario}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th class="report-header-cell" colspan="100%" style="background-color:#fff!important;font-weight:600!important;font-size:18px;text-align:center!important;color:var(--bs-primary)">
                                    <div class="header-info">Cuenta Origen</div>
                                </th>
                            </tr>
                            <tr class="report-header-cell" style="background-color:var(--bs-primary);color:#fff;font-size:11px">
                                <th class="centro header-info px-1 py-2" style="text-align:center!important">Beneficiario</th>
                                <th class="centro header-info px-1 py-2" style="text-align:center!important">Cuenta</th>
                                <th class="izquierda header-info px-1 py-2" style="text-align:left!important">Descripción</th>
                                <th class="centro header-info px-1 py-2" style="text-align:center!important">Monto</th>
                            </tr>
                        </thead>
                        <tbody class="report-content" style="font-size:11px">
                            <tr>
                                <td class="centro report-content-cell px-1 py-2" style="text-align:center!important">
                                    <div class="content-info">${datosImpresion.usuario}</div>
                                </td>
                                <td class="centro report-content-cell px-1 py-2" style="text-align:center!important">
                                    <div class="content-info">${cuentaOrigen.cuenta}</div>
                                </td>
                                <td class="izquierda report-content-cell p-1" style="text-align:left!important">
                                    <div class="content-info">${cuentaOrigen.tipo}</div>
                                </td>
                                <td class="centro report-content-cell p-1" style="text-align:center!important">
                                    <div class="content-info">${textoFormatoNumerico([montoTransferir], 2)}</div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="report-footer">
                            <tr>
                                <th class="report-footer-cell" colspan="100%" style="background-color:#fff!important;font-weight:600!important;font-size:18px;text-align:center!important;color:var(--bs-primary);padding-top:30px">
                                    <div class="footer-info">Cuenta Destino</div>
                                </th>
                            </tr>
                            <tr class="report-footer-cell" style="background-color:var(--bs-primary);color:#fff;font-size:11px">
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important">Beneficiario</th>
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important">Cuenta</th>
                                <th class="izquierda footer-info px-1 py-2" style="text-align:left!important">Descripción</th>
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important">Monto</th>
                            </tr>
                            <tr class="report-footer-cell" style="font-size:11px">
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important;font-weight:400">
                                ${((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#nombreBeneficiario').val() : datosImpresion.usuario)}
                                </th>
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important;font-weight:400">
                                ${((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#cuentaBeneficiario').val().split(' - ')[0] : cuentaDestino.cuenta)}
                                </th>
                                <th class="izquierda footer-info px-1 py-2" style="text-align:left!important;font-weight:400">
                                    ${((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#cuentaBeneficiario').val().split(' - ')[1] + ' - ' + cuentaDestino.tipo : cuentaDestino.tipo)}
                                </th>
                                <th class="centro footer-info px-1 py-2" style="text-align:center!important;font-weight:400">
                                    ${textoFormatoNumerico([montoTransferir], 2)}
                                </th>
                            </tr>
                            <tr style="border-color:transparent">
                                <th colspan="100%" style="background-color:#fff!important;font-weight:400!important;padding-top:35px!important">
                                    <div class="footer-info">
                                        <a href="${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }">
                                            ${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }
                                        </a>
                                    </div>
                                </th>
                            </tr>
                        </tfoot>
                    </table>`,
                    width: '70em',
                    showCancelButton: false,
                    confirmButtonText: 'Imprimir'

                }).then(async(result) => {

                    if (result.isConfirmed) {

                        $('.swal2-html-container').attr('style', 'margin: 0 !important').print({

                            iframe: false

                        });

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        window.location.href =
                            location.origin + '/' + location.pathname.split('/')[1] + '/correo/transferencia?' +
                            'nombreUsuario=' + $('#nombreUsuario').text().trim() + '' +
                            '&correo=' + $('#correo').val() + '' +
                            '&cuentaOrigen=' + cuentaOrigen.cuenta + '' +
                            '&cuentaDestino=' + ((cuentaDestino.cuenta == 'BENEFICIARIO') ? 'TERCERO - ' + $('#cuentaBeneficiario').val() : cuentaDestino.cuenta) + '' +
                            '&monto=' + montoTransferir + '' +
                            '&concepto=' + concepto;

                        montoTransferir = null;
                        concepto = null;

                    } else {

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        window.location.href =
                            location.origin + '/' + location.pathname.split('/')[1] + '/correo/transferencia?' +
                            'nombreUsuario=' + $('#nombreUsuario').text().trim() + '' +
                            '&correo=' + $('#correo').val() + '' +
                            '&cuentaOrigen=' + cuentaOrigen.cuenta + '' +
                            '&cuentaDestino=' + ((cuentaDestino.cuenta == 'BENEFICIARIO') ? $('#cuentaBeneficiario').val() : cuentaDestino.cuenta) + '' +
                            '&monto=' + montoTransferir + '' +
                            '&concepto=' + concepto;

                        montoTransferir = null;
                        concepto = null;

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

})