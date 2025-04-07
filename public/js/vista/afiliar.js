(async () => {

  let
    campo = {
      funcion: {
        buscar: {
          indice: (campos, campo) => campo && campos.findIndex(elemento => elemento === campo),
          siguiente: function(campos, campo) { return campo && campos[this.indice(campos, campo) + 1] }
        },
        enfocar: (campo) => {

          campo && campo.focus();

          campo.select && campo.select();

          campo.click()

        }
      },
      tipo_entidad: {
        deshabilitar: {
          campos: (deshabilitar) => {

            segundo_nombre.value = null;
            segundo_nombre.disabled = deshabilitar;

            primer_apellido.value = null;
            primer_apellido.disabled = deshabilitar;

            segundo_apellido.value = null;
            segundo_apellido.disabled = deshabilitar

          }
        }
      },
      identificacion: mascara(identificacion),
      pasaporte: mascara(pasaporte),
      telefono: mascara(telefono),
      celular: mascara(celular)
    },
    formulario = {
      elemento: document.querySelector('form'),
      campo: {
        abierto: false,
        ejecutar: {
          evento: { change: true, submit: true }
        }
      },
      campos: () => [...formulario.elemento.elements].filter(elemento =>
        elemento.tagName !== 'BUTTON' && !elemento.disabled && elemento.offsetParent
      )
    }
  ;

  tipo_entidad.addEventListener('change', function(evento) {

    campo.tipo_entidad.deshabilitar.campos(this.value === 'E')

  });

  document.querySelectorAll('select[data-peticion]').forEach(elemento =>
    fetch(document.location.href + '/' + elemento.dataset.peticion).then(respuesta => respuesta.json()).then(respuesta => {

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

    })
  );

  formulario.elemento.addEventListener('keydown', function(evento) {

    if (!['date', 'select-one'].includes(evento.target.type))
      return
    ;

    if (evento.code !== 'Enter' && evento.code !== 'Space')
      return formulario.campo.ejecutar.evento.change = false
    ;

    if (!formulario.campo.abierto)
      return formulario.campo.abierto = true
    ;

    formulario.campo.ejecutar.evento.change = true;

    formulario.campo.abierto = false;

    formulario.elemento.dispatchEvent(new Event('submit'))

  });

  formulario.elemento.addEventListener('change', function(evento) {

    if (!['date', 'select-one'].includes(evento.target.type) || !formulario.campo.ejecutar.evento.change)
      return formulario.campo.ejecutar.evento.change = true
    ;

    if (evento.target.type === 'date' && !evento.target.value)
      evento.target.value = evento.target.max
    ;

    formulario.elemento.dispatchEvent(new Event('submit'))

  });

  formulario.elemento.addEventListener('reset', function(evento) {

    evento.preventDefault();

    formulario.campos().forEach(elemento => {

      if (elemento.tagName === 'SELECT') {

        elemento.selectedIndex = 0;

        elemento.dispatchEvent(new Event('change'))

      } else
        elemento.value = elemento.type === 'date' ? elemento.max : null

    })

  });

  formulario.elemento.addEventListener('submit', function(evento) {

    evento.preventDefault();

    if (!['BODY', 'DIV', 'BUTTON'].includes(document.activeElement.tagName)) {

      if (!document.activeElement.closest('table')) {

        formulario.campo.elemento = campo.funcion.buscar.siguiente(formulario.campos(), document.activeElement);

        setTimeout(() => campo.funcion.enfocar(formulario.campo.elemento), 0)

      }

      return

    }

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

})()