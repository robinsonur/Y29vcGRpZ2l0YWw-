var
    formatoFecha = 'DD/MM/YYYY',

    rangosFecha = {
        'Hoy': [moment(), moment()],
        'Ayer': [moment().subtract(1, 'days'), moment()],
        'Esta semana': [moment().startOf('week'), moment()],
        'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
        // 'Semana pasada': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
        'Este mes': [moment().startOf('month'), moment()],
        'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
        // 'Mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Este año': [moment().startOf('year'), moment()],
        'Último año': [moment().subtract(1, 'year'), moment()],
        // 'Año pasado': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    },

    textosFiltroFecha = {
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

function filtroFecha(filtrosFecha) {

    filtrosFecha.forEach(filtroFecha => {

        filtroFecha.campo.daterangepicker({

            singleDatePicker: jQuery.inArray('rango', Object.keys(filtroFecha)) == 1 ?
                !filtroFecha.rango : true,

            showDropdowns: true,

            minYear: jQuery.inArray('anoMinimo', Object.keys(filtroFecha)) == 1 ?
                filtroFecha.anoMinimo : 1753,

            maxYear: jQuery.inArray('anoMaximo', Object.keys(filtroFecha)) == 1 ?
                filtroFecha.anoMaximo : 3000,

            showWeekNumers: true,
            showISOWeekNumers: true,
            autoApply: false,
            autoUpdateInput: true,
            alwaysShowCalendars: false,
            parentEl: 'body',

            startDate: jQuery.inArray('fechaDesde', Object.keys(filtroFecha)) == 1 ?
                moment(this) : moment(),

            endDate: jQuery.inArray('fechaHasta', Object.keys(filtroFecha)) == 1 ?
                moment(this) : moment(),

            minDate: jQuery.inArray('fechaMinima', Object.keys(filtroFecha)) == 1 ?
                moment(filtroFecha.fechaMinima) : moment('01/01/1753'),

            maxDate: jQuery.inArray('fechaMaxima', Object.keys(filtroFecha)) == 1 ?
                moment(filtroFecha.fechaMaxima) : moment('01/01/3000'),

            opens: 'center',
            drops: 'down',
            buttonClasses: 'btn btn-sm',
            applyButtonClasses: 'btn-primary',
            cancelClass: 'btn-default',

            ranges: jQuery.inArray('rangosFecha', Object.keys(filtroFecha)) == 1 ?
                filtroFecha.rangosFecha : rangosFecha,

            locale: jQuery.inArray('textos', Object.keys(filtroFecha)) == 1 ?
                filtroFecha.textos : textosFiltroFecha

        });

    });

}