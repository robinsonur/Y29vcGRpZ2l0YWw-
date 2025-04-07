(function(factory) {
        "use strict";

        if (typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], function($) {
                return factory($, window, document);
            });
        } else if (typeof exports === 'object') {
            // CommonJS
            module.exports = function(root, $) {
                if (!root) {
                    root = window;
                }

                if (!$) {
                    $ = typeof window !== 'undefined' ?
                        require('jquery') :
                        require('jquery')(root);
                }

                return factory($, root, root.document);
            };
        } else {
            // Browser
            factory(jQuery, window, document);
        }
    }
    (function($, window, document) {


        $.fn.dataTable.render.moment = function(from, to, locale) {
            // Argument shifting
            if (arguments.length === 1) {
                locale = 'en';
                to = from;
                from = 'YYYY-MM-DD';
            } else if (arguments.length === 2) {
                locale = 'en';
            }

            return function(d, type, row) {
                if (!d) {
                    return type === 'sort' || type === 'type' ? 0 : d;
                }

                var m = window.moment(d, from, locale, true);

                // Order and type get a number value from Moment, everything else
                // sees the rendered value
                return m.format(type === 'sort' || type === 'type' ? 'x' : to);
            };
        };


    }));

$(function() {

    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var cuenta, consulta, formatoFecha, camposTextoFormateados, campo = {};

    formatoFecha = 'DD/MM/YYYY';

    camposTextoFormateados = formatearCamposTextoNumero(
        [{
                id: '#monto'
            },
            {
                id: '#gastoCierre'
            },
            {
                id: '#montoSeguros'
            },
            {
                id: '#total'
            },
            {
                id: '#tiempo',
                cantidadDecimales: 0,
                valorMinimo: 1,
                valorMaximo: 250,
            },
            {
                id: '#tasaInteres',
                valorMinimo: 1,
                valorMaximo: 99
            },
            {
                id: '#tasaComision',
                valorMinimo: 0,
                valorMaximo: 99
            },
            {
                id: '#tasaSeguros',
                valorMinimo: 0,
                valorMaximo: 99
            },
        ]
    );

    $('#monto, #gastoCierre, #montoSeguros').on('input', function() {

        let valorSumar = 0;

        camposTextoFormateados.forEach((campoTextoFormateado, indice) => {

            if (
                campoTextoFormateado.el.input.id == 'monto' ||
                campoTextoFormateado.el.input.id == 'gastoCierre' ||
                campoTextoFormateado.el.input.id == 'montoSeguros'
            ) {

                valorSumar += (campoTextoFormateado.unmaskedValue.length) ? parseFloat(campoTextoFormateado.unmaskedValue) : 0;

            } else if (campoTextoFormateado.el.input.id == 'total') {

                campoTextoFormateado.value = valorSumar.toString();

            }

        });

    })

    // TODO: Script del Data Table
    // * Textos a mostrar en la tabla de registros
    var idioma = {
        sLengthMenu: 'Mostrar _MENU_ registros',
        sSearch: 'Buscar:',

        // * Textos a mostrar al copiar registros
        buttons: {
            copyTitle: 'Portapapeles',
            copySuccess: {
                1: '1 reporte copiado',
                _: '%d registros copiadas'
            }
        },

        sEmptyTable: 'No hay registros disponibles',
        sLoadingRecords: 'Cargando registros...',
        sProcessing: 'Procesando registros...',
        sZeroRecords: 'No se encontraron registros coincidentes',

        sInfo: 'Mostrando _START_ ~ _END_',
        sInfoEmpty: 'Mostrando 0',
        sInfoFiltered: 'de un total de _MAX_ registros',
        sInfoThousands: ',',

        oPaginate: {
            sPrevious: '<',
            sNext: '>'
        }

    };

    consulta = "SELECT * FROM appmovil.usuarios WHERE login_usuario = ' ';";

    // * Inicializando tabla de registros
    var tablaRegistros = $('#tablaRegistros').DataTable({

        // * Consultando registros desde la base de datos con ajax y json
        ajax: {
            type: 'GET',
            url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
            dataType: 'JSON',
            dataSrc: ''
        },

        columns: [

            { data: 'cuota' },
            { data: 'fecha_cuota', orderable: false },
            { data: 'capital', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'Interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'comision', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'seguros', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'monto_cuota', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },

        ],

        // Selector para cantidad de registros a mostrar
        lengthChange: false,

        lengthMenu: [
            [15, 30, 60, 120, -1],
            [10, 20, 40, 80, 'Ꝏ']
        ],

        columnDefs: [{
                targets: 0,
                className: 'cuota',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

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
                    `).addClass('alinearIzquierda')

                },
                render: function(fecha) {

                    return moment(fecha).format('DD/MM/YYYY');

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
                className: 'monto',
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
                className: 'balance',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearDerecha');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

                }
            }
        ],

        // Campo para filtrar registros
        searching: false,

        // Ordenamientos descendente y ascendente
        ordering: true,

        // Paginación
        paging: false,

        // Texto de información
        info: true,

        autoWidth: false,

        scrollY: '99.5064vw',
        scrollX: false,

        // Textos a mostrar en la tabla de registros
        language: idioma,

        dom: "<'row mb-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-2'B>>" +
            "<'row mb-3'<'col-sm-12'tr>>" +
            "<'row mb-3'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

        buttons: {

            // Contenedor de los botones
            dom: {

                container: {
                    tag: 'div',
                    className: 'flexcontent'
                }

            },

            // Botones
            buttons: [

                // Botón de columnas a mostrar

                {
                    extend: 'collection',
                    text: '<i class="fas fa-file-export"></i>',

                    buttons: [
                        // Botón de copiar al portapapeles
                        {
                            extend: 'copyHtml5',
                            text: 'Copiar',
                            className: '',
                            titleAttr: 'Copiar registros al portapapeles',

                            exportOptions: {
                                columns: ':visible',

                                modifier: {
                                    page: 'current'
                                }

                            },

                            footer: true,
                        },

                        // Botón de exportar a EXCEL
                        {
                            extend: 'excelHtml5',
                            text: 'Excel',
                            titleAttr: 'Exportar registros a Excel',
                            className: '',
                            title: '',

                            exportOptions: {
                                columns: ':visible',

                                modifier: {
                                    page: 'current'
                                }

                            },

                            footer: true,
                        },

                        // Botón de exportar a CSV
                        {
                            extend: 'csvHtml5',
                            text: 'CSV',
                            title: 'Titulo de tabla en CSV',
                            titleAttr: 'Exportar registros a CSV',
                            className: '',

                            exportOptions: {
                                columns: ':visible',

                                modifier: {
                                    page: 'current'
                                }

                            },

                            footer: true
                        },
                    ]

                },

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

                    customize: function(tablaRegistros = $('#tablaRegistros')) {

                        // TODO: Elementos

                        // * Tabla por defecto
                        $(tablaRegistros.document.body)
                            .find('table')
                            .addClass('report-container');

                        $(tablaRegistros.document.body)
                            .find('thead')
                            .addClass('report-header');

                        $(tablaRegistros.document.body)
                            .find('.report-header > tr')
                            .addClass('report-header-cell')

                        $(tablaRegistros.document.body)
                            .find('.report-header-cell > th')
                            .addClass('header-info px-1 py-2');

                        $(tablaRegistros.document.body)
                            .find('tbody')
                            .addClass('report-content');

                        $(tablaRegistros.document.body)
                            .find('.report-content > tr > td')
                            .addClass('report-content-cell p-1')
                            .prepend('<div class="content-info">')
                            .append('</div>');

                        $(tablaRegistros.document.body)
                            .find('tfoot')
                            .addClass('report-footer');

                        $(tablaRegistros.document.body)
                            .find('.report-footer > tr')
                            .addClass('report-footer-cell');

                        $(tablaRegistros.document.body)
                            .find('.report-footer-cell > th')
                            .addClass('footer-info px-1 py-2');

                        // var pieTabla = $(tablaRegistros.document.body).find('.report-footer > tr:has(.report-footer-cell.px-1.py-2)').clone();
                        // pieTabla.prependTo(tablaRegistros.document.body).find('body');

                        // * Cabecera
                        $(tablaRegistros.document.body)
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

                        $(tablaRegistros.document.body)
                            .find('.report-header-cell[colspan]')
                            .after(`
                                <tr class="report-header-cell no-style p-0 m-0" style="padding: 0 !important; margin: 0 !important;background-color: #ffffff; color: #607080; font-size: 11px; font-weight: 200 !important">
                                    <th class="centro header-info p-0 m-0" style="padding: 0 !important; margin: 0 !important; font-weight: 200 !important" colspan="100%">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="row" id="contenedorAmortizacion">
                                                    <div class="col-6">
                                                        <div class="row">
                                                            <div class="col-6 izquierda">
                                                                <p class="p-0 m-0">Forma Pago</p>
                                                                <p class="p-0 m-0">Monto Préstamo</p>
                                                                <p class="p-0 m-0">Gasto Cierre</p>
                                                                <p class="p-0 m-0">Monto Seguro</p>
                                                                <p class="p-0 m-0">Total Préstamo</p>
                                                            </div>
                                                            <div class="col-6 derecha">
                                                                <p class="p-0 m-0">${$('#metodoPago > option:selected').text()}</p>
                                                                <p class="p-0 m-0">${$('#monto').val()}</p>
                                                                <p class="p-0 m-0">${$('#gastoCierre').val()}</p>
                                                                <p class="p-0 m-0">${$('#montoSeguros').val()}</p>
                                                                <p class="p-0 m-0">${$('#total').val()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="row">
                                                            <div class="col-6 izquierda">
                                                                <p class="p-0 m-0">Tasa de Interés</p>
                                                                <p class="p-0 m-0">Tasa de Comisión</p>
                                                                <p class="p-0 m-0">Tasa de Seguros</p>
                                                                <p class="p-0 m-0">Cantidad de Cuotas</p>
                                                                <p class="p-0 m-0">Valor de Cuotas</p>
                                                            </div>
                                                            <div class="col-6 derecha">
                                                                <p class="p-0 m-0">${campo.tasaInteres}</p>
                                                                <p class="p-0 m-0">${campo.tasaComision}</p>
                                                                <p class="p-0 m-0">${campo.tasaSeguros}</p>
                                                                <p class="p-0 m-0">${campo.tiempo}</p>
                                                                <p class="p-0 m-0">${$('tr.odd:first-child > .monto').text()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                <tr class="report-header-cell contenedorTitulo">
                                <th class="header-info titulo" colspan="100%">Tabla Amortización</th>
                                </tr>
                            `);

                        // * Pie
                        $(tablaRegistros.document.body)
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
                        $(tablaRegistros.document.body)
                            .css('margin', '0 10px')
                            .css('background-color', '#fff');

                        $(tablaRegistros.document.body)
                            .find('.container')
                            .css('min-width', '100%');

                        $(tablaRegistros.document.body)
                            .find('.col-7')
                            .css('font-size', '11px');

                        $(tablaRegistros.document.body)
                            .find('.col-5')
                            .css('display', 'table')
                            .css('font-size', '11px')
                            .css('border', '4px solid var(--bs-primary-subtle)')
                            .css('border-radius', '10px');

                        $(tablaRegistros.document.body)
                            .find('thead > tr:not([colspan]):not(.no-style), tfoot > tr:not([colspan])')
                            .css('background-color', 'var(--bs-primary)')
                            .css('color', '#fff');

                        $(tablaRegistros.document.body)
                            .find('table > thead > :nth-child(3), table > tbody, table > tfoot > :nth-child(1)')
                            .css('font-size', '11px');
                        // * /Estilos

                        // * Atributos
                        $(tablaRegistros.document.body)
                            .find('[colspan="100%"]')
                            .attr('style', function(i, s) {
                                return (s || '') +
                                    'background-color: #fff !important; ' +
                                    'font-weight: normal !important'
                            });

                        $(tablaRegistros.document.body)
                            .find('.cuota, .fecha')
                            .addClass('alinearIzquierda');

                        $(tablaRegistros.document.body)
                            .find('.capital, .interes, .comision, .seguros, .monto, .balance')
                            .addClass('alinearDerecha');

                        $(tablaRegistros.document.body)
                            .find('#contenedorAmortizacion')
                            .attr('style', `
                            margin: 0;
                            padding: 0;
                            font-size: 11px;
                            font-weight: normal;
                            color: #607080
                            `)

                        $(tablaRegistros.document.body)
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

            ]
        },
        // Función que se ejecuta cada vez que se cambia el HTML del contenido de la tabla
        drawCallback: async function() {



            $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

            // Columnas
            let columnaCapital = api.column(2, { page: 'current' });
            let columnaInteres = api.column(3, { page: 'current' });
            let columnaComision = api.column(4, { page: 'current' });
            let columnaSeguros = api.column(5, { page: 'current' });
            let columnaMontoCuota = api.column(6, { page: 'current' });
            let columnaBalance = api.column(7, { page: 'current' });

            // Valores de columnas sumadas
            let sumaColumnaCapital = columnaCapital.data().sum();
            let sumaColumnaInteres = columnaInteres.data().sum();
            let sumaColumnaComision = columnaComision.data().sum();
            let sumaColumnaSeguros = columnaSeguros.data().sum();
            let sumaColumnaMontoCuota = columnaMontoCuota.data().sum();
            let sumaColumnaBalance = columnaBalance.data().sum();

            // Pie de la columna capital
            $(columnaCapital.footer()).html(textoFormatoNumerico([sumaColumnaCapital + '']));

            // Pie de la columna interés
            $(columnaInteres.footer()).html(textoFormatoNumerico([sumaColumnaInteres + '']));

            // Pie de la columna comisión
            $(columnaComision.footer()).html(textoFormatoNumerico([sumaColumnaComision + '']));

            // Pie de la columna seguros
            $(columnaSeguros.footer()).html(textoFormatoNumerico([sumaColumnaSeguros + '']));

            // Pie de la columna monto cuota
            $(columnaMontoCuota.footer()).html(textoFormatoNumerico([sumaColumnaMontoCuota + '']));

            // Pie de la columna balance
            $(columnaBalance.footer()).html(textoFormatoNumerico([sumaColumnaBalance + '']));

            ocultarCabeceraTablaRegistros();

        },

        responsive: true,
        deferRender: true,

        order: [
            [0, 'asc']
        ],

        initComplete: function() {

            $('#tablaRegistros').on('column-visibility.dt', function() {

                ocultarCabeceraTablaRegistros();

            });

        }

    });

    $('#tablaRegistros tbody').on('click', 'tr', function() {

        if ($(this).hasClass('seleccionada')) {

            $(this).removeClass('seleccionada');

        } else {

            tablaRegistros.$('tr.seleccionada').removeClass('seleccionada');

            $(this).addClass('seleccionada');

        }

    });

    // Filtros
    $('#botonCalcular').on('click', function() {

        camposTextoFormateados.forEach(campoTextoFormateado => {

            campo[campoTextoFormateado.el.input.id] =
                (campoTextoFormateado.unmaskedValue) ?
                campoTextoFormateado.unmaskedValue : 0.0

        });

        campo.metodoPago = $('#metodoPago').val();

        $('.campoIncompleto').removeClass('campoIncompleto');

        if (campo.tiempo == 0) {

            $('#tiempo').addClass('campoIncompleto')

        }

        if (campo.tasaInteres == 0) {

            $('#tasaInteres').addClass('campoIncompleto')

        }

        if ($('.campoIncompleto').length) {

            return

        }

        consulta =
            "SET NOCOUNT ON; " +
            "EXEC [dbo].[p_crea_tabla_amortizacion] " +
            "" + campo.total + ", " +
            "" + campo.tiempo + ", " +
            "" + campo.tasaInteres + ", " +
            "'" + moment().format('YYYYMMDD') + "', " +
            "'I', " +
            "'" + campo.metodoPago + "', " +
            "'1', " +
            "'0', " +
            "" + campo.tasaComision + ", " +
            "" + campo.tasaSeguros + ";";

        tablaRegistros.ajax.url(rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select').load();

    });

    function cambiarTamanoTabla() {

        $('#tablaRegistros').css('width', '100%')

    }

    // TODO: /Script del Data Table

    // Evento cuando las peticiones ajax sean completadas
    $(document).ajaxComplete(function() {

        ocultarCabeceraTablaRegistros();

        setTimeout(() => {

            $('.comision').click();

        }, 200);

    });

    // Evento cuando las peticiones ajax sean completadas
    $(document).ajaxComplete(function() {

        ocultarCabeceraTablaRegistros();

    });

    // Evento para cuando se re ajuste el tamaño de pantalla
    $(window).on('resize', function() {

        ocultarCabeceraTablaRegistros();

    });

    // Función para ocultar un espacio en la cabecera de la tabla de registros
    var tiempoocultarCabeceraTablaRegistros;

    function ocultarCabeceraTablaRegistros() {

        if (window.innerWidth > 992) {

            clearTimeout(tiempoocultarCabeceraTablaRegistros);

            tiempoocultarCabeceraTablaRegistros = setTimeout(function() {

                $("#tablaRegistros > thead > tr").css('display', 'none');

            }, 200);
        }

    }

});