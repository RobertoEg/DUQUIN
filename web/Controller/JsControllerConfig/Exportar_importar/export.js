$(document).ready(function() {
    // Manejador de eventos para el botón de exportar
    $('#export-button').on('click', function() {
        // Realizar una solicitud AJAX para obtener los datos en JSON
        $.ajax({
            url: '/web/Controller/BdControllerConfig/items.php',
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response && response.length > 0) {
                    // Crear un nuevo arreglo para los datos de Excel con el encabezado
                    var excelData = [];

                    // Agregar el encabezado personalizado
                    excelData.push(["Item", "CodigoBarras", "Referencia", "Descripcion", "UND", "PrecioBase", "PrecioDescuento","DescuentoPorcentaje"]);

                    // Agregar los datos obtenidos de la consulta JSON
                    for (var i = 0; i < response.length; i++) {
                        var precioBase = parseFloat(response[i].Precio.replace(/\./g, '').replace('$', '').replace(',', '.'));
                        var precioDescuento = precioBase; // Precio con Descuento en relación con el precio base en la misma fila
                        var DescuentoPorcentaje = precioBase;
                    
                        excelData.push([
                            response[i].Item,
                            response[i].EAN13,
                            response[i].Referencia,
                            response[i].Descripcion,
                            response[i].UM,
                            precioBase,
                            precioDescuento, // Precio con Descuento
                            DescuentoPorcentaje,
                        ]);
                    }
                    
                    // Convertir los datos en un libro de Excel con formato de celda
                    var workbook = XLSX.utils.book_new();
                    var worksheet = XLSX.utils.aoa_to_sheet(excelData);
                    // Aplicar el formato de celda
                    worksheet['F2'].t = 'n';
                    worksheet['F2'].z = '0';
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotizacion Duquin');

                    // Generar un nombre de archivo
                    var today = new Date();
                    var fileName = 'exported_data_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.xlsx';

                    // Guardar el archivo Excel y ofrecerlo para su descarga
                    XLSX.writeFile(workbook, fileName);
                } else {
                    alert('No se encontraron datos para exportar.');
                }
            },
            error: function() {
                alert('Error al obtener los datos para exportar.');
            }
        });
    });
});
