$(document).ready(function() {
    // Manejar el evento de clic en el botón "Enviar Cotización"
    $('.Guardar').click(function() {
        // Obtener los datos de la tabla para enviar al servidor
        var tableData = [];

        $('#table-container tbody tr').each(function() {
            var rowData = {};
            $(this).find('td').each(function(index, item) {
                var columnName = $(item).attr('data-column') || index; // Usa el índice si data-column es indefinido
                var cellValue;

                // Verificar si es un campo de entrada
                var inputField = $(item).find('input');
                if (inputField.length > 0) {
                    cellValue = inputField.val();
                } else {
                    cellValue = $(item).text();
                }

                rowData[columnName] = cellValue;
            });
            tableData.push(rowData);
        });
        
        console.log(JSON.stringify(tableData));

        // Enviar los datos al servidor (puedes usar Ajax para esto)
        $.ajax({
            url: '/web/Controller/BdControllerConfig/enviar_cotizacion/enviar_cotizacion.php', // Reemplaza con la URL correcta
            method: 'POST',
            data: { cotizacionData: JSON.stringify(tableData) },
            success: function(response) {
                // Manejar la respuesta del servidor
                console.log(response);

                // Mostrar una alerta de éxito
                Swal.fire({
                    title: '¡Cotización enviada con éxito!',
                    text: 'La cotización se envió con éxito y pasará a estado de revisión.',
                    icon: 'success'
                }).then(function() {
                    // Redirigir al usuario a la página deseada
                    window.location.href = '/web/View/Users/Usersdashboard.html';
                });
            },
            error: function(error) {
                console.error('Error al enviar la cotización al servidor');
            }
        });
    });
});
