$(function() {



    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var
        datosCuentaOrigen,

        cuentaOrigen = {
            cuenta: '',
            tipo: '',
            balance: ''
        },

        servicio = {
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
        success: async function(datos) {

            datos.forEach(dato => {

                $('#cuentaOrigen').last().append('<option value="' + dato['cuenta'] + '">' + dato['cuentas'] + '</option>');

            });

            datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

            cuentaOrigen.cuenta = datosCuentaOrigen[0];
            cuentaOrigen.tipo = datosCuentaOrigen[1];
            cuentaOrigen.balance = parseFloat(datosCuentaOrigen[2].replaceAll('RD$', '').replaceAll(',', ''));

            cambiarTamanoCampos();

            // * Datos cuenta destino
            consulta =
                "EXEC [appmovil].[p_traer_cuentas] " +
                "'{idUsuario}', " +
                "'CUENTA_DESTINO_PAGAR';";

            await $.ajax({
                url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
                type: 'GET',
                dataType: 'JSON',
                success: function(datos) {

                    datos.forEach(dato => {

                        $('#servicio').last().append('<option value="' + dato['cuenta_destino'] + ' - ' + dato['balance_fecha'] + ' - ' + dato['tipo_transacion'] + '">' + dato['cuentas'] + '</option>');

                    });

                    $('#servicio').css('margin-bottom', '15px');

                    servicio.cuenta = $('#servicio').val().split(' - ')[0];
                    servicio.tipo = $('#servicio').val().split(' - ')[2];
                    servicio.balance = parseFloat($('#servicio').val().split(' - ')[1]);

                    $('#formulario > :nth-child(3)').after(`
                    <div class="row">
                        <label class="columnaTexto col-form-label">Fecha</label>
                        <div class="columnaCampo" style="width: 29.3558vw;">
                            <input type="text" class="form-control" id="fecha" value="${moment().format('DD/MM/YYYY')}" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label class="columnaTexto col-form-label">Pendiente</label>
                        <div class="columnaCampo" style="width: 29.3558vw;">
                            <input type="text" class="form-control" id="pendiente" value="${parseFloat(servicio.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}" disabled>
                        </div>
                    </div>
                    `);

                }
            });

            var mascaraMonto = IMask(document.querySelector('#monto'), {
                mask: Number,
                signed: false,
                thousandsSeparator: ',',
                radix: '.',
                scale: 2,
                min: 0,
                max: (servicio.balance > cuentaOrigen.balance) ? cuentaOrigen.balance : servicio.balance
            });

            monto.value = textoFormatoNumerico([((servicio.balance > cuentaOrigen.balance) ? cuentaOrigen.balance : servicio.balance).toString()], 2).toString();

            $('#cuentaOrigen, #servicio').change(function() {

                datosCuentaOrigen = $('#cuentaOrigen > option:selected').text().split(' - ');

                cuentaOrigen.cuenta = datosCuentaOrigen[0];

                cuentaOrigen.balance = datosCuentaOrigen[2]
                    .replaceAll('RD$', '')
                    .replaceAll(',', '');

                servicio.cuenta = $('#servicio').val().split(' - ')[0];
                servicio.tipo = $('#servicio').val().split(' - ')[2];
                servicio.balance = parseFloat($('#servicio').val().split(' - ')[1]);

                $('#pendiente').val(parseFloat(servicio.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));

                mascaraMonto.updateOptions({
                    mask: Number,
                    signed: false,
                    thousandsSeparator: ',',
                    radix: '.',
                    scale: 2,
                    min: 0,
                    max: (servicio.balance > cuentaOrigen.balance) ? cuentaOrigen.balance : servicio.balance
                });

                mascaraMonto.value = textoFormatoNumerico([((servicio.balance > cuentaOrigen.balance) ? cuentaOrigen.balance : servicio.balance).toString()], 2).toString();

            });

            $('#botonEnviar').click(function() {

                $('#monto, #concepto').removeClass('campoIncompleto');

                $('#etiquetaValidacionmonto, #etiquetaValidacionConcepto').empty();

                let campomontoVacio = (!$('#monto').val());
                let campoConceptoVacio = (!$('#concepto').val().trim());

                if (campomontoVacio && campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar un monto y contraseña!');

                    $('#monto, #concepto').addClass('campoIncompleto');

                    $('#etiquetaValidacionmonto, #etiquetaValidacionconcepto').append('*');

                } else if (campomontoVacio && !campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar un monto!');

                    $('#monto').addClass('campoIncompleto');

                    $('#etiquetaValidacionmonto').append('*')

                } else if (!campomontoVacio && campoConceptoVacio) {

                    $('div.alert.alert-danger').css('display', 'block').text('¡Tienes que ingresar una contraseña!');

                    $('#concepto').addClass('campoIncompleto');

                    $('#etiquetaValidacionconcepto').append('*')

                } else {

                    let datosServicio = $('#servicio > option:selected').text().split(' - ');

                    servicio.cuenta = datosServicio[0];
                    servicio.tipo = datosServicio[1];
                    servicio.balance = parseFloat($('#servicio').val().split(' - ')[1]);

                    let monto = $('#monto').val().replaceAll(',', '');
                    let concepto = $('#concepto').val();

                    let alertaDosBotones = Swal.mixin({

                        customClass: {

                            confirmButton: 'btn btn-success',
                            cancelButton: 'btn btn-danger'

                        },
                        buttonsStyling: false

                    })

                    alertaDosBotones.fire({

                        title: '¿Realizar Pago de Servicio?',
                        html: `
                        <hr></hr>
                        <strong>Beneficiario</strong>: <br /> ${datosImpresion.usuario}
                        <br />
                        <strong>Cuenta Origen</strong>: <br /> ${cuentaOrigen.cuenta} - ${cuentaOrigen.tipo} - ${textoFormatoNumerico([cuentaOrigen.balance.toString()], 2)}
                        <br />
                        <hr></hr>
                        <strong>Servicio</strong>: <br /> ${servicio.cuenta}  -  ${servicio.tipo}
                        <br />
                        <strong>Balance Pendiente a la Fecha</strong>: ${textoFormatoNumerico([$('#servicio').val().split(' - ')[1]], 2)}
                        <br />
                        <strong>Balance</strong>: ${textoFormatoNumerico([$('#servicio > option:selected').text().split(' - ')[2].replaceAll('RD$', '')], 2)}
                        <br />
                        <hr></hr>
                        <strong>Monto</strong>: RD$${textoFormatoNumerico([monto], 2)}
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

                        if (result.isConfirmed) {

                            consulta =
                                "EXEC [dbo].[p_guarda_transferencia_entre_cuentas] " +
                                "'" + cuentaOrigen.cuenta + "', " +
                                "'" + $('#servicio').val().split(' - ')[0] + "', " +
                                "''," +
                                "'" + concepto + "'," +
                                "'" + $('#servicio').val().split(' - ')[2] + "'," +
                                "'01'," +
                                "'001'," +
                                monto;

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
                                            <th class="centro header-info px-1 py-2" style="text-align:center!important">Cuenta</th>
                                            <th class="izquierda header-info px-1 py-2" style="text-align:left!important">Descripción</th>
                                            <th class="centro header-info px-1 py-2" style="text-align:center!important">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody class="report-content" style="font-size:11px">
                                        <tr>
                                            <td class="centro report-content-cell px-1 py-2" style="text-align:center!important">
                                                <div class="content-info">${cuentaOrigen.cuenta}</div>
                                            </td>
                                            <td class="izquierda report-content-cell p-1" style="text-align:left!important">
                                                <div class="content-info">${cuentaOrigen.tipo}</div>
                                            </td>
                                            <td class="centro report-content-cell p-1" style="text-align:center!important">
                                                <div class="content-info">${textoFormatoNumerico([monto], 2)}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot class="report-footer">
                                        <tr>
                                            <th class="report-footer-cell" colspan="100%" style="background-color:#fff!important;font-weight:600!important;font-size:18px;text-align:center!important;color:var(--bs-primary);padding-top:30px">
                                                <div class="footer-info">Servicio</div>
                                            </th>
                                        </tr>
                                        <tr class="report-footer-cell" style="background-color:var(--bs-primary);color:#fff;font-size:11px">
                                            <th class="centro footer-info px-1 py-2" style="text-align:center!important">Cuenta</th>
                                            <th class="izquierda footer-info px-1 py-2" style="text-align:left!important">Descripción</th>
                                            <th class="centro footer-info px-1 py-2" style="text-align:center!important">Balance Pendiente a la Fecha</th>
                                        </tr>
                                        <tr class="report-footer-cell" style="font-size:11px">
                                            <th class="centro footer-info px-1 py-2" style="text-align:center!important;font-weight:400">
                                            ${servicio.cuenta}
                                            </th>
                                            <th class="izquierda footer-info px-1 py-2" style="text-align:left!important;font-weight:400">
                                                ${servicio.tipo}
                                            </th>
                                            <th class="centro footer-info px-1 py-2" style="text-align:center!important;font-weight:400">
                                                ${textoFormatoNumerico([(parseFloat($('#servicio').val().split(' - ')[1]) - parseFloat(monto)).toString()], 2)}
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

                                    $('.swal2-html-container').print({

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

            $('.columnaCampo, #servicio, #monto, #concepto, #botonEnviar')
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