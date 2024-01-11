$(document).ready(function() {
    // Variables globales para la paginación
    var itemsPerPage = 14;
    var currentPage = 0;
    var data = [];
    var storedItemData = JSON.parse(localStorage.getItem('itemData')) || [];

    // Realizar una solicitud AJAX al script PHP que devuelve los datos
    $.ajax({
        url: '/web/Controller/BdControllerConfig/items.php', // Asegúrate de que la ruta sea correcta
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Verificar si se recibieron datos
            if (response && response.length > 0) {
                data = response;

                // Llama a la función para mostrar la página inicial
                displayPage();

                // Escuchar el evento clic en el botón "Siguiente"
                $('#next-button').on('click', function() {
                    nextPage();
                });

                // Escuchar el evento clic en el botón "Anterior"
                $('#prev-button').on('click', function() {
                    prevPage();
                });
            } else {
                var tbodyItems = document.getElementById("tbodyItems");
                var row = tbodyItems.insertRow(0);
                var cellError = row.insertCell(0);
                cellError.colSpan = 9; // Ajusta el número de columnas
                cellError.innerHTML = "No se encontraron datos.";
            }
        },
        error: function() {
            var tbodyItems = document.getElementById("tbodyItems");
            var row = tbodyItems.insertRow(0);
            var cellError = row.insertCell(0);
            cellError.colSpan = 9;
            cellError.innerHTML = "Ocurrió un error al cargar los datos.";
        }
    });

    // Función para dar formato de pesos colombianos sin decimales
    function formatMoneyWithoutDecimals(amount) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
    }

