$(function() {


    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`,
    serialPeticion = $('[name="_token"]').val();
    const rutaConsultaTablaRegistros = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`;
    var
        peticion,
        datosCuentaOrigen,

        cuenta = {
            numero: '',
            tipo: '',
            balance: ''
        },

        consulta, formatoFecha;

    formatoFecha = 'DD/MM/YYYY';

    // TODO: Script de los filtros
    // * Datos cuenta origen
    consulta = "EXEC [appmovil].[p_traer_cuentas] '{idUsuario}', 'CUENTA_ORIGEN';";

    $.ajax({
        url: rutaConsultaTablaRegistros + '?consulta=' + consulta + '&tipoConsulta=select',
        type: 'GET',
        dataType: 'JSON',
        success: async function(respuesta) {

            if (!respuesta.length)
                return
            ;

            respuesta.forEach(valor => cuentaOrigen.innerHTML += `<option value=${valor.cuenta}>${valor.cuentas}</option>`);

            if (cuentaOrigen.options.length) {
                [cuenta.numero, cuenta.tipo, cuenta.balance] = cuentaOrigen.selectedOptions[0].textContent.split(' - ');
                cuenta.balance = cuenta.balance.replace('RD$', '').replaceAll(',', '');
            }

            cambiarTamanoCampos();

            var mascaraMonto = IMask(monto, {
                mask: Number,
                signed: false,
                thousandsSeparator: ',',
                radix: '.',
                scale: 2,
                min: 0,
                max: cuenta.balance
            });

            cuentaOrigen.addEventListener('change', function(evento) {

                [cuenta.numero, cuenta.tipo, cuenta.balance] = this.selectedOptions[0].textContent.split(' - ');
                cuenta.balance = cuenta.balance.replace('RD$', '').replaceAll(',', '');

                mascaraMonto.updateOptions({
                    mask: Number,
                    signed: false,
                    thousandsSeparator: ',',
                    radix: '.',
                    scale: 2,
                    min: 0,
                    max: cuenta.balance
                });

            });

            fecha.addEventListener('focusout', function(evento) {

                let fecha = {
                    minima: Date.parse(this.min),
                    valor: Date.parse(this.value),
                    maxima: Date.parse(this.max)
                }

                if (fecha.valor < fecha.minima)
                    this.value = this.min
                else if (fecha.valor > fecha.maxima)
                    this.value = this.max
                else if (isNaN(fecha.valor))
                    this.value = new Date().toLocaleDateString('en-CA')

            })

            botonEnviar.addEventListener('click', function() {

                medio_pago.classList[medio_pago.value ? 'remove' : 'add']('campoIncompleto');
                monto.classList[monto.value ? 'remove' : 'add']('campoIncompleto');
                fecha.classList[fecha.value ? 'remove' : 'add']('campoIncompleto');
                concepto.classList[concepto.value ? 'remove' : 'add']('campoIncompleto');

                if (!!document.querySelector('.campoIncompleto'))
                    return
                ;

                peticion && peticion.abort();

                peticion = $.post(`
                ${rutaConsulta}2?_token=${serialPeticion}&
                consulta=EXEC [AppMovil].[p_guarda_solicitud_retiro_ahorros]
                    '${cuenta.numero}',
                    '${medio_pago.value}',
                    '${fecha.value.replaceAll('-', '')}',
                    '${concepto.value}',
                    '${mascaraMonto.unmaskedValue}'
                ;`,
                function() {

                    cuentaOrigen.selectedIndex = 0;
                    cuentaOrigen.dispatchEvent(new Event('change'));
                    medio_pago.selectedIndex = 0;
                    mascaraMonto.value = '';
                    fecha.value = null;
                    fecha.dispatchEvent(new Event('focusout'));
                    concepto.value = null

                    Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    }).fire({
                        icon: 'success',
                        title: '¡Solicitud de retiro realizada!'
                    })

                })

            });

        }
    });

    // Evento para cuando se re ajuste el tamaño de pantalla
    $(window).on('resize', function() {

        cambiarTamanoCampos();

    });

    function cambiarTamanoCampos() {

        if (window.innerWidth > 575) {

            $('.columnaCampo, #servicio, #monto, #concepto, #botonEnviar')
                .css('width', 100 * parseInt($('#cuentaOrigen').css('width')) / window.innerWidth + 'vw');

        }

    }

    $('#concepto').on('keydown focusout', function() {

        $(this).val($(this).val().toUpperCase())

    });

    $('print-preview-app').keydown(function(evento) {

        if (evento.keyCode == '27') {

            location.reload()

        }

    });

})