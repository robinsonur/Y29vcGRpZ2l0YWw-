function textoFormatoNumerico(numerosFormatear, cantidadDecimales) {

    let numerosFormateados = new Array();

    numerosFormatear.forEach(numeroFormatear => {

        numerosFormateados.push(

            parseFloat(numeroFormatear.replaceAll(',', '')).toLocaleString('en-US', {
                minimumFractionDigits: cantidadDecimales
            })

        );

    });

    return numerosFormateados

}

/**
 * Función para dar formato numérico.
 * @ Retorna una variable de tipo texto o un arreglo con valores de tipo texto.
 */
function formatoNumerico(
    parametroFormatear, cantidadDecimales = 0
) {

    // ! Declaración de variables
    let unValorFormatear = variableArregloIndiceUnico(parametroFormatear),
        parametroFormateado = null,

        // + Función para dar formato de manera dinámica
        formatear = (valorFormatear) => {

            // ? Condición ternaria para identificar
            // ? si el parámetro envíado es una
            // ? variable de tipo texto
            valorFormatear =
                typeof valorFormatear === "string" ?
                parseFloat(valorFormatear.replaceAll(",", ""))

            // * Condición ternaria para identificar
            // * si el parámetro envíado es un valor
            // * numérico nulo
            : (valorFormatear = isNaN(valorFormatear) ?
                0 :
                valorFormatear);

            return valorFormatear.toLocaleString('es-419', {
                minimumFractionDigits: cantidadDecimales
            })

        };

    // ! Condición para verificar si es
    // ! un solo valor a formatear
    if (unValorFormatear) {

        parametroFormateado = formatear(parametroFormatear)

    } else {

        parametroFormateado = new Array();

        parametroFormatear.forEach((valorFormatear) => {

            numeroFormateado.push(formatear(valorFormatear))

        })

    }

    return parametroFormateado

}

/**
 * Función para identificar campos sin valor asignado.
 * @ Retorna una variable de tipo texto o un arreglo con valores de tipo texto.
 */
function verificarCamposVacios(campos) {
    let campoVacio = null,
        camposVacios = new Array();

    campos.forEach((campo) => {
        campoVacio = !$(campo).val().trim();

        if (campoVacio) {
            camposVacios.push(`label[for="${campo.replace("#", "")}"]`);
            camposVacios.push(campo);
        }
    });

    return camposVacios;
}

/**
 * Función para verificar si el parámetro enviado es una variable o un arreglo de índice único.
 * @ Retorna una variable de tipo booleano
 */
function variableArregloIndiceUnico(parametroVerificar) {

    let variableArregloIndiceUnico = !parametroVerificar instanceof Array ||
        typeof parametroVerificar === "string" ||
        typeof parametroVerificar === "number" ||
        parametroVerificar.length <= 1;

    return variableArregloIndiceUnico;

}

/**
 * Función extraer valores numéricos de un texto.
 * @ Retorna una variable de tipo texto.
 */
function extraerNumerosTexto(valorExtraer) {
    return valorExtraer.replace(/[^\d.-]/g, "");
}