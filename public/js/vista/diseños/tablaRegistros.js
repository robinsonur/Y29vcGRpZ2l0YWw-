    // ! Declaración de variables
    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var cabeceraColumnasRegistros, rutaActual, empresa;
    var json;

    $(async function() {

        // * Arreglo para guardar las cabeceras de las columnas de los registros
        cabeceraColumnasRegistros = new Array();

        // * Ruta de la vista actual
        rutaActual = location.pathname;

        // ? Consultando los registros
        await $.ajax({
            url: rutaConsulta + '?consulta=' + consultaCabeceras + '&tipoConsulta=select',
            type: 'GET',
            dataType: 'JSON',

            // ? Ejecutar después de terminar la consulta
            success: function(registros) {

                let columnas =
                    window.innerWidth < 1024 ? [
                        'Préstamo',
                        'Fecha',
                        'T/CUO.',
                        'Monto',
                        'Pagado',
                        'Balance',
                        ''
                    ] : [
                        'Préstamo',
                        'Descripción',
                        'Fecha',
                        'Vencimiento',
                        'Último Pago',
                        'Monto',
                        'Tiempo',
                        'Tasa',
                        'Monto Cuota',
                        'Monto Pagado',
                        'Balance'
                    ];

                // ! Declaración de variables
                let indiceColumnaFormatear;

                indiceColumnaFormatear = 0;

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

                if (window.innerWidth > 1023 && rutaActual.includes('panel/prestamos')) {

                    // * Agregando a la cabecera los nombres de las columnas de los registros
                    $('#tablaRegistros > thead > tr')
                        .append(
                            '<th>Acciones</th><th></th>'
                        );

                    // * Agregando en el pie los nombres de las columnas de los registros
                    $('#tablaRegistros > tfoot > tr')
                        .append(
                            '<th></th><th></th>'
                        );
                }

            }

        });

        // * Textos a mostrar de la tabla de registros
        idioma = (idioma) ? idioma : {
            sLengthMenu: 'Mostrar _MENU_ registros',
            sSearch: 'Buscar:',

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

        // TODO: Script del Data Table
        // * Inicializando tabla de registros

        $('#tablaRegistros').DataTable({

            // Consulta de la base de datos
            ajax: {
                type: 'GET',
                url: rutaConsulta + '?consulta=' + consultaRegistros + '&tipoConsulta=select',
                dataType: 'JSON',
                dataSrc: ''
            },

            // Datos a mostrar
            columns: window.innerWidth < 1024 ? [
                { data: 'cuenta' },
                { data: 'fecha', orderData: 5 },
                {
                    data: 'tasa',
                    render: function(data, type, rowData) {
                        return textoFormatoNumerico([data], 2) + ' / ' + rowData.tiempo;
                    }
                },
                { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'monto_pagado', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'fecha_orden', visible: false }
            ] : [
                { data: 'cuenta' },
                { data: 'descripcion' },
                { data: 'fecha', orderData: 12 },
                { data: 'vencimiento', orderable: false },
                { data: 'ultima_actividad', orderable: false },
                { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'tiempo' },
                { data: 'tasa', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'monto_cuota', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'monto_pagado', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                {
                    data: 'cuenta',
                    orderable: false,
                    render: function(data, type, rowData, meta) {

                        return '<button class="btn btn-secondary accionVer" value="' + data + '">Ver</button>'

                    }
                },
                { data: 'fecha_orden', visible: false }
            ],

            columnDefs: window.innerWidth < 1024 ? [{
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
                    className: 'pagado',
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
                    className: 'ultimoPago',
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
                    targets: 6,
                    className: 'tiempo',
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
                    targets: 8,
                    className: 'montoCuota',
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
                    className: 'montoPagado',
                    createdCell: function(td, cellData, rowData, row, col) {

                        $(td).addClass('alinearDerecha');

                        $(`
                            .dataTable > thead > tr > th:nth-child(${col + 1}),
                            .dataTable > tfoot > tr > th:nth-child(${col + 1})
                        `).addClass('alinearDerecha')

                    }
                },
                {
                    targets: 10,
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
                    targets: 11,
                    className: 'acciones',
                    createdCell: function(td, cellData, rowData, row, col) {

                        $(td).addClass('alinearDerecha');

                        $(`
                            .dataTable > thead > tr > th:nth-child(${col + 1}),
                            .dataTable > tfoot > tr > th:nth-child(${col + 1})
                        `).addClass('alinearDerecha')

                    }
                }
            ],

            // Selector de cantidad registros a mostrar
            lengthChange: (selectorCantidadRegistros) ? false : true,

            lengthMenu: (opcionesSelectorCantidadRegistros) ? opcionesSelectorCantidadRegistros : [
                [10, 20, 40, 80, -1],
                [10, 20, 40, 80, 'Ꝏ']
            ],

            // Campo para filtrar registros
            searching: (campoFiltrarRegistros) ? false : true,

            // Orden descendente y ascendente
            ordering: true,

            // Paginación
            paging: (paginacion) ? false : true,

            // Texto de información
            info: (textoInformacion) ? false : true,

            // Autoajuste de tamaño para los registros
            autoWidth: false,

            // Tamaño de la tabla
            scrollY: (altoTablaRegistros) ? altoTablaRegistros : '15.378571428571428vw',
            scrollX: (desplazamientoHorizontal) ? false : true,

            // Textos a mostrar en la tabla
            language: idioma,

            // Estructura a mostrar de la tabla
            dom: (estructuraElementos) ? estructuraElementos : "<'row mb-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-2'B>>" +
                "<'row mb-3'<'col-sm-12'tr>>" +
                "<'row mb-3'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

            // Botones
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
                            columns: window.innerWidth < 1024 ?
                                ':visible' : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

                            modifier: {
                                page: 'current'
                            }

                        },

                        footer: true,

                        // Estilos para la impresión de los registros
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
                                .find('.prestamo, .descripcion, .fecha, .vencimiento, .ultimoPago')
                                .addClass('alinearIzquierda');

                            $(tablaRegistros.document.body)
                                .find('.monto, .tiempo, .tasa, .montoCuota, .montoPagado, .balance')
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

            // Ejecutar cada vez que se cambia el HTML del contenido de la tabla
            drawCallback: function() {

                setTimeout(function() {

                    if (filtros) {

                        if (window.innerWidth > 992)
                            ocultarCabeceraTablaRegistros();

                    }

                }, 100);

                cambiarTamanoTabla();

                // ! Declaración de variables
                let api;

                api = this.api();

                $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

                indicesColumnasSumar.forEach(function(indiceColumnaSumar) {

                    columnaSumar = api.column(indiceColumnaSumar, { page: 'current' });

                    sumaColumnaSumar = columnaSumar.data().sum();

                    $(columnaSumar.footer()).html(textoFormatoNumerico([sumaColumnaSumar + ''], 2))

                });

            },

            // Tabla autoajustable
            responsive: (tablaAutoajustable) ? true : false,
            deferRender: true,

            // Orden de los registros dependiendo el índice de la columna
            order: window.innerWidth < 992 ? [5, 'desc'] : [12, 'desc'],

            initComplete: (filtros) ? function() {

                $('#tablaRegistros').on('column-visibility.dt', function() {

                    ocultarCabeceraTablaRegistros();

                });

            } : null

        });
        // TODO: /Script del Data Table

        function cambiarTamanoTabla() {

            $('#tablaRegistros').css('width', '100%')

        }

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

        var formatoFecha = 'DD/MM/YYYY';

        if (filtros) {

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

                mascaraFecha(['#filtroFechaDesde', '#filtroFechaHasta']);

            }

            $('#botonBuscar').on('click', async function() {

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
                    "'PRESTAMOS', " +
                    "'" + filtroFechaDesdeFormateado + "', " +
                    "'" + filtroFechaHastaFormateado + "', " +
                    "'', " +
                    "'PC', " +
                    "'', " +
                    "'" + estado.value + "';";

                $('#tablaRegistros').DataTable().ajax.url(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select').load(function() {

                    json = $('#tablaRegistros').DataTable().ajax.json();

                });

            });

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

    });