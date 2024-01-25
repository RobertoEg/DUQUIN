<?php
session_start();

if (isset($_POST['cotizacionData'])) {
    $jsonData = json_decode($_POST['cotizacionData'], true);

    $servername = "localhost";
    $username = "superadmingh";
    $password = "G-H2023**07";
    $dbname = "cotizaciones_gdh";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    $tableName = "tabla_items_" . $_SESSION['userNIT'];
    $ordersTableExists = false;

    // Comprobar si la tabla 'orders' existe
    $checkOrdersTableSQL = "SHOW TABLES LIKE 'orders'";
    $result = $conn->query($checkOrdersTableSQL);

    if ($result->num_rows > 0) {
        $ordersTableExists = true;
    }

    if (!$ordersTableExists) {
        // Si la tabla 'orders' no existe, créala
        $createOrdersTableSQL = "CREATE TABLE `orders` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `order_id` int(11) DEFAULT NULL,
            `user_nit` varchar(20) DEFAULT NULL,
            `fecha_creacion` datetime DEFAULT NULL,
            `fecha_aprobacion` datetime DEFAULT NULL,
            `Nueva` varchar(100) DEFAULT NULL,
            `Aprobada` varchar(100) DEFAULT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        if ($conn->query($createOrdersTableSQL) === TRUE) {
            // Ahora que la tabla 'orders' ha sido creada, continúa con la inserción de datos
        } else {
            echo json_encode(["error" => "Error al crear la tabla 'orders'"]);
            $conn->close();
            exit;
        }
    }

    $userNIT = $_SESSION['userNIT'];

    // Obtener el último 'order_id' en la tabla 'orders'
    $getLastOrderIDSQL = "SELECT MAX(order_id) AS last_order_id FROM orders";
    $result = $conn->query($getLastOrderIDSQL);
    $row = $result->fetch_assoc();
    $lastOrderID = $row['last_order_id'];

    // Calcular el siguiente 'order_id'
    $nextOrderID = $lastOrderID + 1;

    // Crear una nueva orden
    $insertOrderSQL = "INSERT INTO `orders` (`order_id`, `user_nit`, `fecha_creacion`, `Nueva`) VALUES (?, ?, NOW(), 'Sí')";
    $stmt = $conn->prepare($insertOrderSQL);
    $stmt->bind_param("is", $nextOrderID, $userNIT);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Copiar los datos de la tabla 'tabla_items_nit' a la tabla 'items' y calcular el descuento porcentaje
        $copyDataSQL = "INSERT INTO `items` (`order_id`, `item_number`, `codigo_barra`, `referencia`, `descripcion`, `unidad_empaque`, `precio_base`, `precio_con_descuento`, `descuento_porcentaje`, `estado`) 
            SELECT ?, `Item`, `CodigoBarras`, `Referencia`, `Descripcion`, 'UND', `PrecioBase`, `PrecioDescuento`, (1 - (`PrecioDescuento` / `PrecioBase`)) * 100, 'Pendiente' FROM $tableName";

        $stmtCopy = $conn->prepare($copyDataSQL);
        $stmtCopy->bind_param("i", $nextOrderID);
        $stmtCopy->execute();

        if ($stmtCopy->affected_rows > 0) {
            echo json_encode(["message" => "Cotización enviada con éxito"]);
        } else {
            echo json_encode(["error" => "Error al copiar los datos a la tabla 'items'"]);
        }
    } else {
        echo json_encode(["error" => "Error al crear una nueva orden"]);
    }

    $stmt->close();
    $stmtCopy->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No se recibieron datos JSON"]);
}
?>
