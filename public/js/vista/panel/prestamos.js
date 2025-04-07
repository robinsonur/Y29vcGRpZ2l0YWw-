// ! Declaración de variables
var
    consultaCabeceras,
    consultaRegistros,
    registrosFormatearNumero,
    selectorCantidadRegistros,
    opcionesSelectorCantidadRegistros,
    campoFiltrarRegistros,
    paginacion,
    textoInformacion,
    autoAjusteTamanoRegistros,
    altoTablaRegistros,
    desplazamientoHorizontal,
    idioma,
    estructuraElementos,
    tablaAutoajustable,
    ordenRegistros,
    tablaRegistrosFiltros,
    indicesColumnasSumar;

// * Consulta para los registros
consultaCabeceras = "SELECT '';"

consultaRegistros =
    window.innerWidth < 1024 ?
    "EXEC [appmovil].[p_traer_cuentas] " +
    "'{idUsuario}', " +
    "'PRESTAMOS', " +
    "'', " +
    "'';" :
    "EXEC [appmovil].[p_traer_cuentas] " +
    "'{idUsuario}', " +
    "'PRESTAMOS', " +
    "'', " +
    "'{filtroFechaHasta}';"

registrosFormatearNumero =
    window.innerWidth < 922 ? [
        { indiceColumna: 1, decimales: 2 },
        { indiceColumna: 2, decimales: 2 },
        { indiceColumna: 3, decimales: 2 }
    ] : [
        { indiceColumna: 5, decimales: 2 },
        { indiceColumna: 7, decimales: 2 },
        { indiceColumna: 8, decimales: 2 },
        { indiceColumna: 9, decimales: 2 },
        { indiceColumna: 10, decimales: 2 }
    ];

tablaAutoajustable = true;

ordenRegistros = false;

tablaRegistrosFiltros = false;

indicesColumnasSumar =
    window.innerWidth < 1024 ? [3, 4, 5] : [5, 8, 9, 10];

filtros = true;

consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'CERTIFICADOS', 'TIPO_CUENTAS';";

$.ajax({
    url: `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta?consulta=EXEC [appmovil].[p_traer_estados]&tipoConsulta=select`,
    type: 'GET',
    dataType: 'JSON',
    success: function(datos) {

        datos.forEach(dato => $('#estado').last().append(`<option value="${dato.estado}">${dato.estado}</option>`));

    }
});

$('#tablaRegistros').on('draw.dt', function() {

    accionVer();

});

