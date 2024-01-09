<?php
// Inicia la sesión
session_start();

// Verifica si el usuario ha iniciado sesión y tiene un valor para 'userNIT'
if (isset($_SESSION['userNIT'])) {
    // Recupera el valor de 'userNIT' de la sesión
    $userNIT = $_SESSION['userNIT'];

    // Realiza una conexión a la base de datos
    $servername = "localhost";
    $username = "superadmingh";
    $password = "G-H2023**07";
    $dbname = "cotizaciones_gdh";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    // Construye el nombre de la tabla específica para el usuario
    $tableName = "tabla_items_" . $userNIT;

    // Realiza una consulta SQL para obtener los datos de la tabla específica
    $query = "SELECT * FROM $tableName"; // Ajusta esta consulta según tu estructura de datos

    $result = $conn->query($query);

    // Verifica si se encontraron datos
    if ($result->num_rows > 0) {
        $data = array();

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Devuelve los datos como respuesta JSON
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "No se encontraron datos"]);
    }

    // Cierra la conexión a la base de datos
    $conn->close();
} else {
    // Si el usuario no ha iniciado sesión, devuelves un error o haces una redirección, según tus necesidades.
    echo json_encode(["error" => "El usuario no ha iniciado sesión"]);
}
?>
