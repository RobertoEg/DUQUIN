$(document).ready(function() {
    // Realiza una solicitud AJAX a razon_social.php
    $.ajax({
        url: '/web/Controller/BdControllerConfig/razon_social.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.razon_social) {
                // Si se encontró la razón social, actualiza el contenido en la página
                $('#razonSocial').text(data.razon_social);
            } else if (data.error) {
                // Si hay un mensaje de error, puedes manejarlo apropiadamente
                console.error(data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la solicitud AJAX, si los hay
            console.error(textStatus, errorThrown);
        }
    });
});