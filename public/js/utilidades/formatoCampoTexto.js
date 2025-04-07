function formatearCamposTextoNumero(camposTextoFormatear) {

    let camposTextoFormateados = new Array();

    camposTextoFormatear.forEach(campoTextoFormatear => {

        camposTextoFormateados.push(

            IMask(document.querySelector(campoTextoFormatear.id), {

                mask: campoTextoFormatear.formato == null ?
                    Number : campoTextoFormatear.formato,

                signed: campoTextoFormatear.numerosNegativos == null ?
                    false : campoTextoFormatear.numerosNegativos,

                thousandsSeparator: campoTextoFormatear.separadorMiles == null ?
                    ',' : campoTextoFormatear.separadorMiles,

                radix: campoTextoFormatear.separadorDecimales == null ?
                    '.' : campoTextoFormatear.separadorDecimales,

                scale: campoTextoFormatear.cantidadDecimales == null ?
                    2 : campoTextoFormatear.cantidadDecimales,

                min: campoTextoFormatear.valorMinimo == null ?
                    0 : campoTextoFormatear.valorMinimo,

                max: campoTextoFormatear.valorMaximo

            })

        )

    });

    return camposTextoFormateados;

}