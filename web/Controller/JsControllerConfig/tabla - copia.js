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
    
    function saveItemData(cell) {
        var itemID = cell.data('item-id');
        var i = cell.closest('tr').index();
        var precioBase = parseFloat(cell.closest('tr').find('.edit-price').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
        var precioDescuento = parseFloat(cell.closest('tr').find('.edit-price-discount').text().replace(/\./g, '').replace('$', '').replace(',', '.'));
    
        // Verificar si el ítem ya existe en el almacenamiento de datos
        if (storedItemData[itemID]) {
            storedItemData[itemID].precioBase = precioBase;
            storedItemData[itemID].precioDescuento = precioDescuento;
            storedItemData[itemID].descuentoPorcentaje = (precioBase !== 0) ? ((precioBase - precioDescuento) / precioBase) * 100 : 0;
        } else {
            storedItemData[itemID] = {
                precioBase: precioBase,
                precioDescuento: precioDescuento,
                descuentoPorcentaje: (precioBase !== 0) ? ((precioBase - precioDescuento) / precioBase) * 100 : 0
            };
        }
    
        localStorage.setItem('itemData', JSON.stringify(storedItemData));
    }
    
     // Manejador de eventos para el botón de importar
     $('#import-file').on('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                importedData = XLSX.utils.sheet_to_json(worksheet);
                localStorage.setItem('importedData', JSON.stringify(importedData));

                // Llena la tabla con los datos importados
                displayImportedData();
            };
            reader.readAsBinaryString(file);
        }
    });
// Función para llenar la tabla con los datos importados
function displayImportedData() {
    var tbodyItems = document.getElementById("tbodyItems");
    tbodyItems.innerHTML = "";

    importedData.forEach(function (item, index) {
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

        cellId.innerHTML = index + 1;
        cellItem.innerHTML = item["Item"];
        cellEAN13.innerHTML = item["Código de Barras"];
        cellReferencia.innerHTML = item["Referencia"];
        cellDescripcion.innerHTML = item["Descripción"];
        cellUM.innerHTML = item["UND"];
        cellPrecioBase.innerHTML = formatMoneyWithoutDecimals(parseFloat(item["Precio Base"]));
        cellPrecioDescuento.innerHTML = formatMoneyWithoutDecimals(parseFloat(item["Precio con Descuento"]));
        cellDescuentoPorcentaje.innerHTML = formatPercentage(parseFloat(item["Descuento %"]));

        // Agregar estos campos al objeto itemData en el almacenamiento local
        var itemID = item["Item"] + '_' + index; // Genera un itemID único
        storedItemData[itemID] = {
            precioBase: parseFloat(item["Precio Base"].replace(/\./g, '').replace('$', '').replace(',', '.')),
            precioDescuento: parseFloat(item["Precio con Descuento"].replace(/\./g, '').replace('$', '').replace(',', '.')),
            descuentoPorcentaje: (parseFloat(item["Precio Base"].replace(/\./g, '').replace('$', '').replace(',', '.')) !== 0) ? 
                                ((parseFloat(item["Precio Base"].replace(/\./g, '').replace('$', '').replace(',', '.')) - parseFloat(item["Precio con Descuento"].replace(/\./g, '').replace('$', '').replace(',', '.'))) /
                                parseFloat(item["Precio Base"].replace(/\./g, '').replace('$', '').replace(',', '.'))) * 100 : 0,
            EAN13: item["Código de Barras"],
            Referencia: item["Referencia"],
            Descripcion: item["Descripción"],
            UM: item["UND"]
        };
    });

    // Luego de agregar todos los datos importados, asegúrate de guardar todo en el almacenamiento local
    localStorage.setItem('itemData', JSON.stringify(storedItemData));
}


        // Establecer valores iniciales para Precio Base, Precio con Descuento y Descuento %
        var precioBase = parseFloat(item["Precio Base"].replace(/\./g, '').replace('$', '').replace(',', '.'));
        var precioDescuento = precioBase;
        var descuentoPorcentaje = 0;

        // Llenar las celdas con los valores iniciales
        cellPrecioBase.innerHTML = '<div contenteditable="true" class="edit-price" data-item-id="' + item["Item"] + '">' + formatMoneyWithoutDecimals(precioBase) + '</div>';
        cellPrecioDescuento.innerHTML = '<div contenteditable="true" class="edit-price-discount" data-item-id="' + item["Item"] + '">' + formatMoneyWithoutDecimals(precioDescuento) + '</div>';
        cellDescuentoPorcentaje.innerHTML = '<div contenteditable="true" class="edit-discount-percentage" data-item-id="' + item["Item"] + '">' + formatPercentage(descuentoPorcentaje) + '</div>';

        // Verificar si el precio con descuento es mayor que el precio base
        if (precioDescuento > precioBase) {
            cellPrecioDescuento.querySelector('.edit-price-discount').classList.add('red-text');
        }

        // Guardar los datos del ítem en el almacenamiento local
        saveItemData(cellPrecioBase);
        saveItemData(cellPrecioDescuento);
        saveItemData(cellDescuentoPorcentaje);
    });

    
    // Función para dar formato de porcentaje con el signo %
    function formatPercentage(percentage) {
        return Math.round(percentage) + '%';
    }



