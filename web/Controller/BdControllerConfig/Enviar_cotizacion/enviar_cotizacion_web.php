<?php
session_start();

$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Crear conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se recibió una solicitud POST con datos JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el contenido JSON de la solicitud
    $json_data = file_get_contents("php://input");

    // Decodificar el JSON a un array de PHP
    $data = json_decode($json_data, true);

    // Verificar si la decodificación fue exitosa
    if ($data !== null) {
        // Obtener el NIT del usuario desde la sesión
        $userNIT = $_SESSION['userNIT'];

        // Obtener el último 'order_id' en la tabla 'orders'
        $getLastOrderIDSQL = "SELECT MAX(order_id) AS last_order_id FROM orders";
        $result = $conn->query($getLastOrderIDSQL);

        // Verificar si se ejecutó correctamente la consulta
        if ($result) {
            $row = $result->fetch_assoc();
            $lastOrderID = $row['last_order_id'];

            // Calcular el siguiente 'order_id'
            $nextOrderID = $lastOrderID + 1;

            // Crear una nueva orden
            $insertOrderSQL = "INSERT INTO `orders` (`order_id`, `user_nit`, `fecha_creacion`, `Nueva`) VALUES (?, ?, NOW(), 'Sí')";
            $stmt = $conn->prepare($insertOrderSQL);
            $stmt->bind_param("is", $nextOrderID, $userNIT);
            $stmt->execute();

            // Verificar si se creó correctamente la nueva orden
            if ($stmt->affected_rows > 0) {
                // Insertar datos de la cotización en la tabla 'items'
                foreach ($data['cotizacion']['cotizacion'] as $item) {
                    $insertItemSQL = "INSERT INTO `items` (`order_id`, `item_number`, `codigo_barra`, `referencia`, `descripcion`, `unidad_empaque`, `precio_base`, `precio_con_descuento`, `descuento_porcentaje`, `estado`) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')";

                    $stmtItem = $conn->prepare($insertItemSQL);
                    $stmtItem->bind_param("iiisssddi", $nextOrderID, $item['Item'], $item['codigoBarras'], $item['referencia'], $item['descripcion'], $item['unidadMedida'], $item['precioBase'], $item['precioDescuento'], $item['descuentoPorcentaje']);
                    $stmtItem->execute();
                }

                echo json_encode(["message" => "Cotización enviada con éxito"]);
            } else {
                echo json_encode(["error" => "Error al crear una nueva orden"]);
            }

            $stmt->close();
            $stmtItem->close();
        } else {
            echo json_encode(["error" => "Error al obtener el último 'order_id'"]);
        }
    } else {
        echo json_encode(["error" => "Datos JSON no válidos"]);
    }
} else {
    echo json_encode(["error" => "Solicitud no válida"]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
