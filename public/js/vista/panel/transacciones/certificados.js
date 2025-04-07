$(async function() {

    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script de los filtros
    // * Datos del filtro número de cuenta
    consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'CERTIFICADOS', 'CUENTAS';";

    await $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',

        success: function(datos) {

            datos.forEach(dato => {

                $('#filtroNumeroCuenta').last().append('<option value="' + dato['numero_cuenta'] + '">' + dato['cuenta'] + '</option>');

            });

            let columnas =
                window.innerWidth < 1024 ? [
                    'Certificado',
                    'Tipo',
                    'Fecha',
                    'Débito',
                    'Crédito',
                    'Interés',
                    ''
                ] : [
                    'Certificado',
                    'Tipo',
                    'Documento',
                    'Descripción',
                    'Fecha',
                    'Débito',
                    'Crédito',
                    'Interés',
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
    consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'CERTIFICADOS', 'TIPO_CUENTAS';";

    $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',
        success: function(datos) {

            datos.forEach(dato => {

                $('#filtroTipoCuenta').last().append('<option value="' + dato['tipo_movimiento'] + '">' + dato['movimiento'] + '</option>');

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
        "'CERTIFICADOS', " +
        "'', " +
        "'{filtroFechaHasta}'" :
        "EXEC [appmovil].[p_traer_registros] " +
        "'{idUsuario}', " +
        "'CERTIFICADOS', " +
        "'{filtroFechaDesde}', " +
        "'{filtroFechaHasta}'";

    // * Inicializando tabla de registros
    var tablaRegistros = $('#tablaRegistros').DataTable({

        // * Consultando registros desde la base de datos con ajax y json
        ajax: {
            type: 'GET',
            url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
            dataType: 'JSON',
            dataSrc: ''
        },

        columns: window.innerWidth < 1024 ? [
            { data: 'numero_cuenta' },
            { data: 'tipo' },
            { data: 'fecha', orderData: 6 },
            { data: 'debito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'credito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }
        ] : [
            { data: 'numero_cuenta' },
            { data: 'tipo' },
            {
                data: 'documento',
                render: $.fn.dataTable.render.number(',', '.', 0, '')
            },
            { data: 'descripcion' },
            { data: 'fecha', orderData: 8 },
            { data: 'debito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'credito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'interes', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }
        ],

        columnDefs: window.innerWidth < 1024 ? [{
                targets: 0,
                className: 'certificado',
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
                className: 'tipo',
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
                className: 'debito',
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
                className: 'credito',
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
            }
        ] : [{
                targets: 0,
                className: 'certificado',
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
                className: 'tipo',
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
                targets: 5,
                className: 'debito',
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
                className: 'credito',
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
                className: 'interes',
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
                            .find('.certificado, .tipo, .documento, .descripcion, .fecha')
                            .addClass('alinearIzquierda');

                        $(tablaRegistros.document.body)
                            .find('.debito, .credito, .interes')
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
                window.innerWidth < 1024 ? [3, 4, 5] : [5, 6, 7];

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

        order: window.innerWidth < 992 ? [6, 'desc'] : [8, 'desc'],

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

        // Filtros
        $('#botonBuscar').on('click', function() {

            let
                filtroFechaDesde,
                filtroFechaHasta,
                formatoFechaConsulta,
                filtroFechaDesdeFormateado,
                filtroFechaHastaFormateado,
                cuenta;

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
                "'CERTIFICADOS', " +
                "'" + filtroFechaDesdeFormateado + "', " +
                "'" + filtroFechaHastaFormateado + "', " +
                "'" + cuenta.numero + "', " +
                "'" + cuenta.tipo + "'";

            tablaRegistros.ajax.url(rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select').load();

        });

    }

    function cambiarTamanoTabla() {

        $('#tablaRegistros').css('width', '100%')

    }

    // TODO: /Script del Data Table

    // TODO: Script del Date Range Picker
    let
        fechaDesde = (window.innerWidth < 1024) ? moment('01/01/1922').format('DD/MM/YYYY') : moment().subtract(12, 'month'),
        fechaHasta = moment();

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

    }

});