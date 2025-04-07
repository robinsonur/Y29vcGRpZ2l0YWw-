function graficasColumnas(graficas) {

    let graficasColumnas = new Array();

    graficas.forEach((grafica, indice) => {

        let configuracion = {
            series: [{

                name: grafica.tituloValoresDatos == null ?
                    '' : grafica.tituloValoresDatos,

                data: grafica.valoresDatos
            }],
            chart: {
                toolbar: {
                    show: false
                },

                height: grafica.alto == null ?
                    '100%' : grafica.alto,

                width: grafica.ancho == null ?
                    '100%' : grafica.ancho,

                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: grafica.radioBordesBarra == null ?
                        0 : grafica.radioBordesBarra,
                    dataLabels: {

                        position: grafica.posicionEtiquetasBarra == null ?
                            'top' : grafica.posicionEtiquetasBarra,

                    },
                }
            },
            dataLabels: {
                enabled: true,

                formatter: grafica.formatoValoresDatosVentana == null ?
                    function(valor) {

                        return textoFormatoNumerico([valor.toString()])

                    } : grafica.formatoValoresDatosVentana,

                offsetY: grafica.posicionYValoresDatos == null ?
                    -20 : grafica.posicionYValoresDatos,

                style: {
                    fontSize: grafica.tamanoEtiquetas == null ?
                        '12px' : grafica.tamanoEtiquetas,

                    colors: [
                        grafica.colorEtiquetas == null ?
                        '#000000' : grafica.colorEtiquetas
                    ]

                }
            },

            xaxis: {
                categories: grafica.titulos,

                position: grafica.posicionTitulos == null ?
                    'top' : grafica.posicionTitulos,

                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: grafica.formatoValoresDatos == null ?
                        function(valor) {

                            return textoFormatoNumerico([valor.toString()])

                        } : grafica.formatoValoresDatos
                }

            },

            colors: [

                grafica.color == null ?
                '#000000' : grafica.color

            ]
        }

        graficasColumnas.push(

            new ApexCharts(document.querySelector(grafica.campo), configuracion)

        );

        graficasColumnas[indice].render()

    })

    return graficasColumnas

}