$(document).ready(function() {
    $('input[name="xlsx-file"]').on('change', function(e) {
        var fileInput = e.target;
        var file = fileInput.files[0];

        if (file) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'array' });
                var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                var jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                if (jsonData.length > 0) {
                    var cabeceras = jsonData[0];
                    var itemsConValores = [];

                    for (var i = 1; i < jsonData.length; i++) {
                        var item = jsonData[i];
                        var itemObj = {};

                        for (var j = 0; j < cabeceras.length; j++) {
                            // Verificar si la propiedad es 'CodigoBarras' y usar el nombre correcto
                            if (cabeceras[j] === 'CodigoBarras') {
                                itemObj['CodigoBarras'] = item[j];
                            } else {
                                itemObj[cabeceras[j]] = item[j];
                            }
                        }

                        if (
                            itemObj['PrecioBase'] !== '' &&
                            itemObj['PrecioDescuento'] !== '' &&
                            itemObj['DescuentoPorcentaje'] !== ''
                        ) {
                            // Establecer UND en 'UND'
                            UND = "UND";
                            itemObj["UND"] = "UND";

                            itemsConValores.push(itemObj);
                        }
                        
                    }

                    $('#processed-data').val(JSON.stringify(itemsConValores));

                    console.log('Datos a enviar:', JSON.stringify(itemsConValores)); // Agregar esta línea para depuración

                    $.ajax({
                        url: '/web/Controller/BdControllerConfig/procesar_importacion.php',
                        method: 'POST',
                        data: $('#import-form').serialize(),
                        success: function(response) {
                            Swal.fire({
                                title: '¡Importación exitosa!',
                                text: 'Los datos se importaron correctamente.',
                                icon: 'success'
                            }).then(function() {
                                // Redireccionar a la página import.html
                                window.location.href = '/web/View/Users/import.html';
                            });
                        
                            // Limpiar el selector de archivo y permitir otra importación
                            $('input[name="xlsx-file"]').val('');
                        },
                        
                        error: function(error) {
                            console.error('Error al enviar el formulario al servidor');
                        }
                    });
                } else {
                    console.log('No se encontraron datos en el archivo XLSX.');
                }
            };

            reader.readAsArrayBuffer(file);
        } else {
            console.log('No se ha seleccionado ningún archivo.');
        }
    });
});
