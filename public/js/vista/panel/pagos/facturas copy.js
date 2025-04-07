$(function() {

    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var cuenta, consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script de los filtros
    // * Datos del filtro tipo cuenta
    consulta = "EXEC  [appmovil].[p_traer_filtros_registros] '{idUsuario}', 'FACTURAS';";

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
        "'FACTURAS', " +
        "'', " +
        "'{filtroFechaHasta}';" :
        "EXEC [appmovil].[p_traer_registros] " +
        "'{idUsuario}', " +
        "'FACTURAS', " +
        "'{filtroFechaDesde}', " +
        "'{filtroFechaHasta}';";

    // * Inicializando tabla de registros
    var tablaRegistros = $('#tablaRegistros').DataTable({

        // * Consultando registros desde la base de datos con ajax y json
        ajax: {
            type: 'GET',
            url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
            dataType: 'JSON',
            dataSrc: ''
        },

        columns: [{
                data: 'documento',
                render: $.fn.dataTable.render.number(',', '.', 0, '')
            },
            { data: 'descripcion' },
            { data: 'concepto' },
            { data: 'fecha', orderable: false },
            { data: 'monto', render: $.fn.dataTable.render.number(',', '.', 2, '') },
        ],

        columnDefs: [{
                targets: 0,
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).css('text-align', 'left');

                }
            },
            {
                targets: 1,
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).css('text-align', 'left');

                }
            },
            {
                targets: 2,
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).css('text-align', 'left');

                }
            },
            {
                targets: 4,
                createdCell: function(td, cellData, rowData, row, col) {

                    $(td).css('text-align', 'right');

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

                        $(tablaRegistros.document.body)
                            .css('background-color', '#fff');

                        $(tablaRegistros.document.body)
                            .find('h1')
                            .before(
                                '<div class="container">' +
                                '<div class="row">' +
                                '<div class="col-8">' +
                                '<h1 class="text-uppercase m-0">' + datosImpresion.empresa + '</h1>' +
                                '<p class="text-uppercase m-0">' + datosImpresion.direccion + '</p>' +
                                '<p class="m-0">Teléfono: ' + datosImpresion.telefono + '</p>' +
                                '<p class="m-0">RNC: ' + datosImpresion.RNC + '</p>' +
                                '</div>' +
                                '<div class="col-4">' +
                                '<div class="row">' +
                                '<div class="col-12 p-0"><p class="m-0">Fecha: ' + datosImpresion.fecha + '</p></div>' +
                                '<div class="col-12"><p class="m-0">Hora: ' + datosImpresion.hora + '</p></div>' +
                                '<div class="col-12"><p class="m-0">Usuario: ' + datosImpresion.usuario + '</p></div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="card">' +
                                '<div class="card-body">' +
                                '<h2>Registros de ' + document.title + '</h2>' +
                                '</div>' +
                                '</div>'
                            );

                        $(tablaRegistros.document.body)
                            .find('h1')
                            .css('font-size', '28px');

                        $(tablaRegistros.document.body)
                            .find('.izquierda')
                            .attr('style', 'text-align: left !important');

                        $(tablaRegistros.document.body)
                            .find('.centro')
                            .attr('style', 'text-align: center !important');

                        $(tablaRegistros.document.body)
                            .find('.derecha')
                            .attr('style', 'text-align: right !important');

                        $(tablaRegistros.document.body)
                            .find('.container')
                            .css('width', '100%')
                            .css('min-width', '100%')
                            .css('max-width', '100%')
                            .css('margin', '0');

                        $(tablaRegistros.document.body)
                            .find('.row')
                            .css('display', 'flex')
                            .css('justify-content', 'center')
                            .css('align-items', 'center')
                            .css('margin', '0');

                        $(tablaRegistros.document.body)
                            .find('.row > div')
                            .css('margin', '0')
                            .css('padding', '0');

                        $(tablaRegistros.document.body)
                            .find('.col-4')
                            .css('display', 'table')
                            .css('border', '1px solid var(--bs-primary)')
                            .css('border-radius', '10px');

                        $(tablaRegistros.document.body)
                            .find('.col-4 > *')
                            .css('display', 'table-cell')
                            .css('vertical-align', 'middle');

                        $(tablaRegistros.document.body)
                            .find('.col-4 > .row')
                            .css('padding', '0 10px');

                        $(tablaRegistros.document.body)
                            .find('.col-4 > .row > *')
                            .css('text-align-last', 'justify');

                        $(tablaRegistros.document.body)
                            .find('.col-4 > .row > :nth-child(1)')
                            .css('padding-top', '15px');

                        $(tablaRegistros.document.body)
                            .find('.card')
                            .css('width', '98%')
                            .css('margin-top', '10px')
                            .css('margin-left', '7.5px')
                            .css('margin-bottom', '-15.4px')
                            .css('border-bottom', '1px solid #fff')
                            .css('border-radius', '10px 10px 0 0')
                            .css('background-color', 'var(--bs-primary)');

                        $(tablaRegistros.document.body)
                            .find('.card > .card-body')
                            .css('margin', '0')
                            .css('padding', '0');

                        $(tablaRegistros.document.body)
                            .find('.card > .card-body > h2')
                            .css('padding-top', '10px')
                            .css('font-size', '16px')
                            .css('font-weight', '700')
                            .css('text-align', 'center')
                            .css('text-transform', 'uppercase')
                            .css('color', '#fff');

                        $(tablaRegistros.document.body)
                            .find('table')
                            .css('padding', '8px')
                            .css('text-align', 'center')
                            .css('font-size', '14.5px')
                            .css('letter-spacing', '-0.5px');

                        $(tablaRegistros.document.body)
                            .find('thead')
                            .css('text-transform', 'capitalize');

                        $(tablaRegistros.document.body)
                            .find('thead, tfoot')
                            .css('padding', '2px')
                            .css('background-color', 'var(--bs-primary)')
                            .css('color', '#fff');

                        $(tablaRegistros.document.body)
                            .find('thead > tr:has(.derecha) > th, tfoot > tr:has(.derecha) > th')
                            .css('padding', '5.58333px 2.79167px');

                        $(tablaRegistros.document.body)
                            .find('tbody > tr')
                            .css('height', '22px');

                        $(tablaRegistros.document.body)
                            .find('.odd[role="row"]>td, .even[role="row"]>td')
                            .css('padding', '0 2.5px');

                        $(tablaRegistros.document.body)
                            .find('tbody > tr:nth-child(even)')
                            .css('background-color', '#ddd');

                        $(tablaRegistros.document.body)
                            .find('tbody > tr > td')
                            .css('padding', '2px')
                            .css('color', '#607080');

                        $(tablaRegistros.document.body)
                            .find('table')
                            .after(
                                '<div class="col-12"><span id="urlpagina">' + window.location + '</span></div>'
                            );

                        $(tablaRegistros.document.body)
                            .find('.col-12:has(> #urlpagina)')
                            .css('padding-right', '10px')
                            .css('text-align', 'right');

                    }

                }

            ]
        },

        // Función que se ejecuta cada vez que se cambia el HTML del contenido de la tabla
        drawCallback: function() {



            $(api.column(0, { page: 'current' }).footer()).html(api.rows({ page: 'current' }).count());

            // Columnas
            let columnaMonto = api.column(4, { page: 'current' });

            // Valores de las columnas sumadas
            let sumaColumnaMonto = columnaMonto.data().sum();

            // Pie de la columna monto
            $(columnaMonto.footer()).html(textoFormatoNumerico([sumaColumnaMonto]));

            ocultarCabeceraTablaRegistros();

        },

        responsive: true,
        deferRender: true,

        order: false,

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

        cuenta = {
            numero: '',
            tipo: $('#filtroTipoCuenta').val()
        }

        consulta =
            "EXEC [appmovil].[p_traer_registros] " +
            "'{idUsuario}', " +
            "'FACTURAS', " +
            "'" + filtroFechaDesdeFormateado + "', " +
            "'" + filtroFechaHastaFormateado + "', " +
            "'', " +
            "'" + cuenta.tipo + "';";

        tablaRegistros.ajax.url(rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select').load();

    });

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