function accionVer() {

    $('.accionVer')
        .off()
        .click(function() {

            Swal.mixin({}).fire({

                title: '',
                html: '<table class="table" id="tablaRegistrosDialogo">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Documentos</th>' +
                    '<th>Fecha</th>' +
                    '<th>Capital</th>' +
                    '<th>Interés</th>' +
                    '<th>Comisión</th>' +
                    '<th>Seguros</th>' +
                    '<th>Mora</th>' +
                    '<th>Monto</th>' +
                    '<th></th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '</tbody>' +
                    '<tfoot>' +
                    '<tr>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '<th></th>' +
                    '</tr>' +
                    '</tfoot>' +
                    '</table>',
                width: '900px',
                padding: '0',
                background: '#fff',
                grow: true,
                showConfirmButton: false,
                showCloseButton: true

            })

            var consulta =
                "EXEC [appmovil].[p_traer_registros] " +
                "'{idUsuario}', " +
                "'PRESTAMOS', " +
                "'', " +
                "'', " +
                "'" + this.value + "', " +
                "'', " +
                "'', " +
                "'PANTALLA_MODAL', " +
                "'FECHAASCENDENTE'";

            $('#tablaRegistrosDialogo').DataTable({

                ajax: {
                    type: 'GET',
                    url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
                    dataType: 'JSON',
                    dataSrc: ''
                },

                columns: [{
                        data: 'documentos',
                        render: $.fn.dataTable.render.number(',', '.', 0, '')
                    },
                    { data: 'fecha', orderData: 8 },
                    { data: 'capital', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'comision', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'seguros', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'mora', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'fecha_orden', visible: false }
                ],

                columnDefs: [{
                        targets: 0,
                        className: 'documento',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearIzquierda');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearIzquierda');

                        }
                    },
                    {
                        targets: 1,
                        className: 'fecha',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearIzquierda');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearIzquierda');

                        }
                    },
                    {
                        targets: 2,
                        className: 'capital',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    },
                    {
                        targets: 3,
                        className: 'interes',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    },
                    {
                        targets: 4,
                        className: 'comision',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    },
                    {
                        targets: 5,
                        className: 'seguros',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    },
                    {
                        targets: 6,
                        className: 'mora',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    },
                    {
                        targets: 7,
                        className: 'monto',
                        createdCell: function(td, cellData, rowData, row, col) {

                            $(td).addClass('alinearDerecha');

                            $(`
                                .dataTable > thead > tr > th:nth-child(${col + 1}),
                                .dataTable > tfoot > tr > th:nth-child(${col + 1})
                            `).addClass('alinearDerecha')

                        }
                    }
                ],

                lengthChange: false,

                searching: false,

                ordering: true,

                paging: false,

                autoWidth: true,

                scrollY: '15.378571428571428vw',
                scrollX: true,

                language: idioma,

                dom: "<'row mb-3'<'col-sm-12 col-md-12'B>>",

                buttons: [

                    // Botón de imprimir
                    {
                        extend: 'print',
                        text: '<i class="fas fa-print"></i>',
                        titleAttr: 'Imprimir registros',
                        className: '',
                        title: '',

                        exportOptions: {
                            columns: ':visible',

                            modifier: {
                                page: 'current'
                            }

                        },

                        footer: true,

                        // Estilos para la impresión de los registros
                        customize: function(tablaRegistrosDialogo = $('#tablaRegistrosDialogo')) {

                            // TODO: Elementos

                            // * Tabla por defecto
                            $(tablaRegistrosDialogo.document.body)
                                .find('table')
                                .addClass('report-container');

                            $(tablaRegistrosDialogo.document.body)
                                .find('thead')
                                .addClass('report-header');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-header > tr')
                                .addClass('report-header-cell')

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-header-cell > th')
                                .addClass('header-info px-1 py-2');

                            $(tablaRegistrosDialogo.document.body)
                                .find('tbody')
                                .addClass('report-content');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-content > tr > td')
                                .addClass('report-content-cell p-1')
                                .prepend('<div class="content-info">')
                                .append('</div>');

                            $(tablaRegistrosDialogo.document.body)
                                .find('tfoot')
                                .addClass('report-footer');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-footer > tr')
                                .addClass('report-footer-cell');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-footer-cell > th')
                                .addClass('footer-info px-1 py-2');

                            // var pieTabla = $(tablaRegistros.document.body).find('.report-footer > tr:has(.report-footer-cell.px-1.py-2)').clone();
                            // pieTabla.prependTo(tablaRegistros.document.body).find('body');

                            // * Cabecera
                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-header')
                                .prepend(`
                                <th class="report-header-cell" colspan="100%">
                                <div class"header-info">
                                <div class="container">
                                <div class="row">
                                <div class="col-12">
                                <div class="row align-items-center">
                                <div class="col-7">
                                <img src="https://www.daite.com.do/archivos/imagenes/${ location.origin.includes('daite.com.do') ? location.pathname.split('/')[1] : location.host.split('.')[1] }/logotipo.png" width="100" height="auto"></img>
                                <p class="text-uppercase m-0 mt-3">${datosImpresion.direccion}</p>
                                <p class="m-0">Teléfono: ${datosImpresion.telefono}</p>
                                <p class="m-0">RNC: ${datosImpresion.RNC}</p>
                                </div>
                                <div class="col-5" style="margin-bottom: -15px">
                                <div class="row align-items-center">
                                <div class="col-3">Fecha:</div>
                                <div class="col-9" style="text-align: right !important">${datosImpresion.fecha}</div>
                                <div class="col-3">Hora:</div>
                                <div class="col-9" style="text-align: right !important">${datosImpresion.hora}</div>
                                <div class="col-3">Usuario:</div>
                                <div class="col-9" style="text-align: right !important">${datosImpresion.usuario}</div>
                                </div>
                                </div>
                                </div>
                                </div>
                                </div>
                                </div>
                                </div>
                                </th>
                            `);

                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-header-cell[colspan]')
                                .after(`
                                    <tr class="report-header-cell contenedorTitulo">
                                    <th class="header-info titulo" colspan="100%">${datosImpresion.tipoRegistro}</th>
                                    </tr>
                                `);

                            // * Pie
                            $(tablaRegistrosDialogo.document.body)
                                .find('.report-footer')
                                .append(
                                    '<th class="report-footer-cell" colspan="100%">' +
                                    '<div class"footer-info">' +
                                    '<a href="' + window.location.href.substring(0, window.location.href.indexOf('panel')) + '">' +
                                    window.location.href.substring(0, window.location.href.indexOf('panel')) +
                                    '</a>' +
                                    '</div>' +
                                    '</th>'
                                );

                            // TODO /Elementos

                            // * Estilos
                            $(tablaRegistrosDialogo.document.body)
                                .css('margin', '0 10px')
                                .css('background-color', '#fff');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.container')
                                .css('min-width', '100%');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.col-7')
                                .css('font-size', '11px');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.col-5')
                                .css('display', 'table')
                                .css('font-size', '11px')
                                .css('border', '4px solid var(--bs-primary-subtle)')
                                .css('border-radius', '10px');

                            $(tablaRegistrosDialogo.document.body)
                                .find('thead > tr:not([colspan]):not(.no-style), tfoot > tr:not([colspan])')
                                .css('background-color', 'var(--bs-primary)')
                                .css('color', '#fff');

                            $(tablaRegistrosDialogo.document.body)
                                .find('table > thead > :nth-child(3), table > tbody, table > tfoot > :nth-child(1)')
                                .css('font-size', '11px');
                            // * /Estilos

                            // * Atributos
                            $(tablaRegistrosDialogo.document.body)
                                .find('[colspan="100%"]')
                                .attr('style', function(i, s) {
                                    return (s || '') +
                                        'background-color: #fff !important; ' +
                                        'font-weight: normal !important'
                                });

                            $(tablaRegistrosDialogo.document.body)
                                .find('.documentos, .fecha')
                                .addClass('alinearIzquierda');

                            $(tablaRegistrosDialogo.document.body)
                                .find('.capital, .interes, .comision, .seguros, .mora, .monto')
                                .addClass('alinearDerecha');

                            $(tablaRegistrosDialogo.document.body)
                                .find('#contenedorAmortizacion')
                                .attr('style', `
                            margin: 0;
                            padding: 0;
                            font-size: 11px;
                            font-weight: normal;
                            color: #607080
                            `)

                            $(tablaRegistrosDialogo.document.body)
                                .find('.contenedorTitulo, .titulo')
                                .attr('style', `
                            margin: 0;
                            padding: 0;
                            background-color: var(--bs-primary);
                            text-align: center;
                            font-size: 18px;
                            color: #fff
                            `)

                            // * /Atributos

                        }

                    }

                ],

                responsive: true,
                deferRender: true,

                order: [1, 'asc'],

                drawCallback: function() {

                    // ! Declaración de variables
                    let api, indicesColumnasSumar;

                    api = this.api();

                    $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

                    indicesColumnasSumar = [2, 3, 4, 5, 6, 7];

                    indicesColumnasSumar.forEach(function(indiceColumnaSumar) {

                        columnaSumar = api.column(indiceColumnaSumar, { page: 'current' });

                        sumaColumnaSumar = columnaSumar.data().sum();

                        $(columnaSumar.footer()).html(textoFormatoNumerico([sumaColumnaSumar + ''], 2))

                    });

                },

            });

        })

}

