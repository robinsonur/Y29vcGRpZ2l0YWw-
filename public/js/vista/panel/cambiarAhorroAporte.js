$(async function() {

    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`,
        serialPeticion = $('[name="_token"]').val();

    var peticion = null;

    mascaraNuevoAportes = IMask(nuevoAportes, {
            mask: Number,
            signed: false,
            thousandsSeparator: ',',
            radix: '.',
            scale: 2,
            min: 0.00,
            normalizeZeros: false
        }),

        mascaraNuevoAhorros = IMask(nuevoAhorros, {
            mask: Number,
            signed: false,
            thousandsSeparator: ',',
            radix: '.',
            scale: 2,
            min: 0.00,
            normalizeZeros: false
        });

    await $.get(`${rutaConsulta}?consulta=EXEC [AppMovil].[p_traer_descuentos_aportes_ahorros] '{idUsuario}';&tipoConsulta=select`, function(registros) {

        actualAportes.value = registros[0].aportes;
        actualAhorros.value = registros[0].ahorros

    });

    mascaraNuevoAportes.unmaskedValue = actualAportes.value;
    mascaraNuevoAhorros.unmaskedValue = actualAhorros.value

    $(botonActualizar).click((propiedadesEvento) => {

        let camposVacios = verificarCamposVacios(['#nuevoAhorros', '#nuevoAportes']);

        peticion && peticion.abort();

        $('.campoIncompleto').removeClass('campoIncompleto');

        $(`${camposVacios}`).addClass('campoIncompleto');

        if ($('.campoIncompleto').length) {

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
                icon: 'error',
                title: '¡Tienes que completar los campos obligatorios!'
            })

            return

        }

        peticion = $.post(
            `${rutaConsulta}2?
            _token=${serialPeticion}&
            consulta=EXEC [AppMovil].[p_cambiar_descuentos_nomina]
              '{idUsuario}',
              ${parseFloat(nuevoAportes.value)},
              ${parseFloat(nuevoAhorros.value)}
            ;`,
            function() {

                actualAportes.value = nuevoAportes.value.toString();
                actualAhorros.value = nuevoAhorros.value.toString()

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
                    title: '¡Descuentos actualizados!'
                })

            })

    })

});