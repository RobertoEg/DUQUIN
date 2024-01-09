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

// Consulta SQL para obtener los items de la orden 2
$sql = "SELECT * FROM items WHERE order_id = 2";

$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    // Obtener los datos de cada fila y agregarlos al array
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Cerrar la conexión a la base de datos
$conn->close();

// Imprimir los datos en formato JSON
echo json_encode($data);
?>