// menor a 1024px

if (window.innerWidth < 1024) {

    $('#tablaRegistros tbody').on('click', 'tr:has(>td:not([class="dataTables_empty"]))', function() {

        if (!$(this).hasClass('seleccionada')) {

            prestamo = {
                numero: $(this).find('.prestamo').text()
            };

            json.forEach(registro => {

                if (registro.cuenta == prestamo.numero) {

                    prestamo.clase = registro.clase.trim();
                    prestamo.garantia = registro.descripcion.trim();
                    prestamo.tasa = textoFormatoNumerico([registro.tasa], 2);
                    prestamo.tiempo = registro.tiempo.trim();
                    prestamo.formaPago = registro.forma_pago.trim();
                    prestamo.valorTotal = textoFormatoNumerico([registro.monto], 2)

                }

            });

            Swal.mixin({}).fire({

                title: '',
                html: '<div class="card" style="margin:0;font-size:10px"><div class="card-body" style="padding:0"><h5 class="card-title" style="text-align:left;background-color:var(--bs-primary);color:#fff;padding:14px 0 14px 14px">Detalles</h5><div class="card-subtitle" style="text-align:left;color:#fff;background:var(--bs-primary);padding:0 14px;margin:5px;border-radius:8px"><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Clase:</div><div class="col-6" style="text-align:right">' + prestamo.clase + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Garantía:</div><div class="col-6" style="text-align:right">' + prestamo.garantia + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Tasa:</div><div class="col-6" style="text-align:right">' + prestamo.tasa + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Tiempo:</div><div class="col-6" style="text-align:right">' + prestamo.tiempo + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Forma de Pago:</div><div class="col-6" style="text-align:right">' + prestamo.formaPago + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Valor Total:</div><div class="col-6" style="text-align:right">' + prestamo.valorTotal + '</div></div></div></div></div><div class="card-text" style="text-align:left;padding:0 14px;margin:5px;overflow:scroll;height:226px"></div></div></div>',
                width: '100%',
                height: '100%',
                padding: '0',
                background: '#fff',
                grow: true,
                showConfirmButton: false,
                showCloseButton: true

            })

            consulta =
                "EXEC [AppMovil].[p_traer_registros] " +
                "'{idUsuario}', " +
                "'PRESTAMOS', " +
                "'', " +
                "'', " +
                "'" + prestamo.numero + "', " +
                "'', " +
                "'', " +
                "'PANTALLA_MODAL', " +
                "'FECHAASCENDENTE';";

            $.post(
                rutaConsulta + '2?' +
                '_token=' + $('[name="_token"]').val() +
                '&consulta=' + consulta +
                '&tipoConsulta=select',
                function(registros) {

                    registros.forEach(registro => {

                        $('.card-text')
                            .last()
                            .append('<div><div class="row"><div class="col-12" style="font-weight:700">' + registro.fecha.trim() + '</div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Capital</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.capital], 2) + '</div></div></div><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Seguros:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.seguros], 2) + '</div></div></div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Interés:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.interes], 2) + '</div></div></div><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Mora:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.mora], 2) + '</div></div></div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Comisión:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.comision], 2) + '</div></div></div><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Monto:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.monto], 2) + '</div></div></div></div></div></div></div>');

                    });

                }
            );

        }

    });

}