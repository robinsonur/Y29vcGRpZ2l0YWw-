(() => {

  // ! Declaración de variables
  const rutaConsulta = `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/`;
  let camposValidar, camposIncompletos, consulta;

  $('form').submit(function(evento) {

    evento.preventDefault();
    evento.stopPropagation();

    return false

  });

  // * Arreglo para guardar los IDS de los campos a validar del formulario
  camposValidar = [{
      id: '#cedula',
      mascara: '000-0000000-0',
      longitudValor: 13
  }, {
      id: '#codigo',
      mascara: '000000'
  }];

  let camposMascara = new Array();

  // Ciclo para agregar las mascaras a los campos
  camposValidar.forEach(campo => {

      camposMascara.push(IMask(document.querySelector(campo.id), {
          mask: campo.mascara,
          lazy: true
      }));

  });

  $('#cedula').on('input', function() {

      camposValidar[0].longitudValor = 13;
      camposMascara[0].updateOptions({ mask: '000-0000000-0' })

  });

  $('#cedula, #codigo').on('change', function() {

      if (camposMascara[0].unmaskedValue.length == 9) {

          camposValidar[0].longitudValor = 11;
          camposMascara[0].updateOptions({ mask: '000-00000-0' })

      }

  });

  // ? Ejecutar función cuando se intente enviar el formulario
  $("#botonVerificar").click(function() {

      // * Arreglo para guardar los IDS de los campos a validar del formulario
      camposValidar = [{
          id: '#cedula',
          mascara: '000-0000000-0',
          longitudValor: 13
      }, {
          id: '#codigo',
          mascara: '000000'
      }];

      if (camposMascara[0].unmaskedValue.length == 9) {

          camposValidar[0].mascara = '000-00000-0';
          camposValidar[0].longitudValor = 11

      }

      // ! Declaración de variables
      let campos;

      campos = obtenerDatosCampos(camposValidar);

      // Ciclo para agregar la clase .is-invalid a los campos a validar
      campos.forEach((campo, iteracion) => {

          if (campo.incompleto) {

              campo.elemento.addClass('is-invalid')

          } else {

              campo.elemento.removeClass('is-invalid')

          }

      });

      camposIncompletos = $('.is-invalid').length;

      if (camposIncompletos && $('form fieldset').length === 1) {

          $('#etiquetaValidacion')
              .text('¡Tienes que ingresar los campos obligatorios!')
              .removeClass('d-none')

          return

      }

      var cedula = $('#cedula').val(), codigo = $('#codigo').val();

      $('#etiquetaValidacion')
          .text('')
          .addClass('d-none')

      consulta =
          "EXEC [appmovil].[p_validar_valores_pantalla] " +
          "'" + codigo + "', " +
          "'VALIDAR_REGISTRO', " +
          "'', " +
          "'', " +
          "'" + cedula + "';";

      $.get(
          rutaConsulta + 'verificarRegistro?cedula=' + cedula + '&codigo=' + codigo,
          function(registrosConsulta, estadoConsulta) {

              $('form fieldset .is-invalid').removeClass('is-invalid');

              if (registrosConsulta.existe == '1' && !registrosConsulta.login_usuario.trim()) {

                $('form fieldset:first').remove();

                  $('form')
                      .append(`
                        <fieldset class="d-grid gap-2">

                          <div id="etiquetaValidacion" class="alert alert-danger d-none p-1 text-center" role="alert">
                          </div>

                          <div class="form-group">

                            <label for="nombre">Nombre</label>

                            <input type="text" class="form-control" id="nombre" name="nombre" title="Nombre" value="${registrosConsulta.nombre}" readonly>

                          </div>

                          <div class="form-group">

                            <label for="correo">Correo</label>

                            <input type="email" class="form-control" id="correo" name="correo" title="Correo">

                          </div>

                          <div class="form-group">

                            <label for="usuario">Usuario</label>

                            <input type="text" class="form-control" id="usuario" name="usuario" title="Usuario" maxlength="30">

                          </div>

                          <div class="form-group">

                            <label for="contrasena">Contraseña</label>

                            <input type="password" class="form-control" id="contrasena" name="contrasena" title="Contraseña" minlength="6" maxlength="30">

                          </div>

                          <div class="form-group">

                            <label for="confirmarContrasena">Confirmar contraseña</label>

                            <input type="password" class="form-control" id="confirmarContrasena" name="confirmarContrasena" title="Confirmar contraseña" minlength="6" maxlength="30">

                          </div>

                          <button id="botonRegistrar" class="btn btn-primary">Registrar</button>

                        </fieldset>
                      `);

                  $('form').submit(function(evento) {

                    evento.preventDefault();
                    evento.stopPropagation();

                      camposValidar = [{
                          id: '#usuario',
                          longitudValor: 6,
                          longitudMaximaValor: 50
                      }, {
                          id: '#contrasena',
                          longitudValor: 6,
                          longitudMaximaValor: 30
                      }, {
                          id: '#confirmarContrasena',
                          longitudValor: 6,
                          longitudMaximaValor: 30
                      }]

                      campos = obtenerDatosCampos(camposValidar);

                      // Ciclo para agregar la clase .is-invalid a los campos a validar
                      campos.forEach((campo) => {

                          if (campo.incompleto) {

                              campo.elemento.addClass('is-invalid')

                          } else {

                              campo.elemento.removeClass('is-invalid')

                          }

                      });

                      if ($('#usuario').val() < 6) {

                          $('#etiquetaValidacion')
                              .text('¡Tienes que ingresar un usuario de 6 carácteres!')
                              .removeClass('d-none');

                            return

                      } else {

                          $('#usuario').removeClass('is-invalid')
                          $('#etiquetaValidacion').addClass('d-none')

                      }

                      if ($('#contrasena').val() < 6) {

                          $('#etiquetaValidacion')
                              .text('¡Tienes que ingresar una contraseña de 6 carácteres!')
                              .removeClass('d-none');

                            return

                      } else {

                          $('#contrasena').removeClass('is-invalid')
                          $('#etiquetaValidacion').addClass('d-none')

                      }

                      if ($('#contrasena').val() != $('#confirmarContrasena').val()) {

                          $('#confirmarContrasena').addClass('is-invalid')

                          $('#etiquetaValidacion')
                              .text('¡Tienes que ingresar la misma contraseña para confirmar!')
                              .removeClass('d-none')

                            return

                      } else {

                          $('#confirmarContrasena').removeClass('is-invalid')
                          $('#etiquetaValidacion').addClass('d-none')

                      }

                      $.get(
                          rutaConsulta + 'verificarRegistro?cedula=USUARIO&codigo=' + $('#usuario').val(),
                          async function(registrosConsulta, estadoConsulta) {

                              if (registrosConsulta.existe == '0' && $('#usuario').val()) {

                                  if ($('#usuario').val().length >= 6) {

                                      $('#usuario')
                                          .removeClass('is-invalid')
                                          .addClass('campoValidado');

                                  } else {

                                      $('#etiquetaValidacion')
                                          .text('¡Tienes que ingresar un usuario de 6 carácteres!')
                                          .removeClass('d-none')

                                  }

                              }

                              camposIncompletos = $('.is-invalid').length;

                              if (camposIncompletos) {

                                  if ($('#usuario').val().length < 5) {

                                      $('#etiquetaValidacion')
                                          .text('¡Tienes que ingresar un usuario de 6 carácteres!')
                                          .removeClass('d-none')

                                  }

                                  evento.preventDefault();
                                  evento.stopPropagation();

                                  return

                              } else {

                                  $('#etiquetaValidacion').addClass('d-none')

                              }

                              if (!$('.campoValidado').length) {

                                  $('#usuario')
                                      .addClass('is-invalid');

                                  $('#etiquetaValidacion')
                                      .text('¡No puedes registrarte con un usuario existente!')
                                      .removeClass('d-none')

                                  evento.preventDefault();
                                  evento.stopPropagation();

                                  return

                              }

                              consulta =
                                  rutaConsulta + 'registrarSesion?' +
                                  "codigo='" + codigo +
                                  "&cedula='" + cedula +
                                  "&usuario='" + $('#usuario').val() +
                                  "&correo='" + $('#correo').val() +
                                  "&contrasena=" + $('#contrasena').val();

                              $('#etiquetaValidacion')
                                  .text('¡Usuario registrado con éxito!')
                                  .addClass('alert-success')
                                  .removeClass('alert-danger d-none');

                              if ($('#correo').val()) {

                                  $.ajax({
                                      url: `${ location.origin.includes('daite.com.do') ? `${location.origin}/${location.pathname.split('/')[1]}` : location.origin }/correo/registro?nombreUsuario=${$('#usuario').val()}&correo=${$('#correo').val()}`
                                  })

                              }

                              window.location.href = consulta;

                              evento.preventDefault();
                              evento.stopPropagation();

                          });

                      evento.preventDefault();
                      evento.stopPropagation();

                      return false

                  });

              } else {

                  if (registrosConsulta.login_usuario) {

                      $('#etiquetaValidacion')
                          .text('¡Usuario registrado!')
                          .removeClass('d-none')

                  } else {

                      $('#etiquetaValidacion')
                          .text('¡Cédula y/o ID de usuario inválidos!')
                          .removeClass('d-none')

                  }

              }

          });

  });

  function obtenerDatosCampos(camposValidar) {

      let campos, campo;

      campos = new Array();

      camposValidar.forEach((campoValidar) => {

          campo = {
              id: campoValidar.id,
          };

          campo.elemento = $(campo.id);

          campo.valor = campo.elemento.val();

          campo.incompleto = (campo.valor) ? (campo.valor.length < campoValidar.longitudValor) : true;

          campos.push(campo)

      });

      return campos

  }

})()