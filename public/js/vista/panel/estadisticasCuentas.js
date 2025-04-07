$(function() {

    $.ajax({
        url: traerRegistros,
        type: 'GET',
        dataType: 'JSON',
        success: function(registros) {

            let graficas = [{

                valoresDatos: [],
                radioBordesBarra: 10,
                tamanoEtiquetas: '12px',
                titulos: [],
                colorEtiquetas: '#304758',
                color: 'var(--bs-primary)',
                campo: '#graficaAhorros'

            }, {

                valoresDatos: [],
                radioBordesBarra: 10,
                tamanoEtiquetas: '12px',
                titulos: [],
                colorEtiquetas: '#304758',
                color: 'var(--bs-primary)',
                campo: '#graficaAportaciones'

            }];

            registros[0].forEach((registro, indice) => {

                graficas[0].valoresDatos.push(registro.monto);
                graficas[0].titulos.push(registro.mes);

            });

            registros[1].forEach((registro, indice) => {

                graficas[1].valoresDatos.push(registro.monto);
                graficas[1].titulos.push(registro.mes);

            });

            graficas = graficasColumnas(graficas);

        }

    })

})