// Función para mostrar las filas correspondientes a la página actual
function displayPage() {
    const tbodyItems = document.getElementById("tbodyItems");
    tbodyItems.innerHTML = "";

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        var item = data[i];
        var row = tbodyItems.insertRow(tbodyItems.rows.length);
        var cellId = row.insertCell(0);
        var cellItem = row.insertCell(1);
        var cellEAN13 = row.insertCell(2);
        var cellReferencia = row.insertCell(3);
        var cellDescripcion = row.insertCell(4);
        var cellUM = row.insertCell(5);
        var cellPrecioBase = row.insertCell(6);
        var cellPrecioDescuento = row.insertCell(7);
        var cellDescuentoPorcentaje = row.insertCell(8);

        cellId.innerHTML = i + 1;
        cellItem.innerHTML = item.Item;
        cellEAN13.innerHTML = item.EAN13;
        cellReferencia.innerHTML = item.Referencia;
        cellDescripcion.innerHTML = item.Descripcion;
        cellUM.innerHTML = item.UM;

        // Dar formato de pesos colombianos al Precio Base
        var precioBase = item.Precio;
        cellPrecioBase.innerHTML = '<div contenteditable="true" class="edit-price" data-item-id="' + item.Item + '">' + formatMoneyWithoutDecimals(precioBase) + '</div>';

        // Establecer valores iniciales para Precio con Descuento y Descuento %
        var precioDescuento = precioBase;
        var descuentoPorcentaje = 0;

        // Verificar si hay datos guardados para este ítem
        if (storedItemData[item.Item]) {
            precioBase = storedItemData[item.Item].precioBase;
            precioDescuento = storedItemData[item.Item].precioDescuento;
            descuentoPorcentaje = storedItemData[item.Item].descuentoPorcentaje;
        }

        cellPrecioBase.innerHTML = '<div contenteditable="true" class="edit-price" data-item-id="' + item.Item + '">' + formatMoneyWithoutDecimals(precioBase) + '</div>';
        cellPrecioDescuento.innerHTML = '<div contenteditable="true" class="edit-price-discount" data-item-id="' + item.Item + '">' + formatMoneyWithoutDecimals(precioDescuento) + '</div>';
        cellDescuentoPorcentaje.innerHTML = '<div contenteditable="true" class="edit-discount-percentage" data-item-id="' + item.Item + '">' + formatPercentage(descuentoPorcentaje) + '</div>';

        // Verificar si el precio con descuento es mayor que el precio base
        if (precioDescuento > precioBase) {
            cellPrecioDescuento.querySelector('.edit-price-discount').classList.add('red-text');
        }
    }
}


    // Función para avanzar a la siguiente página
    function nextPage() {
        if (currentPage < Math.floor(data.length / itemsPerPage)) {
            currentPage++;
        } else {
            currentPage = 0; // Volver al principio si llegamos al final
        }
        displayPage();
    }

    // Función para retroceder a la página anterior
    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
        } else {
            currentPage = Math.floor(data.length / itemsPerPage); // Ir al final si estamos en la primera página
        }
        displayPage();
    }

    // Escuchar el evento keydown para permitir solo números en las celdas de edición
    $(document).on('keydown', '.edit-price, .edit-price-discount, .edit-discount-percentage', function(e) {
        // Permitir solo números, punto decimal y las teclas de navegación (por ejemplo, flechas, borrar)
        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === '.')) {
            e.preventDefault();
        }

        // Detectar si se presionó la tecla "Enter" (código 13)
        if (e.keyCode === 13) {
            // Cuando se presiona "Enter", se ejecuta el evento "blur"
            $(this).blur();
        }
    });

    // Escuchar el evento blur en las celdas de edición de precio
    $(document).on('blur', '.edit-price', function() {
        var enteredValue = $(this).text();
        var numericValue = parseFloat(enteredValue.replace(/\./g, '').replace('$', '').replace(',', '.'));
        if (isNaN(numericValue)) {
            // Si el valor ingresado no es un número, establecer el contenido de esta celda en 0
            $(this).text(formatMoneyWithoutDecimals(0));
            numericValue = 0; // Actualizar el valor numérico

            // Resetear el precio con descuento y el porcentaje de descuento
            var $row = $(this).closest('tr');
            var $discountPriceCell = $row.find('.edit-price-discount');
            var $percentageCell = $row.find('.edit-discount-percentage');
            $discountPriceCell.text(formatMoneyWithoutDecimals(0));
            $percentageCell.text('0%');

        } else {
            // Solo aplicar el formato sin decimales sin redondear
            $(this).text(formatMoneyWithoutDecimals(numericValue));

            // Si el precio base es igual a 0, establecer el precio con descuento en $0 y el descuento % en 0%
            if (numericValue === 0) {
                var $discountPriceCell = $(this).closest('tr').find('.edit-price-discount');
                var $percentageCell = $(this).closest('tr').find('.edit-discount-percentage');
                $discountPriceCell.text(formatMoneyWithoutDecimals(0));
                $percentageCell.text('0%');
            }
        }
        saveItemData($(this));
    });

    // Escuchar el evento blur en las celdas de edición de precio con descuento
    $(document).on('blur', '.edit-price-discount', function() {
        var enteredValue = $(this).text();
        var numericValue = parseFloat(enteredValue.replace(/\./g, '').replace('$', '').replace(',', '.'));
        if (!isNaN(numericValue)) {
            // Solo aplicar el formato sin decimales sin redondear
            $(this).text(formatMoneyWithoutDecimals(numericValue));
            updateDiscount($(this));

            // Si el precio con descuento es igual a 0, establecer el descuento % en 0%
            if (numericValue === 0) {
                var $percentageCell = $(this).closest('tr').find('.edit-discount-percentage');
                $percentageCell.text('0%');
            }
        } else {
            // Si el valor ingresado no es un número válido, restaurar el valor original con el signo "$"
            var $row = $(this).closest('tr');
            var itemID = $row.find('.edit-price').data('item-id');
            var precioBase = parseFloat($row.find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
            $(this).text(formatMoneyWithoutDecimals(precioBase));
            updateDiscount($(this));
        }
        saveItemData($(this));
    });

    // Escuchar el evento blur en las celdas de edición de descuento porcentual
    $(document).on('blur', '.edit-discount-percentage', function() {
        var enteredValue = $(this).text();
        var numericValue = parsePercentageValue(enteredValue);
        if (!isNaN(numericValue)) {
            // Agregar el signo de porcentaje al valor ingresado
            $(this).text(formatPercentage(numericValue));
            var itemID = $(this).data('item-id');
            var precioBase = parseFloat($(this).closest('tr').find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
            var descuento = (precioBase * numericValue) / 100;
            var precioConDescuento = precioBase - descuento;
            $(this).closest('tr').find('.edit-price-discount').text(formatMoneyWithoutDecimals(precioConDescuento));
            if (precioConDescuento > precioBase) {
                $(this).closest('tr').find('.edit-price-discount').addClass('red-text');
            } else {
                $(this).closest('tr').find('.edit-price-discount').removeClass('red-text');
            }
        } else {
            // Si el valor ingresado no es un número válido, restaurar el valor original a 0%
            $(this).text('0%');
            var $row = $(this).closest('tr');
            var precioBase = parseFloat($row.find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
            $row.find('.edit-price-discount').text(formatMoneyWithoutDecimals(precioBase));
        }
        saveItemData($(this));
    });

    function parsePercentageValue(percentageValue) {
        var numericString = percentageValue.replace(/[^0-9.]/g, '');
        return parseFloat(numericString);
    }

    function updateDiscount(cell) {
        var itemID = cell.data('item-id');
        var precioBase = parseFloat(cell.closest('tr').find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
        var precioConDescuento = parseFloat(cell.text().replace(/\./g, '').replace('$', '').replace(',', '.'));
    
        // Calcular el porcentaje de descuento
        var descuento = 0;
        if (precioBase !== 0) {
            descuento = ((precioBase - precioConDescuento) / precioBase) * 100;
        }
    
        // Limitar el descuento máximo al 100%
        descuento = Math.min(100, Math.max(0, descuento));
    
        // Mostrar el porcentaje de descuento en negativo si el precio con descuento es mayor que el precio base
        if (precioConDescuento > precioBase) {
            cell.addClass('red-text');
            // Calcular el porcentaje en negativo
            descuento = -descuento;
        } else {
            cell.removeClass('red-text');
        }
    
        // Agregar el signo de porcentaje al campo de porcentaje
        cell.closest('tr').find('.edit-discount-percentage').text(formatPercentage(descuento));
    }
    
    // Función para guardar los datos del ítem
function saveItemData(cell) {
    var itemID = cell.data('item-id');
    var i = cell.closest('tr').index();
    var precioBase = parseFloat(cell.closest('tr').find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
    var precioDescuento = parseFloat(cell.closest('tr').find('.edit-price-discount').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
    var descuentoPorcentaje = parsePercentageValue(cell.closest('tr').find('.edit-discount-percentage').text());

    // Verificar si el ítem ya existe en el almacenamiento de datos
    if (storedItemData[itemID]) {
        storedItemData[itemID].codigoBarras = data[i].EAN13;
        storedItemData[itemID].referencia = data[i].Referencia;
        storedItemData[itemID].descripcion = data[i].Descripcion;
        storedItemData[itemID].unidadMedida = data[i].UM;
        storedItemData[itemID].precioBase = precioBase;
        storedItemData[itemID].precioDescuento = precioDescuento;
        storedItemData[itemID].descuentoPorcentaje = descuentoPorcentaje;
    } else {
        storedItemData[itemID] = {
            Item: itemID,  // Agregamos el número de ítem
            codigoBarras: data[i].EAN13,
            referencia: data[i].Referencia,
            descripcion: data[i].Descripcion,
            unidadMedida: data[i].UM,
            precioBase: precioBase,
            precioDescuento: precioDescuento,
            descuentoPorcentaje: descuentoPorcentaje
        };
    }

    localStorage.setItem('itemData', JSON.stringify(storedItemData));
}
    $('.Guardar').on('click', function() {
        // Obtener datos del localStorage
        var storedItemData = JSON.parse(localStorage.getItem('itemData')) || {};
    
        // Filtrar datos que cumplen con la condición (por ejemplo, Precio con Descuento mayor a 0)
        var filteredData = Object.values(storedItemData).filter(function(item) {
            // Verificar si el elemento tiene la propiedad 'precioDescuento' definida
            return item && typeof item.precioDescuento !== 'undefined' && item.precioDescuento > 0;
        });
    
        // Construir un objeto JSON con los datos filtrados
        var jsonData = {
            cotizacion: filteredData
        };
        console.log(jsonData)
    
        // Limpiar el localStorage y la tabla en la interfaz web
        clearLocalStorageAndTable();
    
        // Enviar el JSON al archivo PHP usando AJAX
        $.ajax({
            url: '/web/Controller/BdControllerConfig/Enviar_cotizacion/enviar_cotizacion_web.php',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',  // Añade esta línea
            data: JSON.stringify({ cotizacion: jsonData }),
            success: function(response) {
                // Manejar la respuesta del servidor si es necesario
                console.log(response);
            },
            error: function() {
                // Manejar errores de la solicitud AJAX si es necesario
                console.error('Error al enviar la cotización al servidor.');
            }
        });
    
        // Muestra un mensaje de éxito utilizando la librería SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Cotización Enviada',
            text: 'La cotización se ha enviado correctamente.'
        }).then((result) => {
            // Después de que el usuario hace clic en "Aceptar", recargar la página
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    });
    
    function clearLocalStorageAndTable() {
        // Establecer el localStorage en null
        localStorage.setItem('itemData', null);
    
        // Limpiar la tabla en la interfaz web
        clearTable();
    }
    
    function clearTable() {
        // Limpia la tabla en la interfaz web
        const tbodyItems = document.getElementById("tbodyItems");
        tbodyItems.innerHTML = "";
    
        // Reinicializa la tabla llamando a la función displayPage()
        displayPage();
    }
    
    
    
    // Función para dar formato de porcentaje con el signo %
    function formatPercentage(percentage) {
        return Math.round(percentage) + '%';
    }
});
