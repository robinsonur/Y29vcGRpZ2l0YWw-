$(function() {

    const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/consulta`,
        serialPeticion = $('[name="_token"]').val();

    var peticion = null;

    $('.list-group button').click((propiedadesEvento) => {

        peticion && peticion.abort();

        Swal.mixin({}).fire({

            title: '',
            html: `
              <div class="card" style="margin: 0; font-size: 10px">
              <div class="card-body" style="padding: 0">
                <h5
                  class="card-title"
                  style="
                    text-align: left;
                    background-color: var(--bs-primary);
                    color: #fff;
                    padding: 14px 0 14px 14px;
                  "
                >
                  Detalles
                </h5>
                <div
                  class="card-subtitle"
                  style="
                    text-align: left;
                    color: #fff;
                    background: var(--bs-primary);
                    padding: 0 14px;
                    margin: 5px;
                    border-radius: 8px;
                  "
                >
                </div>
                <div
                  class="card-text"
                  style="
                    text-align: left;
                    padding: 0;
                    margin: 0;
                    overflow: scroll;
                    height: 400px;
                  "
                >
                  <table
                    class="table"
                    id="tablaRegistros"
                  >
                  <thead
                    style="
                      background-color: var(--bs-primary);
                      color: #fff
                    "
                  >
                      <tr>
                      </tr>
                  </thead>
                  <tbody>
                  </tbody>
                  </table>
                </div>
              </div>
              </div>`,
            width: '900px',
            height: '100%',
            padding: '0',
            background: '#fff',
            grow: true,
            showConfirmButton: false,
            showCloseButton: true

        })

        peticion = $.post(
            `${rutaConsulta}2?
          _token=${serialPeticion}&
          consulta=SET NOCOUNT ON; EXEC [AppMovil].[p_traer_detalle_otras_opciones] '{idUsuario}', '${propiedadesEvento.currentTarget.value}';&tipoConsulta=select`,
            (registros) => {

                let indiceColumna = 0;
console.log(registros);
                registros.forEach((registro, indiceFila) => {

                    if (registro.salto_linea == '1')
                        return $('.swal2-html-container table tbody').append(`<tr role="row" class="${indiceFila} saltoLinea"><td colspan="100%"></td></tr>`);

                    $('.swal2-html-container table tbody').append(`<tr role="row" class="${indiceFila}"></tr>`);

                    $.each(registro, (nombreCampo, valor) => {

                        nombreCampo == 'poner_negrita' && valor == '1' && $(`tr.${indiceFila}`).css('font-weight', 'bold');

                        if (
                            nombreCampo == 'poner_negrita' ||
                            nombreCampo == 'salto_linea' ||
                            nombreCampo == 'ano' ||
                            nombreCampo == 'mes' ||
                            nombreCampo == 'origen' ||
                            nombreCampo == 'grupo' ||
                            nombreCampo == 'orden'
                        ) return;

                        indiceFila == 0 && $('.swal2-html-container table thead tr').append(`<th class="th-${indiceColumna}">${nombreCampo}</th>`);

                        $(`.swal2-html-container table tbody tr.${indiceFila}`).append(
                            isNaN(valor) ?
                            `<td class="td-${indiceColumna}">${valor}</td>` :
                            (nombreCampo == 'cantidad') ?
                            `<td class="td-${indiceColumna}">${valor??0}</td>` :
                            `<td class="td-${indiceColumna}">${formatoNumerico(valor??0, 2)}</td>`
                        );

                        $.isNumeric($(`.td-${indiceColumna}`).text().replaceAll(',', '').replaceAll('.', '')) &&
                            $(`.td-${indiceColumna}`).addClass('alinearDerecha') &&
                            indiceFila == 0 && $(`.th-${indiceColumna}`).addClass('alinearDerecha');

                        indiceColumna++;

                    });

                    indiceFila == 0 && propiedadesEvento.currentTarget.className.includes('modal-0') &&
                        $(tablaRegistros).hide() &&
                        $.post(
                            `${rutaConsulta}2?
                            _token=${serialPeticion}&
                            consulta=SET NOCOUNT ON; EXEC [AppMovil].[p_traer_detalle_otras_opciones] '{idUsuario}', '${propiedadesEvento.currentTarget.value}', '1';&tipoConsulta=select`,
                            (registros) => {

                                let indice = 0;

                                $.each(registros[0], (nombreCampo, valor) => {

                                    $(`.th-${indice}`).text(valor);

                                    indice++

                                });

                                $(tablaRegistros).show()

                            }
                        )

                })

            })

    })

})