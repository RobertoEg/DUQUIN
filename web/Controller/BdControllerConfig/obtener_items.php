<?php
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Crear una conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta SQL para obtener los items de la orden 3
$orderId = 1;
$sql = "SELECT * FROM items WHERE order_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $orderId); // "i" indica que es un entero
$stmt->execute();

$result = $stmt->get_result();

$data = array();

while ($row = $result->fetch_assoc()) {
    // Formatear los valores en pesos colombianos y el porcentaje
    $row['precio_base'] = '$ ' . number_format($row['precio_base'], 0, ',', '.');
    $row['precio_con_descuento'] = '$ ' . number_format($row['precio_con_descuento'], 0, ',', '.');
    $row['descuento_porcentaje'] = number_format($row['descuento_porcentaje'], 0, ',', '.') . '%';

    $data[] = $row;
}

// Cerrar la sentencia preparada y la conexión a la base de datos
$stmt->close();
$conn->close();

// Imprimir los datos en formato JSON
echo json_encode($data);
?>
