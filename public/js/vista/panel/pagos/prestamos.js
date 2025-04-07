$(async function() {

    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var cuenta, consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script de los filtros
    // * Datos del filtro número de cuenta
    consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'PRESTAMOS', 'CUENTAS';";

    await $.ajax({
        url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',

        success: function(registros) {

            registros.forEach(registro => {

                $('#filtroNumeroCuenta')
                    .last()
                    .append(
                        '<option value="' + registro['numero_prestamo'] + '">' +
                        registro['prestamo'] +
                        '</option>'
                    );

            });

            let columnas =
                window.innerWidth < 1024 ? [
                    'Documento',
                    'Fecha',
                    'Préstamo',
                    'Descripción',
                    'Monto',
                    ''
                ] : [
                    'Préstamo',
                    'Documentos',
                    'Descripción',
                    'Fecha',
                    'Capital',
                    'Interés',
                    'Comisión',
                    'Seguros',
                    'Mora',
                    'Monto',
                    ''
                ];

            // ? Ciclo para recorrer todas las columnas de los registros
            columnas.forEach((columna, iteracion) => {

                // * Agregando a la cabecera los nombres de las columnas
                $('#tablaRegistros > thead > tr')
                    .append(
                        '<th>' + columna + '</th>'
                    );

                // * Agregando el pie de las columnas
                $('#tablaRegistros > tfoot > tr')
                    .append(
                        '<th></th>'
                    );

            });

        }

    });

    // * Datos del filtro tipo cuenta
    consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'PRESTAMOS', 'TIPO_CUENTAS';";

    $.ajax({
        url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',

        success: function(registros) {

            registros.forEach(registro => {

                $('#filtroTipoCuenta')
                    .last()
                    .append(
                        '<option value="' + registro['tipo_cuenta'] + '">' +
                        registro['descripcion_tipo_cuenta'] +
                        '</option>'
                    );

            });

        }

    });
    // TODO: /Script de los filtros

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

    consulta = (window.innerWidth < 1024) ?
        "EXEC [appmovil].[p_traer_registros] " +
        "'{idUsuario}', " +
        "'PRESTAMOS', " +
        "'', " +
        "'{filtroFechaHasta}';" :
        "EXEC [appmovil].[p_traer_registros] " +
        "'{idUsuario}', " +
        "'PRESTAMOS', " +
        "'{filtroFechaDesde}', " +
        "'{filtroFechaHasta}';";

    // * Inicializando tabla de registros
    var tablaRegistros = $('#tablaRegistros').DataTable({

        // * Consultando registros desde la base de datos con ajax y json
        ajax: {
            type: 'GET',
            url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
            dataType: 'JSON',
            dataSrc: ''
        },

        columns: window.innerWidth < 1024 ? [
            { data: 'documentos', render: $.fn.dataTable.render.number(',', '.', 0, '') },
            { data: 'fecha', orderData: 5 },
            { data: 'cuenta' },
            { data: 'descripcion' },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }
        ] : [
            { data: 'cuenta' },
            {
                data: 'documentos',
                render: $.fn.dataTable.render.number(',', '.', 0, '')
            },
            { data: 'descripcion' },
            { data: 'fecha', orderData: 10 },
            { data: 'capital', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'comision', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'seguros', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'mora', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }
        ],

        columnDefs: window.innerWidth < 1024 ? [{
                targets: 0,
                className: 'documento',
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

                }
            },
            {
                targets: 2,
                className: 'prestamo',
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
                className: 'descripcion',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

                }
            },
            {
                targets: 4,
                className: 'monto',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearDerecha');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

                }
            },
        ] : [{
                targets: 0,
                className: 'prestamo',
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
                className: 'documentos',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

                }
            },
            {
                targets: 2,
                className: 'descripcion',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

                }
            },
            {
                targets: 3,
                className: 'fecha',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

                }
            },
            {
                targets: 4,
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
                targets: 5,
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
                targets: 6,
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
                targets: 7,
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
                targets: 8,
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
                targets: 9,
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

        // Selector para cantidad de registros a mostrar
        lengthChange: true,

        lengthMenu: [
            [10, 20, 40, 80, -1],
            [10, 20, 40, 80, 'Ꝏ']
        ],

        // Campo para filtrar registros
        searching: true,

        // Ordenamientos descendente y ascendente
        ordering: true,

        // Paginación
        paging: true,

        // Texto de información
        info: true,

        autoWidth: true,

        scrollY: '15.378571428571428vw',
        scrollX: true,

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
                    extend: 'colvis',
                    text: '<i class="fas fa-eye"></i>'
                },

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
                            <tr class="report-header-cell contenedorTitulo">
                            <th class="header-info titulo" colspan="100%">${datosImpresion.tipoRegistro}</th>
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
                            .find('.prestamo, .documentos, .descripcion, .fecha')
                            .addClass('alinearIzquierda');

                        $(tablaRegistros.document.body)
                            .find('.capital, .interes, .comision, .seguros, .mora, .monto')
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
        drawCallback: function() {

            let indicesColumnasSumar =
                window.innerWidth < 1024 ? [4] : [4, 5, 6, 7, 8, 9];

            setTimeout(function() {

                if (filtros = true) {

                    if (window.innerWidth > 992)
                        ocultarCabeceraTablaRegistros();

                }

            }, 100);

            cambiarTamanoTabla();

            let api = this.api();

            $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

            indicesColumnasSumar.forEach(function(indiceColumnaSumar) {

                columnaSumar = api.column(indiceColumnaSumar, { page: 'current' });

                sumaColumnaSumar = columnaSumar.data().sum();

                $(columnaSumar.footer()).html(textoFormatoNumerico([sumaColumnaSumar + ''], 2))

            });

        },

        responsive: true,
        deferRender: true,

        order: window.innerWidth < 922 ? [5, 'desc'] : [10, 'desc'],

        initComplete: function() {

            $('#tablaRegistros').on('column-visibility.dt', function() {

                ocultarCabeceraTablaRegistros();

            });

        }

    });

    // Cambiar color de las columnas al pasar el ratón por encima y al presionarlo
    $('#tablaRegistros tbody').on('click', 'tr', function() {

        // if ($('.accionVer').is(':hover')) return;

        if ($(this).hasClass('seleccionada')) {

            $(this).removeClass('seleccionada');

        } else {

            $('#tablaRegistros').DataTable().$('tr.seleccionada').removeClass('seleccionada');

            $(this).addClass('seleccionada');

        }

    });

    if (filtros = true) {

        if (window.innerWidth < 992) {

            let configuracionFecha = {
                id: '#filtroFechaDesde',
                rango: true,
                anoMinimo: 1753,
                anoMaximo: 3000,
                fechaInicial: moment(),
                fechaFinal: moment(),
                fechaMinima: moment('01/01/1753', formatoFecha),
                fechaMaxima: moment('01/01/3000', formatoFecha),

                rangosFecha: {
                    'Hoy': [moment(), moment()],
                    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Esta semana': [moment().startOf('week'), moment()],
                    'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
                    // 'Semana pasada': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                    'Este mes': [moment().startOf('month'), moment()],
                    'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
                    // 'Mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Este año': [moment().startOf('year'), moment()],
                    'Último año': [moment().subtract(1, 'year'), moment()],
                    // 'Año pasado': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                    'Todo el tiempo': [moment('01/01/1753', formatoFecha), moment('01/01/3000', formatoFecha)],
                },

                textos: {
                    format: formatoFecha,
                    separator: ' - ',
                    applyLabel: 'Aplicar',
                    cancelLabel: 'Limpiar',
                    fromLabel: 'desde',
                    toLabel: 'hasta',
                    customRangeLabel: 'Rango personalizado',
                    weekLabel: 'S',

                    daysOfWeek: [
                        'Dom.',
                        'Lun.',
                        'Mar.',
                        'Mié.',
                        'Jue.',
                        'Vie.',
                        'Sáb.'
                    ],

                    monthNames: [
                        'Enero',
                        'Febrero',
                        'Marzo',
                        'Abril',
                        'Mayo',
                        'Junio',
                        'Julio',
                        'Agosto',
                        'Septiembre',
                        'Octubre',
                        'Noviembre',
                        'Diciembre'
                    ],

                    firstDay: 1,
                }
            };

            $(configuracionFecha.id).daterangepicker({
                singleDatePicker: !configuracionFecha.rango,
                showDropdowns: true,
                minYear: configuracionFecha.anoMinimo,
                maxYear: configuracionFecha.anoMaximo,
                showWeekNumers: true,
                showISOWeekNumers: true,
                autoApply: false,
                autoUpdateInput: true,
                alwaysShowCalendars: false,
                parentEl: 'body',
                startDate: configuracionFecha.fechaInicial,
                endDate: configuracionFecha.fechaFinal,
                minDate: configuracionFecha.fechaMinima,
                maxDate: configuracionFecha.fechaMaxima,
                opens: 'center',
                drops: 'down',
                buttonClasses: 'btn btn-sm',
                applyButtonClasses: 'btn-primary',
                cancelClass: 'btn-default',
                ranges: configuracionFecha.rangosFecha,
                locale: configuracionFecha.textos
            });

            let configuracionDialogo = {
                titulo: 'Filtro de Fecha Personalizado',
                html: '',
                ancho: '100%',
                relleno: '0',
                color: '#000',
                colorFondo: '#fff',
                botonConfirmar: true,
                botonDenegar: false,
                botonCancelar: false,
                textoBotonConfirmar: 'Confirmar',
                textoBotonDenegar: 'No',
                textoBotonCancelar: 'Cancelar',
                colorBotonConfirmar: 'var(--bs-primary)',
                colorBotonDenegar: '#dd6b55',
                colorBotonCancelar: 'rgb(246 136 38 / 70%)',
                botonCerrar: true,
                reversarOrdenBotones: true
            }

            // ! Evento al mostrar el calendario del filtro de fechas
            $('#filtroFechaDesde').on('showCalendar.daterangepicker', function() {

                $('.daterangepicker').hide();
                $('.daterangepicker > *:not(.ranges)').remove();

            });

            // ! Evento al presionar clic en el último elemento del filtro de fechas
            $('.ranges li:last-child').on('click', function() {

                // + Asignando fechas actuales seleccionadas en el filtro de fechas
                fechaDesde = $('#filtroFechaDesde').data('daterangepicker').startDate.format('YYYY-MM-DD');
                fechaHasta = $('#filtroFechaDesde').data('daterangepicker').endDate.format('YYYY-MM-DD');

                // + Estructura HTML del dialogo para el rango de fechas personalizado
                configuracionDialogo.html = `
                <div class="row m-0">
                    <div class="col-12 p-0">
                        <div class="row m-0">
                            <div class="col-6 p-0">
                                <input type="date" id="fechaDesde" class="form-control" min="1753-01-01" max="3000-01-01" value="${fechaDesde}">
                            </div>
                            <div class="col-6 p-0">
                                <input type="date" id="fechaHasta" class="form-control" min="${fechaDesde}" max="3000-01-01" value="${fechaHasta}">
                            </div>
                        </div>
                    </div>
                </div>
                `;

                // + Inicializando el dialogo para el rango de fechas personalizado
                Swal.mixin({}).fire({

                    title: configuracionDialogo.titulo,

                    // titleText: '',

                    html: configuracionDialogo.html,

                    // text: '',
                    // icon: undefined,
                    // iconColor: undefined,

                    width: configuracionDialogo.ancho,
                    padding: configuracionDialogo.relleno,
                    color: configuracionDialogo.color,
                    background: configuracionDialogo.colorFondo,

                    // position: 'center',

                    // grow: 'false',

                    // heightAuto: true,

                    showConfirmButton: configuracionDialogo.botonConfirmar,
                    showDenyButton: configuracionDialogo.botonDenegar,
                    showCancelButton: configuracionDialogo.botonCancelar,
                    confirmButtonText: configuracionDialogo.textoBotonConfirmar,
                    denyButtonText: configuracionDialogo.textoBotonDenegar,
                    cancelButtonText: configuracionDialogo.textoBotonCancelar,
                    confirmButtonColor: configuracionDialogo.colorBotonConfirmar,
                    denyButtonColor: configuracionDialogo.colorBotonDenegar,
                    cancelButtonColor: configuracionDialogo.colorBotonCancelar,
                    showCloseButton: configuracionDialogo.botonCerrar,

                    // buttonsStyling: true,

                    reverseButtons: configuracionDialogo.reversarOrdenBotones

                });

                // + Evento al cambiar los valores en el campo #fechaDesde del dialogo para el rango de fechas personalizado
                $('#fechaDesde').off().on('change', function() {

                    // ? Asignando la fecha inicial
                    fechaDesde = $('#fechaDesde').val();

                    // ? Asignando mínimo de fecha para el campo #fechaHasta
                    $('#fechaHasta').attr('min', fechaDesde);

                    // ? Asignando la fecha final
                    fechaHasta =
                        // * Operación ternaria para identificar si la fecha inicial es mayor a la fecha final
                        (fechaDesde.replaceAll('-', '') > $('#fechaHasta').val().replaceAll('-', '')) ?
                        fechaDesde : $('#fechaHasta').val();

                    // ? Asignando la fecha final al campo fechaHasta
                    $('#fechaHasta').val(fechaHasta)

                });

                // ! Evento al presionar clic en el botón .swal2-confirm del dialogo para el rango de fechas personalizado
                $('.swal2-confirm').off().on('click', function() {

                    // ? Asignando la fecha inicial al filtro de fechas
                    $('#filtroFechaDesde').data('daterangepicker').setStartDate(
                        moment($('#fechaDesde').val()).format('DD/MM/YYYY')
                    );

                    // ? Asignando la fecha final al filtro de fechas
                    $('#filtroFechaDesde').data('daterangepicker').setEndDate(
                        moment($('#fechaHasta').val()).format('DD/MM/YYYY')
                    );

                })

            });

        } else {

            // TODO: Script del Date Range Picker
            let
                fechaDesde = moment('01/01/1922').format('DD/MM/YYYY'),
                fechaHasta = moment();

            filtroFecha('#filtroFechaDesde', fechaDesde, '01/01/1922', false, formatoFecha);
            filtroFecha('#filtroFechaHasta', fechaHasta, fechaDesde, false, formatoFecha);

            function filtroFecha(campoFecha, fecha, fechaMinima, fechaMaxima, formato) {

                $(campoFecha).daterangepicker({
                    singleDatePicker: true,
                    alwaysShowCalendars: true,
                    showDropdowns: true,
                    autoUpdateInput: true,
                    startDate: fecha,
                    minDate: fechaMinima,
                    maxDate: fechaMaxima,
                    drops: 'down',
                    opens: 'center',

                    locale: {
                        format: formato,
                        applyLabel: 'Aplicar',
                        cancelLabel: 'Limpiar',

                        daysOfWeek: [
                            'Dom.',
                            'Lun.',
                            'Mar.',
                            'Mié.',
                            'Jue.',
                            'Vie.',
                            'Sáb.'
                        ],

                        monthNames: [
                            'Enero',
                            'Febrero',
                            'Marzo',
                            'Abril',
                            'Mayo',
                            'Junio',
                            'Julio',
                            'Agosto',
                            'Septiembre',
                            'Octubre',
                            'Noviembre',
                            'Diciembre'
                        ],

                        firstDay: 1,
                    }

                });

            }

            $('#filtroFechaDesde').on('cancel.daterangepicker', function() {

                $(this).val('');

                filtroFecha(
                    '#filtroFechaHasta',
                    $('#filtroFechaHasta').val(),
                    '01/01/1922',
                    false,
                    formatoFecha
                );

                $('[name="tablaRegistros_length"]').val('-1').change();

            });

            $('#filtroFechaDesde').on('apply.daterangepicker', function() {

                filtroFecha(
                    '#filtroFechaHasta',
                    $('#filtroFechaHasta').val(),
                    $('#filtroFechaDesde').val(),
                    false,
                    formatoFecha
                );

            });

            $('#filtroFechaDesde').change(function() {

                filtroFecha(
                    '#filtroFechaHasta',
                    $('#filtroFechaHasta').val(),
                    $('#filtroFechaDesde').val(),
                    false,
                    formatoFecha
                );

            });

            $('#filtroFechaHasta').on('cancel.daterangepicker', function() {

                $(this).val(moment().format('DD/MM/YYYY'));

                filtroFecha(
                    '#filtroFechaHasta',
                    moment().format('DD/MM/YYYY'),
                    ($('#filtroFechaDesde').val()) ? $(this).val() : '01/01/1922',
                    false,
                    formatoFecha
                );

            });
            // TODO: Script del Date Range Picker

            mascaraFecha(['#filtroFechaDesde', '#filtroFechaHasta']);

        }

        $('#botonBuscar').on('click', function() {

            datosImpresion.fecha = moment().format('DD/MM/YYYY');
            datosImpresion.hora = moment().format('hh:mm');

            let
                filtroFechaDesde,
                filtroFechaHasta,
                formatoFechaConsulta,
                filtroFechaDesdeFormateado,
                filtroFechaHastaFormateado;

            filtroFechaDesde = window.innerWidth < 992 ? $('#filtroFechaDesde').data('daterangepicker').startDate : $('#filtroFechaDesde').val();
            filtroFechaHasta = window.innerWidth < 992 ? $('#filtroFechaDesde').data('daterangepicker').endDate : $('#filtroFechaHasta').val();
            console.log(filtroFechaDesde, filtroFechaHasta);
            formatoFechaConsulta = 'YYYYMMDD';

            filtroFechaDesdeFormateado =
                (filtroFechaDesde) ?
                moment(filtroFechaDesde, formatoFecha).format(formatoFechaConsulta) :
                '';
            filtroFechaHastaFormateado = moment(filtroFechaHasta, formatoFecha).format(formatoFechaConsulta);

            cuenta = {
                numero: $('#filtroNumeroCuenta').val(),
                tipo: $('#filtroTipoCuenta').val()
            }

            consulta =
                "EXEC [appmovil].[p_traer_registros] " +
                "'{idUsuario}', " +
                "'PRESTAMOS', " +
                "'" + filtroFechaDesdeFormateado + "', " +
                "'" + filtroFechaHastaFormateado + "', " +
                "'" + cuenta.numero + "', " +
                "'" + cuenta.tipo + "'";

            tablaRegistros.ajax.url(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select').load();

        });

    }

    // Filtros
    $('#botonBuscar').on('click', function() {

        datosImpresion.fecha = moment().format('DD/MM/YYYY');
        datosImpresion.hora = moment().format('hh:mm');

        let
            filtroFechaDesde,
            filtroFechaHasta,
            formatoFechaConsulta,
            filtroFechaDesdeFormateado,
            filtroFechaHastaFormateado;

        filtroFechaDesde = window.innerWidth < 992 ? $('#filtroFechaDesde').data('daterangepicker').startDate : $('#filtroFechaDesde').val();
        filtroFechaHasta = window.innerWidth < 992 ? $('#filtroFechaDesde').data('daterangepicker').endDate : $('#filtroFechaHasta').val();

        formatoFechaConsulta = 'YYYYMMDD';

        filtroFechaDesdeFormateado =
            (filtroFechaDesde) ?
            moment(filtroFechaDesde, formatoFecha).format(formatoFechaConsulta) :
            '';
        filtroFechaHastaFormateado = moment(filtroFechaHasta, formatoFecha).format(formatoFechaConsulta);

        cuenta = {
            numero: $('#filtroNumeroCuenta').val(),
            tipo: $('#filtroTipoCuenta').val()
        }

        consulta =
            "EXEC [appmovil].[p_traer_registros] " +
            "'{idUsuario}', " +
            "'PRESTAMOS', " +
            "'" + filtroFechaDesdeFormateado + "', " +
            "'" + filtroFechaHastaFormateado + "', " +
            "'" + cuenta.numero + "', " +
            "'" + cuenta.tipo + "'";

        tablaRegistros.ajax.url(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select').load();

    });

    function cambiarTamanoTabla() {

        $('#tablaRegistros').css('width', '100%')

    }

    // TODO: /Script del Data Table

    // TODO: Script del Date Range Picker

    function filtroFecha(campoFecha, fecha, fechaMinima, fechaMaxima, formato) {

        $(campoFecha).daterangepicker({
            singleDatePicker: true,
            alwaysShowCalendars: true,
            showDropdowns: true,
            autoUpdateInput: true,
            startDate: fecha,
            minDate: fechaMinima,
            maxDate: fechaMaxima,
            drops: 'down',
            opens: 'center',

            locale: {
                format: formato,
                applyLabel: 'Aplicar',
                cancelLabel: 'Limpiar',

                daysOfWeek: [
                    'Dom.',
                    'Lun.',
                    'Mar.',
                    'Mié.',
                    'Jue.',
                    'Vie.',
                    'Sáb.'
                ],

                monthNames: [
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ],

                firstDay: 1,
            }

        });

    }

    $('#filtroFechaDesde').on('cancel.daterangepicker', function() {

        $(this).val('');

        filtroFecha(
            '#filtroFechaHasta',
            $('#filtroFechaHasta').val(),
            '01/01/1922',
            false,
            formatoFecha
        );

        $('[name="tablaRegistros_length"]').val('-1').change();

    });

    $('#filtroFechaDesde').on('apply.daterangepicker', function() {

        filtroFecha(
            '#filtroFechaHasta',
            $('#filtroFechaHasta').val(),
            $('#filtroFechaDesde').val(),
            false,
            formatoFecha
        );

    });

    $('#filtroFechaDesde').change(function() {

        filtroFecha(
            '#filtroFechaHasta',
            $('#filtroFechaHasta').val(),
            $('#filtroFechaDesde').val(),
            false,
            formatoFecha
        );

    });

    $('#filtroFechaHasta').on('cancel.daterangepicker', function() {

        $(this).val(moment().format('DD/MM/YYYY'));

        filtroFecha(
            '#filtroFechaHasta',
            moment().format('DD/MM/YYYY'),
            ($('#filtroFechaDesde').val()) ? $(this).val() : '01/01/1922',
            false,
            formatoFecha
        );

    });
    // TODO: Script del Date Range Picker

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

        clearTimeout(tiempoocultarCabeceraTablaRegistros);

        tiempoocultarCabeceraTablaRegistros = setTimeout(function() {

            $("#tablaRegistros > thead > tr").css('display', 'none');

        }, 200);

    }

    function mascaraFecha(campos) {

        campos.forEach(campo => {

            IMask(document.querySelector(campo), {
                mask: Date,
                pattern: formatoFecha,
                lazy: false,
                min: new Date(1922, 0, 1),
                max: new Date(2122, 0, 1),

                format: function(fecha) {
                    return moment(fecha).format(formatoFecha);
                },
                parse: function(texto) {
                    return moment(texto, formatoFecha);
                },

                blocks: {
                    YYYY: {
                        mask: IMask.MaskedRange,
                        from: 1922,
                        to: 2122
                    },
                    MM: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 12
                    },
                    DD: {
                        mask: IMask.MaskedRange,
                        from: 1,
                        to: 31
                    },
                    HH: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 23
                    },
                    mm: {
                        mask: IMask.MaskedRange,
                        from: 0,
                        to: 59
                    }
                }
            });

        });

        $('#tablaRegistros').DataTable().on('xhr', function() {

            json = $('#tablaRegistros').DataTable().ajax.json();

        });

    }

    // menor a 1024px

    if (window.innerWidth < 1024) {

        $('#tablaRegistros tbody').on('click', 'tr:has(>td:not([class="dataTables_empty"]))', function() {

            if ($(this).hasClass('seleccionada')) {

                prestamo = {
                    documento: $(this).find('.documento').text().trim(),
                    numero: $(this).find('.prestamo').text().trim()
                };

                json.forEach(registro => {

                    if (registro.documentos == prestamo.documento && registro.cuenta == prestamo.numero) {

                        prestamo.capital = textoFormatoNumerico([registro.capital], 2);
                        prestamo.interes = textoFormatoNumerico([registro.interes], 2);
                        prestamo.comision = textoFormatoNumerico([registro.comision], 2);
                        prestamo.seguro = textoFormatoNumerico([registro.seguros], 2);
                        prestamo.mora = textoFormatoNumerico([registro.mora], 2);

                    }

                });

                Swal.mixin({}).fire({

                    title: '',
                    html: '<div class="card" style="margin:0;font-size:10px"><div class="card-body" style="padding:0"><h5 class="card-title" style="text-align:left;background-color:var(--bs-primary);color:#fff;padding:14px 0 14px 14px">Detalles</h5><div class="card-subtitle" style="text-align:left;color:#fff;background:var(--bs-primary);padding:0 14px;margin:5px;border-radius:8px"><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Capital:</div><div class="col-6" style="text-align:right">' + prestamo.capital + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Interés:</div><div class="col-6" style="text-align:right">' + prestamo.interes + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Comisión:</div><div class="col-6" style="text-align:right">' + prestamo.comision + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Seguro:</div><div class="col-6" style="text-align:right">' + prestamo.seguro + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Mora:</div><div class="col-6" style="text-align:right">' + prestamo.mora + '</div></div></div></div></div></div>',
                    width: '100%',
                    height: '100%',
                    padding: '0',
                    background: '#fff',
                    grow: true,
                    showConfirmButton: false,
                    showCloseButton: true

                })

            }

        });

    }

});