(async () => {

  let
    peticion = {
      ejecutar: async (
        metodo = 'GET',
        ruta,
        funcion = {}
      ) => {

        if (peticion.controlador)
          peticion.controlador.abort()
        ;

        peticion.controlador = new AbortController();
        peticion.senal = peticion.controlador.signal;

        await fetch(ruta, { method: metodo, signal: peticion.senal }).then(respuesta => respuesta.json()).then(respuesta => {

          peticion.controlador = null;
          funcion?.exitosa(respuesta)

        }).catch(error => {

          peticion.controlador = null;
          funcion?.erronea(error)

        })

      }
    },
    campo = {
      funcion: {
        enfocar: campo => {

          campo && campo.focus();

          campo.select && campo.select();

          campo.click()

        }
      },
      identificacion: mascara(identificacion),
      telefono: mascara(telefono),
      celular: mascara(celular)
    },
    campos = {
      deshabilitar: campos => campos.forEach(campo => {

        campo.elemento.value = null;
        campo.elemento.disabled = campo.deshabilitar

      })
    },
    formulario = {
      elemento: document.querySelector('form'),
      campo: {
        abierto: false,
        ejecutar: {
          evento: { change: true }
        }
      },
      campos: {
        habilitados: () => [...formulario.elemento.elements].filter(elemento =>
          elemento.tagName !== 'BUTTON' && !elemento.disabled && elemento.offsetParent
        ),
        anterior: function(campo = document.activeElement, campos = this.habilitados()) {
          return campo && campos[campos.indexOf(campo) - 1]
        },
        siguiente: function(campo = document.activeElement, campos = this.habilitados()) {
          return campo && campos[campos.indexOf(campo) + 1]
        }
      },
      parametros: function() {

        let parametros = new FormData();
        parametros.titulos = {};

        [...this.elemento.elements].forEach(elemento => {

          parametros.set(elemento.name, elemento.value);

          parametros.titulos[elemento.name] = elemento.previousElementSibling?.textContent.toLowerCase()

        });

        parametros.set('titulos', JSON.stringify(parametros.titulos));

        return new URLSearchParams([...parametros])

      }
    },
    ventana = {
      alerta: {
        instancia: new bootstrap.Modal(document.querySelector('.modal')),
        campo: { enfocar: null }
      }
    }
  ;

  ventana.alerta.elemento = ventana.alerta.instancia._element;
  ventana.alerta.encabezado = ventana.alerta.elemento.querySelector('.modal-header');
  ventana.alerta.cuerpo = ventana.alerta.elemento.querySelector('.modal-body');

  document.querySelectorAll('select[data-peticion]').forEach(elemento => {

    peticion.controlador = null;

    opciones(elemento, document.location.href + '/' + elemento.dataset.peticion)

  });

  tipo_entidad.addEventListener('change', function(evento, condicion = this.value === 'E') {

    campos.deshabilitar([{
      elemento: segundo_nombre,
      deshabilitar: condicion
    }, {
      elemento: primer_apellido,
      deshabilitar: condicion
    }, {
      elemento: segundo_apellido,
      deshabilitar: condicion
    }]);

    identificacion.dispatchEvent(new Event('change'))

  });

  identificacion.addEventListener('change', function(evento) {

    if (!this.value || !tipo_entidad.value)
      return
    ;

    peticion.ejecutar('GET', document.location.href + '/identificacion/' + this.value, {
      exitosa: respuesta => {

        if (!respuesta.length)
          return
        ;

        respuesta = respuesta[0];

        [respuesta.primer_nombre, respuesta.segundo_nombre] = respuesta.nombres.split(/ (.+)/);

        campo.identificacion.unmaskedValue = respuesta.cedula;
        primer_nombre.value = respuesta.primer_nombre;
        segundo_nombre.value = respuesta.segundo_nombre ?? '';
        primer_apellido.value = respuesta.primer_apellido;
        segundo_apellido.value = respuesta.segundo_apellido ?? '';
        id_genero.value = respuesta.sexo[0];

        if (respuesta.mensaje) {

          ventana.alerta.cuerpo.classList.remove('bg-primary');
          ventana.alerta.cuerpo.classList.add('bg-danger');

          ventana.alerta.campo.enfocar = identificacion;
          ventana.alerta.campo.enfocar.classList.add('is-invalid')

          ventana.alerta.cuerpo.textContent = respuesta.mensaje;

          ventana.alerta.instancia.show()

        }

      },
      erronea: error => {}
    });

  })

  id_provincia.addEventListener('change', function(evento) {

    opciones(
      id_municipio,
      document.location.href + '/' + id_municipio.dataset.peticion + '?id_provincia=' + this.value
    )

  });

  id_municipio.addEventListener('change', function(evento) {

    opciones(
      id_sector,
      document.location.href + '/' + id_sector.dataset.peticion + '?id_municipio=' + this.value
    )

  });

  formulario.elemento.addEventListener('keydown', function(evento) {

    evento.fecha = evento.target.type === 'date';
    evento.selector = evento.target.type === 'select-one';

    if (!evento.fecha && !evento.selector)
      return
    ;

    if (evento.code !== 'Enter' && evento.code !== 'Space')
      return formulario.campo.ejecutar.evento.change = false
    ;

    if (!formulario.campo.abierto)
      return formulario.campo.abierto = true
    ;

    formulario.campo.ejecutar.evento.change = true;

    formulario.elemento.dispatchEvent(new Event('submit'))

  });

  formulario.elemento.addEventListener('change', function(evento) {

    evento.fecha = evento.target.type === 'date';
    evento.selector = evento.target.type === 'select-one';

    if ((!evento.fecha && !evento.selector) || !formulario.campo.ejecutar.evento.change)
      return formulario.campo.ejecutar.evento.change = true
    ;

    if (evento.fecha && !evento.target.value)
      evento.target.value = evento.target.max
    ;

    formulario.elemento.dispatchEvent(new Event('submit'))

  });

  formulario.elemento.addEventListener('reset', function(evento) {

    evento.preventDefault();

    formulario.campos.habilitados().forEach(elemento => {

      elemento.classList.remove('is-invalid');

      elemento = {
        actual: elemento.dataset.mascara ? campo[elemento.id] : elemento,
        valor: elemento.type === 'date' ? elemento.max : '',
      }

      elemento.actual.value = elemento.valor;

      if (elemento.actual.tagName === 'SELECT') {

        peticion.controlador = null;

        elemento.actual.dispatchEvent(new Event('change'))

      }

    })

  });

  formulario.elemento.addEventListener('submit', async function(evento) {

    evento.preventDefault();

    if (!['BODY', 'DIV', 'BUTTON'].includes(document.activeElement.tagName)) {

      !document.activeElement.closest('table') &&
      setTimeout((elemento = formulario.campos.siguiente()) =>
        elemento && campo.funcion.enfocar(elemento),
      0);

      formulario.campo.abierto = false

      return

    }

    if (ventana.alerta.campo.enfocar)
      ventana.alerta.campo.enfocar.classList.remove('is-invalid')
    ;

    await peticion.ejecutar('GET', this.action + '?' + formulario.parametros(), {
      exitosa: respuesta => {

        if (!respuesta.length)
          return
        ;

        respuesta = respuesta[0];

        if (respuesta.estado === 200) {

          this.reset();

          ventana.alerta.cuerpo.classList.remove('bg-danger');
          ventana.alerta.cuerpo.classList.add('bg-primary')

        } else {

          ventana.alerta.cuerpo.classList.remove('bg-primary');
          ventana.alerta.cuerpo.classList.add('bg-danger');

          ventana.alerta.campo.enfocar = this.elements[respuesta.campo];
          ventana.alerta.campo.enfocar.classList.add('is-invalid')

        }

        ventana.alerta.cuerpo.textContent = respuesta.mensaje

      },
      erronea: error => {

        ventana.alerta.cuerpo.classList.remove('bg-primary');
        ventana.alerta.cuerpo.classList.add('bg-danger');
        ventana.alerta.cuerpo.textContent = '¡Ha ocurrido un error!'

      }
    });

    ventana.alerta.instancia.show()

  });

  ventana.alerta.elemento.addEventListener('hidden.bs.modal', function(evento) {

    if (ventana.alerta.campo.enfocar)
      ventana.alerta.campo.enfocar.focus()

  });

  function mascara(elemento) {

    let mascara = {
      tipo: elemento.dataset.mascara,
      patron: elemento.dataset.mascaraPatron,
      minimo: Number(elemento.dataset.mascaraValorMinimo),
      maximo: Number(elemento.dataset.mascaraValorMaximo),
    }

    if (isNaN(mascara.minimo))
      mascara.minimo = 0
    ;

    if (isNaN(mascara.maximo))
      mascara.maximo = 2147483648
    ;

    switch (mascara.tipo) {

      case 'entero':

        if (!mascara.patron)
          mascara.patron = Number
        ;

        mascara.propiedades = {
          mask: mascara.patron,
          scale: 0,
          signed: false,
          min: mascara.minimo,
          max: mascara.maximo
        }

      break;

      case 'numerico':

        if (!mascara.patron)
          mascara.patron = Number
        ;

        if (!mascara.decimales)
          mascara.decimales = 2
        ;

        mascara.propiedades = {
          mask: mascara.patron,
          scale: mascara.decimales,
          signed: false,
          thousandsSeparator: ',',
          padFractionalZeros: true,
          normalizeZeros: true,
          radix: '.',
          mapToRadix: ['.'],
          min: mascara.minimo,
          max: mascara.maximo
        }

        if (!elemento.getAttribute('value'))
          elemento.setAttribute('value', '0.00')
        ;

        elemento.addEventListener('change', function(evento) {

          if (!this.value)
            mascara.instancia.value = '0.00'

        })

      break;

      case 'telefono':

        if (!mascara.patron)
          mascara.patron = '000-000-0000'
        ;

        mascara.propiedades = { mask: mascara.patron }

      break;

      case 'cedula':

        if (!mascara.patron)
          mascara.patron = '000-0000000-0'
        ;

        mascara.propiedades = { mask: mascara.patron }

      break;

      case 'rnc':

        if (!mascara.patron)
          mascara.patron = '000-00000-0'
        ;

        mascara.propiedades = { mask: mascara.patron }

      break;

      case 'pasaporte':

        if (!mascara.patron)
          mascara.patron = '***************'
        ;

        mascara.propiedades = { mask: mascara.patron }

      break;

      default:

        if (!mascara.patron)
          mascara.patron = '***************'
        ;

        mascara.propiedades = { mask: mascara.patron }

      break;

    }

    mascara.instancia = IMask(elemento, mascara.propiedades);

    return mascara.instancia

  }

  function opciones(elemento, ruta) {

    peticion.ejecutar('GET', ruta, {
      exitosa: respuesta => {

        elemento.disabled = true;
        elemento.innerHTML = '';

        if (!respuesta.length)
          return
        ;

        if (respuesta.length > 1) {

          elemento.appendChild(new Option());

          elemento.disabled = false

        }

        respuesta.forEach(opcion => elemento.appendChild(new Option(opcion.descripcion, opcion.valor)))

      },
      erronea: error => {

        ventana.alerta.cuerpo.classList.remove('bg-primary');
        ventana.alerta.cuerpo.classList.add('bg-danger');
        ventana.alerta.cuerpo.textContent = '¡Ha ocurrido un error!'

      }
    })

  }

})()