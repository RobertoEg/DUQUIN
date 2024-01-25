<?php
session_start(); // Iniciar la sesión

$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Configurar la configuración regional para español
setlocale(LC_TIME, 'es_ES.UTF-8');

// Obtener el NIT del usuario de la sesión
if (isset($_SESSION['userNIT'])) {
    $userNIT = $_SESSION['userNIT'];
} else {
    // Si no se proporciona el NIT en la sesión, muestra un mensaje de error
    echo json_encode(array("error" => "NIT de usuario no encontrado en la sesión."));
    exit;
}

// Consulta SQL para obtener el nombre (Razon_social) del usuario
$sqlUsuario = "SELECT Razon_social FROM Users WHERE nit = ?";
$stmtUsuario = $conn->prepare($sqlUsuario);

// Verificar si la preparación de la consulta fue exitosa
if ($stmtUsuario) {
    // Vincular parámetros y ejecutar la consulta
    $stmtUsuario->bind_param("s", $userNIT);
    $stmtUsuario->execute();

    // Obtener resultados
    $resultUsuario = $stmtUsuario->get_result();

    if ($resultUsuario->num_rows > 0) {
        $rowUsuario = $resultUsuario->fetch_assoc();
        $razonSocial = $rowUsuario["Razon_social"];

        // Consulta SQL para obtener órdenes aprobadas del usuario actual
        $sqlOrders = "SELECT * FROM Orders WHERE user_nIT = ? AND Aprobada = 'SÍ'";
        $stmtOrders = $conn->prepare($sqlOrders);

        // Verificar si la preparación de la consulta fue exitosa
        if ($stmtOrders) {
            // Vincular parámetros y ejecutar la consulta
            $stmtOrders->bind_param("s", $userNIT);
            $stmtOrders->execute();

            // Obtener resultados
            $resultOrders = $stmtOrders->get_result();

            $ordersData = array();

            if ($resultOrders->num_rows > 0) {
                while ($rowOrders = $resultOrders->fetch_assoc()) {
                    $ordersData[] = array(
                        "razonSocial" => $razonSocial,
                        "order_id" => $rowOrders["order_id"],
                        "fecha_creacion" => strftime("%B %e, %Y", strtotime($rowOrders["fecha_creacion"]))
                    );
                }
            }

            // Devolver los datos en formato JSON
            echo json_encode($ordersData);
            
            // Cerrar la declaración preparada de Orders
            $stmtOrders->close();
        } else {
            echo json_encode(array("error" => "Error en la preparación de la consulta de Orders."));
        }
    } else {
        echo json_encode(array("error" => "No se encontró información de usuario para este NIT."));
    }

    // Cerrar la declaración preparada de Users
    $stmtUsuario->close();
} else {
    echo json_encode(array("error" => "Error en la preparación de la consulta de Users."));
}

// Cerrar la conexión
$conn->close();
?>
