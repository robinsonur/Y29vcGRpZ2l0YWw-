$(function() {

    let columnas =
        window.innerWidth < 1024 ? [
            'Línea',
            'Fecha',
            'Tasa',
            'Monto',
            'Balance',
            ''
        ] : [
            'Línea',
            'Fecha',
            'Tiempo',
            'Vencimiento',
            'Última Actividad',
            'Tasa',
            'Monto',
            'Balance',
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

    if (window.innerWidth > 992) {

        // * Agregando a la cabecera los nombres de las columnas de los registros
        $('#tablaRegistros > thead > tr')
            .append(
                '<th>Acciones</th>'
            );

        // * Agregando en el pie los nombres de las columnas de los registros
        $('#tablaRegistros > tfoot > tr')
            .append(
                '<th></th>'
            );

    }

    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script del Data Table
    // * Textos a mostrar en la tabla de registros
    let idioma = {
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
        "EXEC [appmovil].[p_traer_cuentas] " +
        "'{idUsuario}', " +
        "'LINEAS_CREDITO', " +
        "'', " +
        "'{filtroFechaHasta}';" :
        "EXEC [appmovil].[p_traer_cuentas] " +
        "'{idUsuario}', " +
        "'LINEAS_CREDITO', " +
        "'', " +
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
            { data: 'cuenta' },
            { data: 'fecha', orderData: 5 },
            { data: 'tasa', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }
        ] : [
            { data: 'cuenta' },
            { data: 'fecha', orderData: 9 },
            { data: 'tiempo' },
            { data: 'fecha_finalizar', orderable: false },
            { data: 'ultima_actividad', orderable: false },
            { data: 'tasa', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            {
                data: 'cuenta',
                render: function(data, type, rowData, meta) {

                    return '<button class="btn btn-secondary accionVer" value="' + data + '">Ver</button>'

                }
            },
            { data: 'fecha_orden', visible: false }
        ],

        columnDefs: window.innerWidth < 1024 ? [{
                targets: 0,
                className: 'linea',
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
                className: 'tasa',
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
                targets: 4,
                className: 'balance',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearDerecha');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

                }
            }
        ] : [{
                targets: 0,
                className: 'linea',
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
                className: 'tiempo',
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
                className: 'vencimiento',
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
                className: 'ultimaActividad',
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).addClass('alinearIzquierda');

                    $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

                }
            },
            {
                targets: 5,
                className: 'tasa',
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
            },
            {
                targets: 8,
                className: 'alinearDerecha',
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
                        columns: [0, 1, 2, 3, 4, 5, 6, 7],

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
                            .find('.linea, .fecha, .tiempo, .vencimiento, .ultimaActividad')
                            .addClass('alinearIzquierda');

                        $(tablaRegistros.document.body)
                            .find('.tasa, .monto, .balance')
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
                window.innerWidth < 1024 ? [3, 4] : [6, 7];

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

            ocultarCabeceraTablaRegistros();

        },

        responsive: true,
        deferRender: true,

        order: window.innerWidth < 992 ? [5, 'desc'] : [9, 'desc'],

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

        consulta =
            "EXEC [appmovil].[p_traer_cuentas] " +
            "'{idUsuario}', " +
            "'LINEAS_CREDITO', " +
            "'" + filtroFechaDesdeFormateado + "', " +
            "'" + filtroFechaHastaFormateado + "';";

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
                        '<th>Documento</th>' +
                        '<th>Descripción</th>' +
                        '<th>Fecha</th>' +
                        '<th>Capital</th>' +
                        '<th>Interés</th>' +
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
                    "'LINEA', " +
                    "'', " +
                    "'', " +
                    "'" + this.value + "', " +
                    "'', " +
                    "'', " +
                    "'PANTALLA_MODAL'";

                $('#tablaRegistrosDialogo').DataTable({

                    ajax: {
                        type: 'GET',
                        url: `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta` + '?consulta=' + consulta + '&tipoConsulta=select',
                        dataType: 'JSON',
                        dataSrc: ''
                    },

                    columns: [
                        { data: 'numero_documento' },
                        { data: 'descripcion_tipo' },
                        { data: 'fecha', orderData: 7 },
                        { data: 'capital', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                        { data: 'interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
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
                                `).addClass('alinearIzquierda')

                            }
                        },
                        {
                            targets: 1,
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
                            targets: 2,
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
                            targets: 3,
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
                            targets: 4,
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
                            targets: 5,
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
                    ],

                    lengthChange: false,

                    searching: false,

                    ordering: true,

                    paging: false,

                    autoWidth: true,

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
                                    .find('.documento, descripcion, fecha')
                                    .addClass('alinearIzquierda');

                                $(tablaRegistrosDialogo.document.body)
                                    .find('.capital, .interes, .mora, .monto')
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

                    order: [7, 'desc'],

                    drawCallback: function() {

                        // ! Declaración de variables
                        let api, indicesColumnasSumar;

                        api = this.api();

                        $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

                        indicesColumnasSumar = [3, 4, 5, 6];

                        indicesColumnasSumar.forEach(function(indiceColumnaSumar) {

                            columnaSumar = api.column(indiceColumnaSumar, { page: 'current' });

                            sumaColumnaSumar = columnaSumar.data().sum();

                            $(columnaSumar.footer()).html(textoFormatoNumerico([sumaColumnaSumar + ''], 2))

                        });

                    },

                });

            })

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

    }

    $('#tablaRegistros').DataTable().on('xhr', function() {

        json = $('#tablaRegistros').DataTable().ajax.json();

    });

    // menor a 1024px

    if (window.innerWidth < 1024) {

        $('#tablaRegistros tbody').on('click', 'tr:has(>td:not([class="dataTables_empty"]))', function() {

            if ($(this).hasClass('seleccionada')) {

                linea = {
                    numero: $(this).find('.linea').text()
                };

                json.forEach(registro => {

                    if (registro.cuenta == linea.numero) {

                        linea.tiempo = registro.tiempo.trim();
                        linea.ultimaActividad = registro.ultima_actividad.trim();
                        linea.fechaFinalizar = registro.fecha_finalizar.trim();

                    }

                });

                Swal.mixin({}).fire({

                    title: '',
                    html: '<div class="card" style="margin:0;font-size:10px"><div class="card-body" style="padding:0"><h5 class="card-title" style="text-align:left;background-color:var(--bs-primary);color:#fff;padding:14px 0 14px 14px">Detalles</h5><div class="card-subtitle" style="text-align:left;color:#fff;background:var(--bs-primary);padding:0 14px;margin:5px;border-radius:8px"><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Tiempo:</div><div class="col-6" style="text-align:right">' + linea.tiempo + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Última Actividad:</div><div class="col-6" style="text-align:right">' + linea.ultimaActividad + '</div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6">Fecha a Finalizar:</div><div class="col-6" style="text-align:right">' + linea.fechaFinalizar + '</div></div></div></div></div><div class="card-text" style="text-align:left;padding:0 14px;margin:5px;overflow:scroll;height:226px"></div></div></div>',
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
                    "'LINEA', " +
                    "'', " +
                    "'', " +
                    "'" + linea.numero + "', " +
                    "'', " +
                    "'', " +
                    "'PANTALLA_MODAL', " +
                    "'';";

                $.post(
                    rutaConsulta + '2?' +
                    '_token=' + $('[name="_token"]').val() +
                    '&consulta=' + consulta +
                    '&tipoConsulta=select',
                    function(registros) {

                        registros.forEach(registro => {

                            $('.card-text')
                                .last()
                                .append('<div><div class="row"><div class="col-12" style="font-weight:700">' + registro.descripcion_tipo.trim() + ' - ' + registro.fecha.trim() + '</div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Capital</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.capital]) + '</div></div></div><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Mora:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.mora]) + '</div></div></div></div></div></div><div class="row"><div class="col-12"><div class="row" style="align-items:center"><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Interés:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.interes]) + '</div></div></div><div class="col-6"><div class="row"><div class="col-6" style="padding-right:0">Monto:</div><div class="col-6" style="padding:0;text-align:right">' + textoFormatoNumerico([registro.monto]) + '</div></div></div></div></div></div></div>');

                        });

                    }
                );

            }

        });

    }

});