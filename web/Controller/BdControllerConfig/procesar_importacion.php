<?php
session_start();

if (isset($_POST['processed-data'])) {
    $jsonData = json_decode($_POST['processed-data'], true);

    $servername = "localhost";
    $username = "superadmingh";
    $password = "G-H2023**07";
    $dbname = "cotizaciones_gdh";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    $tableName = "tabla_items_" . $_SESSION['userNIT'];

    // Limpia la tabla eliminando todos los registros existentes
    $deleteTableSQL = "DROP TABLE IF EXISTS $tableName";

    if ($conn->query($deleteTableSQL) === TRUE) {
        $createTableSQL = "CREATE TABLE $tableName (
            Item INT NOT NULL,
            CodigoBarras VARCHAR(255),
            Referencia VARCHAR(255),
            Descripcion VARCHAR(255),
            UND VARCHAR(255) DEFAULT 'UND',
            PrecioBase DECIMAL(10, 2),
            PrecioDescuento DECIMAL(10, 2),
            DescuentoPorcentaje DECIMAL(5, 2),
            UNIQUE (Item)
        )";

        if ($conn->query($createTableSQL) === TRUE) {
            $stmt = $conn->prepare("INSERT INTO $tableName (Item, CodigoBarras, Referencia, Descripcion, PrecioBase, PrecioDescuento, DescuentoPorcentaje) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?)");

            if ($stmt) {
                foreach ($jsonData as $data) {
                    $item = $data['Item']; // El campo "Item" se toma del JSON
                    $codigoBarras = $data['CodigoBarras'];
                    $referencia = $data['Referencia'];
                    $descripcion = $data['Descripcion'];
                    $precioBase = $data['PrecioBase'];
                    $precioDescuento = $data['PrecioDescuento'];
                    $descuentoPorcentaje = $data['DescuentoPorcentaje'];

                    $stmt->bind_param("isssddd", $item, $codigoBarras, $referencia, $descripcion, $precioBase, $precioDescuento, $descuentoPorcentaje);
                    $stmt->execute();
                }

                $stmt->close();
                $conn->close();
                echo json_encode(["message" => "Datos importados con éxito"]);
            } else {
                echo json_encode(["error" => "Error al preparar la consulta de inserción: " . $conn->error]);
            }
        } else {
            echo json_encode(["error" => "Error al crear la tabla: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Error al limpiar la tabla: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "No se recibieron datos JSON"]);
}
?>
