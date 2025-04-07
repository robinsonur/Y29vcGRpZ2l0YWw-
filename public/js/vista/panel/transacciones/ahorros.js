$(function() {

            datosImpresion = {

                empresa: 'Coop Virtual',
                direccion: 'Av. 27 de febrero, sector las colinas no. 12 santiago',
                telefono: '809-578-0000',
                RNC: '1-24242-24244211',
                fecha: moment().format('DD/MM/YYYY'),
                hora: moment().format('hh:mm'),
                usuario: $('#nombreUsuario').text().trim(),

            }
            var urlConsultasregistros = location.protocol + '//' + location.host + location.pathname;

            // TODO: Script de los filtros
            // * Datos del filtro número de cuenta
            $.ajax({
                url: urlConsultasregistros + '/listaConsultasregistros?tipoDatos=numeroCuentas',
                type: 'GET',
                dataType: 'JSON',
                success: function(datos) {

                    datos.forEach(dato => {

                        $('#filtroNumeroCuenta').last().append('<option value="' + dato['numero_cuenta'] + '">' + dato['numero_cuenta'] + '</option>');

                    });

                }
            });
            // * Datos del filtro tipo cuenta
            $.ajax({
                url: urlConsultasregistros + '/listaConsultasregistros?tipoDatos=tipoCuentas',
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
            $('tbody').fadeOut();
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
                sLoadingRecords: function() {

                    $('tbody').fadeIn(500);

                },
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

            // * Inicializando tabla de registros
            var tablaRegistros = $('#tablaRegistros').DataTable({

                // * Consultando registros desde la base de datos con ajax y json
                ajax: {

                    type: 'GET',
                    url: urlConsultasregistros + '/listaConsultasregistros',
                    dataType: 'JSON',
                    dataSrc: ''

                },
                columns: [
                    { data: 'numero_cuenta' },
                    { data: 'tipo' },
                    {
                        data: 'documento',
                        render: $.fn.dataTable.render.number(',', '.', 0, '')
                    },
                    { data: 'descripcion' },
                    { data: 'fecha' },
                    { data: 'debito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'credito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                    { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') },
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

                dom: "<'row mb-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-4'f><'col-sm-12 col-md-2'B>><'row mb-3'<'col-sm-12'tr>><'row mb-3'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

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

                                    customize: function(tablaRegistros) {

                                        $(tablaRegistros.document.body)
                                            .find('h1')
                                            .css('margin', '8px 0 8px 8px')
                                            .css('font-size', '32px')
                                            .css('color', 'var(--bs-primary)');

                                        $(tablaRegistros.document.body)
                                            .css('background-color', '#fff');

                                        $(tablaRegistros.document.body)
                                            .find('table')
                                            .css('padding', '8px')
                                            .css('text-align', 'center')
                                            .css('font-size', '14.5px')
                                            .css('letter-spacing', '-0.5px');

                                        $(tablaRegistros.document.body)
                                            .find('thead, tfoot')
                                            .css('padding', '2px')
                                            .css('background-color', 'var(--bs-primary)')
                                            .css('color', '#fff');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr')
                                            .css('height', '22px');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr > td')
                                            .css('padding', '2px')
                                            .css('color', '#607080');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr:nth-child(even)')
                                            .css('background-color', '#ddd');

                                    },

                                    // Botón de exportar a PDF
                                    {
                                        extend: 'pdfHtml5',

                                        text: 'PDF',
                                        className: '',
                                        titleAttr: 'Exportar registros a PDF',

                                        exportOptions: {
                                            columns: ':visible',
                                            modifier: {
                                                page: 'current'
                                            }
                                        },
                                        footer: true,

                                        title: '',
                                        customize: function(documentoPdf) {
                                            documentoPdf.styles.title = {
                                                    color: 'var(--bs-primary)',
                                                    fontSize: '30'
                                                },
                                                documentoPdf.styles.tableHeader = {
                                                    fillColor: 'var(--bs-primary)',
                                                    color: 'white',
                                                    alignment: 'center'
                                                }
                                        }
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

                                        customize: function(tablaRegistros) {

                                            $(tablaRegistros.document.body)
                                                .find('h1')
                                                .css('margin', '8px 0 8px 8px')
                                                .css('font-size', '32px')
                                                .css('color', 'var(--bs-primary)');

                                            $(tablaRegistros.document.body)
                                                .css('background-color', '#fff');

                                            $(tablaRegistros.document.body)
                                                .find('table')
                                                .css('padding', '8px')
                                                .css('text-align', 'center')
                                                .css('font-size', '14.5px')
                                                .css('letter-spacing', '-0.5px');

                                            $(tablaRegistros.document.body)
                                                .find('thead, tfoot')
                                                .css('padding', '2px')
                                                .css('background-color', 'var(--bs-primary)')
                                                .css('color', '#fff');

                                            $(tablaRegistros.document.body)
                                                .find('tbody > tr')
                                                .css('height', '22px');

                                            $(tablaRegistros.document.body)
                                                .find('tbody > tr > td')
                                                .css('padding', '2px')
                                                .css('color', '#607080');

                                            $(tablaRegistros.document.body)
                                                .find('tbody > tr:nth-child(even)')
                                                .css('background-color', '#ddd');

                                        },

                                        // Botón de exportar a CSV
                                        {
                                            extend: 'csvHtml5',
                                            text: 'CSV',
                                            title: 'Titulo de tabla en CSV',
                                            titleAttr: 'Exportar registros a CSV',
                                            className: '',
                                            exportOptions: {
                                                columns: [0, 1, 2, 3, 4, 5]
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
                                    customize: function(tablaRegistros) {

                                        $(tablaRegistros.document.body)
                                            .find('h1')
                                            .css('margin', '8px 0 8px 8px')
                                            .css('font-size', '32px')
                                            .css('color', 'var(--bs-primary)');

                                        $(tablaRegistros.document.body)
                                            .css('background-color', '#fff');

                                        $(tablaRegistros.document.body)
                                            .find('table')
                                            .css('padding', '8px')
                                            .css('text-align', 'center')
                                            .css('font-size', '14.5px')
                                            .css('letter-spacing', '-0.5px');

                                        $(tablaRegistros.document.body)
                                            .find('thead, tfoot')
                                            .css('padding', '2px')
                                            .css('background-color', 'var(--bs-primary)')
                                            .css('color', '#fff');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr')
                                            .css('height', '22px');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr > td')
                                            .css('padding', '2px')
                                            .css('color', '#607080');

                                        $(tablaRegistros.document.body)
                                            .find('tbody > tr:nth-child(even)')
                                            .css('background-color', '#ddd');

                                    }
                                }

                            ]
                        },

                        // Función que se ejecuta cada vez que se cambia el HTML del contenido de la tabla
                        drawCallback: function() {

                            cambiarTamanoTabla();

                            let api = this.api();

                            $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

                            let columnaDebito = api.column(5, { page: 'current' });
                            let columnaCredito = api.column(6, { page: 'current' });

                            let sumaColumnaDebito = columnaDebito.data().sum();
                            let sumaColumnaCredito = columnaCredito.data().sum();

                            // Pie de la columna débito
                            $(columnaDebito.footer()).html(textoFormatoNumerico([sumaColumnaDebito]));

                            // Pie de la columna crédito
                            $(columnaCredito.footer()).html(textoFormatoNumerico([sumaColumnaCredito]));

                            ocultarCabeceraTablaRegistros();

                        },

                        responsive: true,

                        deferRender: true,

                        order: [
                            [0, 'desc']
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
                $('#botonBuscar').on('click', function() {

                    $('#tablaRegistros').fadeOut();

                    var filtroFechaDesde = $('#filtroFechaDesde').val();
                    var filtroFechaHasta = $('#filtroFechaHasta').val();

                    var ajaxUrl =
                        urlConsultasregistros +
                        '/listaConsultasregistros?' +
                        'filtroFechaDesde=' + filtroFechaDesde +
                        '&filtroFechaHasta=' + filtroFechaHasta +
                        '&filtroNumeroCuenta=' + $('#filtroNumeroCuenta').val() +
                        '&filtroTipoCuenta=' + $('#filtroTipoCuenta').val();

                    tablaRegistros.ajax.url(ajaxUrl).load(function() {

                        $('#tablaRegistros').fadeIn();

                    });

                });

                function cambiarTamanoTabla() {

                    $('#tablaRegistros').css('width', '100%')

                }

                // TODO: /Script del Data Table

                // TODO: Script del Date Range Picker
                var fechaDesde = moment().subtract(12, 'month');
                var fechaHasta = moment();
                var formatoFecha = 'DD/MM/YYYY';

                filtroFecha('#filtroFechaDesde', fechaDesde, false, false, formatoFecha);filtroFecha('#filtroFechaHasta', fechaHasta, fechaDesde, false, formatoFecha);

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
                        false,
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

                    filtroFecha(
                        '#filtroFechaHasta',
                        fechaHasta,
                        $('#filtroFechaDesde').val(),
                        false,
                        formatoFecha
                    )

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

                        $("#tablaRegistros > thead > tr, .dataTables_scrollBody > .table.dataTable > tfoot").css('display', 'none');

                    }, 200);

                }

            });