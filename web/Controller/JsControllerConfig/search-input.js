$(document).ready(function() {
    // Obtén una referencia al cuadro de búsqueda
    var searchInput = $(".search-input input");

    // Escucha el evento 'input' en el cuadro de búsqueda
    searchInput.on("input", function() {
        // Obtén el valor de búsqueda ingresado por el usuario y asegúrate de que sea exacto
        var searchValue = $(this).val().toLowerCase().trim();

        // Filtra las filas de la tabla que coincidan exactamente con el valor de búsqueda en los campos relevantes
        $("#table-container tbody tr").filter(function() {
            var row = $(this);
            var item = row.find("td:nth-child(2)").text().toLowerCase().trim();
            var codigoBarras = row.find("td:nth-child(3)").text().toLowerCase().trim();
            var referencia = row.find("td:nth-child(4)").text().toLowerCase().trim();
            var descripcion = row.find("td:nth-child(5)").text().toLowerCase().trim();

            // Comprueba si el valor de búsqueda coincide exactamente con alguno de los campos relevantes
            var matchesSearch = (
                item === searchValue ||
                codigoBarras === searchValue ||
                referencia === searchValue ||
                descripcion === searchValue
            );

            // Muestra las filas que coinciden con la búsqueda, oculta las que no
            row.toggle(matchesSearch);
        });

        // Si el cuadro de búsqueda está vacío, muestra todas las filas
        if (searchValue === "") {
            $("#table-container tbody tr").show();
        }
    });
});
