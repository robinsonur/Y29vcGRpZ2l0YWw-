$(function() {

    let columnas =
        window.innerWidth < 1024 ? [
            'Sol. #',
            'Cuenta',
            'Fecha',
            'Estado',
            'Monto',
            ''
        ] : [
            'Solicitud #',
            'Cuenta',
            'Fecha',
            'Tipo de Retiro',
            'Estado',
            'Motivo',
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

    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

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

    consulta = `EXEC [appmovil].[p_traer_solicitudes_retiro_ahorros] '{idUsuario}'`;

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

            { data: 'id_solicitud' },
            { data: 'cuenta' },
            { data: 'fecha', orderData: 5 },
            { data: 'estado' },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }

        ] : [

            { data: 'id_solicitud' },
            { data: 'cuenta' },
            { data: 'fecha', orderData: 7 },
            { data: 'tipo_retiro' },
            { data: 'estado' },
            { data: 'motivo' },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
            { data: 'fecha_orden', visible: false }

        ],

        columnDefs: window.innerWidth < 1024 ? [{
            targets: 0,
            className: 'id_solicitud',
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
            className: 'cuenta',
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

                td.textContent = new Date(td.textContent).toLocaleDateString('uk').replaceAll('.', '/')

                $(td).addClass('alinearIzquierda');

                $(`
                    .dataTable > thead > tr > th:nth-child(${col + 1}),
                    .dataTable > tfoot > tr > th:nth-child(${col + 1})
                `).addClass('alinearIzquierda')

            }
        },
        {
            targets: 3,
            className: 'estado',
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
        }
        ] : [{
            targets: 0,
            className: 'id_solicitud',
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
            className: 'cuenta',
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

                td.textContent = new Date(td.textContent).toLocaleDateString('uk').replaceAll('.', '/')

                $(td).addClass('alinearIzquierda');

                $(`
                    .dataTable > thead > tr > th:nth-child(${col + 1}),
                    .dataTable > tfoot > tr > th:nth-child(${col + 1})
                `).addClass('alinearIzquierda')

            }
        },
        {
            targets: 3,
            className: 'tipo_retiro',
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
            className: 'estado',
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
            className: 'motivo',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearIzquierda');

                $(`
                    .dataTable > thead > tr > th:nth-child(${col + 1}),
                    .dataTable > tfoot > tr > th:nth-child(${col + 1})
                `).addClass('alinearIzquierda')

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
                                columns: [0, 1, 2, 3, 4, 5, 6],

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
                                columns: [0, 1, 2, 3, 4, 5, 6],

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
                                columns: [0, 1, 2, 3, 4, 5, 6],

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
                        columns: [0, 1, 2, 3, 4, 5, 6],

                        modifier: {
                            page: 'current'
                        }

                    },

                    footer: true,

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
                            .find('.certificado, .descripcion, .fecha, .tiempo, .fechaFinalizar, .ultimaActividad')
                            .addClass('alinearIzquierda');

                        $(tablaRegistrosDialogo.document.body)
                            .find('.tasa, .monto, .interesPago, .balance')
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

            ]
        },

        // Función que se ejecuta cada vez que se cambia el HTML del contenido de la tabla
        drawCallback: function() {

            let indicesColumnasSumar =
                window.innerWidth < 1024 ? [4] : [6];

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

        order: window.innerWidth < 992 ? [5, 'desc'] : [7, 'desc'],

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

    function cambiarTamanoTabla() {

        $('#tablaRegistros').css('width', '100%')

    }

    // TODO: /Script del Data Table

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

    $('#tablaRegistros').DataTable().on('xhr', function() {

        json = $('#tablaRegistros').DataTable().ajax.json();

    });

});