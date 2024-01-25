
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

// Consulta para obtener las nuevas órdenes
$sql = "SELECT users.Razon_social, orders.order_id, orders.fecha_creacion FROM orders
        INNER JOIN users ON orders.user_nit = users.nit
        WHERE orders.Aprobada = 'Sí'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<div class='order-info'>";
        echo "<span class='razon-social'>" . $row["Razon_social"] . "</span>";
        echo "<span class='order_id'>" . $row["order_id"] . "</span><br>";
        echo "<span class='fecha_creacion'>" . date("F j, Y", strtotime($row["fecha_creacion"])) . "</span><br><br>";
        echo "</div>";
    }
    


} else {
  echo "No hay nuevas órdenes.";
}

$conn->close();
?>
