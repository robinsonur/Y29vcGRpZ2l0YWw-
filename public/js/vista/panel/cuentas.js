// ! Declaración de variables
var
    consulta,
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
    indicesColumnasSumar,
    filtros;

// * Consulta para los registros
consulta = `EXEC [appmovil].[p_traer_cuentas] '{idUsuario}', '${tipoCuenta == '' ? 'CUENTAS' : tipoCuenta}'`;

registrosFormatearNumero = [
    { indiceColumna: 0, decimales: 0 },
];


selectorCantidadRegistros = false;

campoFiltrarRegistros = false;

paginacion = true;

textoInformacion = false;

altoTablaRegistros = '15.378571428571428vw';

estructuraElementos = "<'row mb-3'<'col-sm-12 col-md-12'B>>";

ordenRegistros = [
    [0, 'desc']
]

tablaRegistrosFiltros = false;

indicesColumnasSumar =
    window.innerWidth < 992 ? [2, 3, 4] : [4, 5, 6]


// ! Declaración de variables
const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
var cabeceraColumnasRegistros, rutaActual;

$(async function() {

    // * Arreglo para guardar las cabeceras de las columnas de los registros
    cabeceraColumnasRegistros = new Array();

    // * Ruta de la vista actual
    rutaActual = location.pathname;

    // ? Consultando los registros
    await $.ajax({
        url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',

        // ? Ejecutar después de terminar la consulta
        success: function(registros) {

            // ! Declaración de variables
            let cabecerasTablaRegistros, iteracionCiclo, iteracion;

            // * Guardando el nombre cabecera de las columnas de los registros
            cabecerasTablaRegistros = (registros[0].NAME) ? registros : Object.keys(registros[0]);

            iteracionCiclo = 0;
            iteracion = 0;

            cabecerasTablaRegistros = window.innerWidth < 992 ? ['cuenta', 'descripcion', 'balance', 'bloqueado', 'disponible'] : ['cuenta', 'descripcion', 'fecha', 'ultima_actividad', 'balance', 'bloqueado', 'disponible'];

            // ? Ciclo para recorrer todas las columnas de los registros
            cabecerasTablaRegistros.forEach(cabeceraTablaRegistro => {

                if (registros[0].NAME) {

                    // * Agregando a la cabecera los nombres de las columnas de los registros
                    $('#tablaRegistros > thead > tr')
                        .append(
                            '<th>' + cabeceraTablaRegistro.NAME.replace('_', ' ', cabeceraTablaRegistro.NAME) + '</th>'
                        );

                    // * Agregando en el pie los nombres de las columnas de los registros
                    $('#tablaRegistros > tfoot > tr')
                        .append(
                            '<th></th>'
                        );

                    // * Añadiendo al arreglo las columnas a mostrar en la tabla de registros
                    cabeceraColumnasRegistros.push({ data: cabeceraTablaRegistro });

                } else {

                    // * Agregando a la cabecera los nombres de las columnas de los registros
                    $('#tablaRegistros > thead > tr')
                        .append(
                            '<th>' + cabeceraTablaRegistro.replace('_', ' ', cabeceraTablaRegistro).toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                return letter.toUpperCase();
                            }) + '</th>'
                        );

                    // * Agregando en el pie los nombres de las columnas de los registros
                    $('#tablaRegistros > tfoot > tr')
                        .append(
                            '<th></th>'
                        );

                    // * Añadiendo al arreglo las columnas a mostrar en la tabla de registros
                    cabeceraColumnasRegistros.push({ data: cabeceraTablaRegistro });

                }

                iteracionCiclo++;

            });

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
            url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
            dataType: 'JSON',
            dataSrc: ''
        },

        // Datos a mostrar
        columns: window.innerWidth < 992 ? [
            { data: 'cuenta' },
            { data: 'descripcion' },
            { data: 'balance', },
            { data: 'pignorado', },
            { data: 'disponible', },
        ] : [
            { data: 'cuenta' },
            {
                data: 'descripcion',
                render: function(data, type, rowData, meta) {
                    console.log(data);
                    return '<input value="' + rowData.renglon + '" hidden></input>' + data.split(' - ')[0]

                }
            },
            { data: 'fecha', orderable: false },
            { data: 'ultima_actividad', orderable: false },
            { data: 'balance', },
            { data: 'pignorado', },
            { data: 'disponible', },
        ],

        columnDefs: window.innerWidth < 992 ? [{
            targets: 0,
            className: 'cuenta',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearIzquierda');

                $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

            }
        }, {
            targets: 1,
            className: 'descripcion',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearIzquierda');

                $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearIzquierda')

            }
        }, {
            targets: 2,
            className: 'balance',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearDerecha');

                $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

            }
        }, {
            targets: 3,
            className: 'pignorado',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearDerecha');

                $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

            }
        }, {
            targets: 4,
            className: 'disponible',
            createdCell: function(td, cellData, rowData, row, col) {

                $(td).addClass('alinearDerecha');

                $(`
                        .dataTable > thead > tr > th:nth-child(${col + 1}),
                        .dataTable > tfoot > tr > th:nth-child(${col + 1})
                    `).addClass('alinearDerecha')

            }
        }] : [{
                targets: 0,
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
                targets: 4,
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
                targets: 5,
                className: 'bloqueado',
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
                className: 'disponible',
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
                            .find('.cuenta, .descripcion, .fecha')
                            .addClass('alinearIzquierda');

                        $(tablaRegistrosDialogo.document.body)
                            .find('.balance, .bloqueado, .disponible')
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

        // Ejecutar cada vez que se cambia el HTML del contenido de la tabla
        drawCallback: function() {

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
        order: (ordenRegistros) ? ordenRegistros : [
            [0, 'desc']
        ]

    });
    // TODO: /Script del Data Table

    function cambiarTamanoTabla() {

        $('#tablaRegistros').css('width', '100%')

    }


    // Cambiar color de las columnas al pasar el ratón por encima y al presionarlo

    if (window.innerWidth > 992) {

        $('#tablaRegistros tbody').on('click', 'tr', async function() {

            $('#estadoMensual, #botonEstado').removeAttr('hidden');
            $('.section:last-child').removeAttr('hidden');

            if ($(this).hasClass('seleccionada')) {

                $(this).removeClass('seleccionada');

                $('#estadoMensual, #botonEstado').attr('hidden', '');
                $('.section:last-child').attr('hidden', '');

            } else {

                $('#tablaRegistros').DataTable().$('tr.seleccionada').removeClass('seleccionada');

                $(this).addClass('seleccionada');

                var cuenta = {

                    numero: $(this).find('td:nth-child(1)').text(),
                    tipo: $(this).find('td:nth-child(2) > input').val(),
                    ultimaActividad: $(this).find('td:nth-child(4)').text()

                }

                consulta = "EXEC [AppMovil].[p_traer_filtros_registros] '', 'ESTADO_MENSUAL', '" + cuenta.tipo + "', '" + cuenta.numero + "'";

                await $.get(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select', function(registros) {

                    $('#estadoMensual')
                        .find('option')
                        .remove()
                        .end();

                    registros.forEach(registro => {

                        $('#estadoMensual')
                            .last()
                            .append(
                                '<option value="' + registro.mes + '-' + registro.ano + '">' +
                                registro.descripcion +
                                '</option>'
                            );

                    });

                });

                if (!$('#tablaRegistrosEstado_wrapper').length) {

                    consulta =
                        "EXEC [appmovil].[p_traer_estado_cuenta] " +
                        "'{idUsuario}', " +
                        "'" + cuenta.numero + "', " +
                        "'" + cuenta.tipo + "', " +
                        $('#estadoMensual').val().split('-')[1] + ", " +
                        $('#estadoMensual').val().split('-')[0];

                    $('#tablaRegistrosEstado').DataTable({

                        // Consulta de la base de datos
                        ajax: {
                            type: 'GET',
                            url: rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select',
                            dataType: 'JSON',
                            dataSrc: ''
                        },

                        // Datos a mostrar
                        columns: [
                            { data: 'documento' },
                            { data: 'descripcion' },
                            { data: 'fecha', orderable: false },
                            { data: 'debito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                            { data: 'credito', render: $.fn.dataTable.render.number(',', '.', 2, '') },
                            { data: 'balance', render: $.fn.dataTable.render.number(',', '.', 2, '') }
                        ],

                        columnDefs: [{
                                targets: 0,
                                className: 'documento',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearIzquierda');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
                                    `).addClass('alinearIzquierda')

                                }
                            },
                            {
                                targets: 1,
                                className: 'descripcion',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearIzquierda');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
                                    `).addClass('alinearIzquierda')

                                }
                            },
                            {
                                targets: 2,
                                className: 'fecha',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearIzquierda');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
                                    `).addClass('alinearIzquierda')

                                }
                            },
                            {
                                targets: 3,
                                className: 'debito',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearDerecha');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
                                    `).addClass('alinearDerecha')

                                }
                            },
                            {
                                targets: 4,
                                className: 'credito',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearDerecha');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
                                    `).addClass('alinearDerecha')

                                }
                            },
                            {
                                targets: 5,
                                className: 'balance',
                                createdCell: function(td, cellData, rowData, row, col) {

                                    $(td).addClass('alinearDerecha');

                                    $(`
                                        #tablaregistrosEstado .dataTable > thead > tr > th:nth-child(${col + 1}),
                                        #tablaregistrosEstado .dataTable > tfoot > tr > th:nth-child(${col + 1})
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
                        ordering: false,

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
                                        columns: ':visible',

                                        modifier: {
                                            page: 'current'
                                        }

                                    },

                                    footer: true,

                                    // Estilos para la impresión de los registros
                                    customize: function(tablaRegistrosDialogo = $('#tablaRegistros')) {

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
                                            <div class="col-5" style="margin-bottom: -10px">
                                            <div class="row align-items-center">
                                            <div class="col-3">Fecha:</div>
                                            <div class="col-9" style="text-align: right !important">${datosImpresion.fecha}</div>
                                            <div class="col-3">Hora:</div>
                                            <div class="col-9" style="text-align: right !important">${datosImpresion.hora}</div>
                                            <div class="col-3">Usuario:</div>
                                            <div class="col-9" style="text-align: right !important">${datosImpresion.usuario}</div>
                                            <div class="col-3">Cuenta:</div>
                                            <div class="col-9" style="text-align: right !important">
                                            ${$('.seleccionada > td:nth-child(1)').text()} - 
                                            ${$('.seleccionada > td:nth-child(2) > input').val()}
                                            </div>
                                            <div class="col-6">Última Actividad:</div>
                                            <div class="col-6" style="text-align: right !important">
                                            ${$('.seleccionada > td:nth-child(4)').text()}
                                            </div>
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
                                            <th class="header-info titulo" colspan="100%">Estado de Cuenta</th>
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
                                            .find('.documento, .descripcion, .fecha')
                                            .addClass('alinearIzquierda');

                                        $(tablaRegistrosDialogo.document.body)
                                            .find('.debito, .credito, .balance')
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

                        // Ejecutar cada vez que se cambia el HTML del contenido de la tabla
                        drawCallback: function() {

                            setTimeout(function() {

                                if (filtros) {

                                    ocultarCabeceraTablaRegistros();

                                }

                            }, 100);

                            cambiarTamanoTabla();

                            indicesColumnasSumar = [3, 4];


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
                        order: false,

                        initComplete: (filtros) ? function() {

                            $('#tablaRegistros').on('column-visibility.dt', function() {

                                ocultarCabeceraTablaRegistros();

                            });

                        } : null

                    });

                } else {

                    consulta =
                        "EXEC [appmovil].[p_traer_estado_cuenta] " +
                        "'{idUsuario}', " +
                        "'" + cuenta.numero + "', " +
                        "'" + cuenta.tipo + "', " +
                        $('#estadoMensual').val().split('-')[1] + ", " +
                        $('#estadoMensual').val().split('-')[0];

                    $('#tablaRegistrosEstado')
                        .DataTable()
                        .ajax
                        .url(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select')
                        .load();

                }

                $('#botonEstado').off().click(function() {

                    console.log(cuenta);

                    consulta =
                        "EXEC [appmovil].[p_traer_estado_cuenta] " +
                        "'{idUsuario}', " +
                        "'" + cuenta.numero + "', " +
                        "'" + cuenta.tipo + "', " +
                        $('#estadoMensual').val().split('-')[1] + ", " +
                        $('#estadoMensual').val().split('-')[0];

                    $('#tablaRegistrosEstado')
                        .DataTable()
                        .ajax
                        .url(rutaConsulta + '?consulta=' + consulta + '&tipoConsulta=select')
                        .load(function() {

                            $('.fas.fa-print')[1].click();

                        })

                });

            }

        });

    }

});