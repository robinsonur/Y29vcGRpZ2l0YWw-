const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`,
    serialPeticion = $('[name="_token"]').val();

var peticion = null,
    resumen, balanceCuentas, deudas;

resumen = {

    prestamos: parseFloat(
        $('#prestamos')
        .text()
        .trim()
        .replaceAll(',', '')
    ),

    aportes: parseFloat(
        $('#aportes')
        .text()
        .trim()
        .replaceAll(',', '')
    ),

    ahorros: parseFloat(
        $('#ahorros')
        .text()
        .trim()
        .replaceAll(',', '')
    ),

    certificados: parseFloat(
        $('#certificados')
        .text()
        .trim()
        .replaceAll(',', '')
    ),

    facturas: parseFloat(
        $('#facturas')
        .text()
        .trim()
        .replaceAll(',', '')
    ),

    lineasCredito: parseFloat(
        $('#lineasCredito')
        .text()
        .trim()
        .replaceAll(',', '')
    )

}

// $(`#cuentasAportes, #cuentasAhorros`).click((propiedadesEvento) => {

//     let tipoCuenta = propiedadesEvento.currentTarget.id == 'cuentasAhorros' ? 'AHORROS' : 'APORTES';

//     Swal.mixin({}).fire({

//         title: '',
//         html: `
//           <div class="card" style="margin: 0; font-size: 10px">
//           <div class="card-body" style="padding: 0">
//             <h5
//               class="card-title"
//               style="
//                 text-align: left;
//                 background-color: var(--bs-primary);
//                 color: #fff;
//                 padding: 14px 0 14px 14px;
//               "
//             >
//               Detalles
//             </h5>
//             <div
//               class="card-subtitle"
//               style="
//                 text-align: left;
//                 color: #fff;
//                 background: var(--bs-primary);
//                 padding: 0 14px;
//                 margin: 5px;
//                 border-radius: 8px;
//               "
//             >
//             </div>
//             <div
//               class="card-text"
//               style="
//                 text-align: left;
//                 padding: 0;
//                 margin: 0;
//                 overflow: scroll;
//                 height: 226px;
//               "
//             >
//               <table
//                 class="table"
//                 id="tablaRegistros"
//               >
//               <thead
//                 style="
//                   background-color: var(--bs-primary);
//                   color: #fff
//                 "
//               >
//                   <tr>
//                   </tr>
//               </thead>
//               <tbody>
//               </tbody>
//               </table>
//             </div>
//           </div>
//           </div>`,
//         width: '900px',
//         height: '100%',
//         padding: '0',
//         background: '#fff',
//         grow: true,
//         showConfirmButton: false,
//         showCloseButton: true

//     });

//     $.post(
//         `${rutaConsulta}2?
//         _token=${serialPeticion}&
//         consulta=SET NOCOUNT ON; EXEC [AppMovil].[p_traer_cuentas] '{idUsuario}', '${tipoCuenta}';&tipoConsulta=select`,
//         (registros) => {

//             let indiceColumna = 0;

//             registros.forEach((registro, indiceFila) => {

//                 $('.swal2-html-container table tbody').append(`<tr role="row" class="${indiceFila}"></tr>`);

//                 $.each(registro, (nombreCampo, valor) => {

//                     if (
//                         nombreCampo == 'cuentas' ||
//                         nombreCampo == 'fecha' ||
//                         nombreCampo == 'ultima_actividad'
//                     ) return;

//                     switch (nombreCampo) {

//                         case 'monto':
//                             nombreCampo = 'Balance';
//                             break;

//                         case 'pignorado':
//                             nombreCampo = 'Bloqueado';
//                             break;

//                     }

//                     indiceFila == 0 && $('.swal2-html-container table thead tr').append(`<th class="th-${indiceColumna}">${nombreCampo}</th>`);

//                     $(`.swal2-html-container table tbody tr.${indiceFila}`).append(
//                         isNaN(valor) ?
//                         `<td class="td-${indiceColumna}">${valor}</td>` :
//                         (nombreCampo == 'cantidad') ?
//                         `<td class="td-${indiceColumna}">${valor??0}</td>` :
//                         `<td class="td-${indiceColumna}">${formatoNumerico(valor??0, 2)}</td>`
//                     );

//                     $.isNumeric($(`.td-${indiceColumna}`).text().replaceAll(',', '').replaceAll('.', '')) &&
//                         $(`.td-${indiceColumna}`).addClass('alinearDerecha') &&
//                         indiceFila == 0 && $(`.th-${indiceColumna}`).addClass('alinearDerecha');

//                     indiceColumna++;

//                 })

//             })

//         }
//     )

// });

balanceCuentas = resumen.aportes + resumen.ahorros + resumen.certificados;
deudas = resumen.prestamos + resumen.lineasCredito + resumen.facturas;

var options = {
    series: [{
        name: 'Monto',
        data: [balanceCuentas, deudas]
    }],
    chart: {
        toolbar: {
            show: false
        },
        height: 350,
        width: window.innerWidth < 1024 ?
            '100%' : '49.5%',
        type: 'bar',
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function(valor) {
            return textoFormatoNumerico([(valor + '')]);
        },
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ["#304758"]
        }
    },

    xaxis: {
        categories: ['Balance de Cuentas', 'Deudas'],
        position: 'top',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
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
            formatter: function(valor) {
                return textoFormatoNumerico([(valor + '')]);
            }
        }

    },

    colors: ['var(--bs-primary)']
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

$('#chart').css('padding', '0');

$('.apexcharts-toolbar').css('display', 'none')