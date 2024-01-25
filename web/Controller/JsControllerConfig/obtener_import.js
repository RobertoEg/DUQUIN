$(document).ready(function() {
    // Realiza una solicitud AJAX para obtener los datos del servidor
    $.ajax({
        url: '/web/Controller/BdControllerConfig/obtener_import.php',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Variable para almacenar referencias con errores
            var referenciasConErrores = [];

            // Verifica errores antes de mostrar la tabla
            data.forEach(function (item) {
                var precioBase = parseInt(item.PrecioBase.replace(/\$|,/g, ''));
                var precioDescuento = parseInt(item.PrecioDescuento.replace(/\$|,/g, ''));

                if (precioDescuento > precioBase) {
                    referenciasConErrores.push(item.Referencia);
                }
            });

            // Oculta el botón si hay referencias con errores
            if (referenciasConErrores.length > 0) {
                $('.Guardar').hide();

                // Muestra una alerta profesional con SweetAlert2 si hay referencias con errores
                Swal.fire({
                    icon: 'error',
                    title: 'Errores en las siguientes referencias:',
                    text: referenciasConErrores.join(', '),
                    customClass: {
                        popup: 'my-custom-popup-class', // Clase personalizada para el popup
                        title: 'my-custom-title-class', // Clase personalizada para el título
                        content: 'my-custom-content-class' // Clase personalizada para el contenido
                    }
                }).then(function() {
                    // Redirige al usuario a la página deseada después de hacer clic en OK
                    window.location.href = '/web/View/Users/cotizaciones.html';
                });
            } else {
                // Muestra el botón si no hay referencias con errores
                $('.Guardar').show();

                // Limpia el contenido actual de la tabla
                $('#tbodyItems').empty();

                // Función para formatear el valor como precio colombiano sin decimales
                function formatPrice(price) {
                    // Elimina el símbolo de moneda y las comas de miles
                    var numericValue = price.replace(/\$|,/g, '');

                    // Convierte a entero y luego lo formatea
                    return '$ ' + parseInt(numericValue).toLocaleString('es-CO', { minimumFractionDigits: 0 });
                }

                // Recorre los datos obtenidos y agrega filas a la tabla
                data.forEach(function (item, index) {
                    // Calcula el porcentaje de descuento
                    var precioBase = parseInt(item.PrecioBase.replace(/\$|,/g, ''));
                    var precioDescuento = parseInt(item.PrecioDescuento.replace(/\$|,/g, ''));
                    var descuentoPorcentaje = ((precioBase - precioDescuento) / precioBase) * 100;

                    // Formatea el porcentaje para mostrarlo sin decimales
                    var formattedDescuentoPorcentaje = descuentoPorcentaje.toFixed(0) + '%';

                    var row = '<tr>' +
                        '<td>' + (index + 1) + '</td>' + // ID
                        '<td>' + item.Item + '</td>' +
                        '<td>' + item.CodigoBarras + '</td>' +
                        '<td>' + item.Referencia + '</td>' +
                        '<td>' + item.Descripcion + '</td>' +
                        '<td>' + item.UND + '</td>' +
                        '<td>' + formatPrice(item.PrecioBase) + '</td>' +
                        '<td>' + formatPrice(item.PrecioDescuento) + '</td>' +
                        '<td>' + formattedDescuentoPorcentaje + '</td>' +
                        '</tr>';

                    // Verifica si el precio con descuento es mayor que el precio base
                    if (precioDescuento > precioBase) {
                        // Aplica los estilos y animaciones
                        row = $(row).css('color', 'red');
                        referenciasConErrores.push(item.Referencia);
                    }

                    $('#tbodyItems').append(row);
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener datos del servidor.',
                customClass: {
                    popup: 'my-custom-popup-class', // Clase personalizada para el popup
                    title: 'my-custom-title-class', // Clase personalizada para el título
                    content: 'my-custom-content-class' // Clase personalizada para el contenido
                }
            });
        }
    });
});
