<?php
// Datos de conexión a la base de datos
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Obtener el correo electrónico y el código ingresados por el usuario
$email = $_POST['email'];
$code = $_POST['codigo'];

// Conectar a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay algún error en la conexión
if ($conn->connect_error) {
    die("Error en la conexión a la base de datos: " . $conn->connect_error);
}

// Consulta SQL para verificar si el correo electrónico y el código coinciden en la tabla "users"
$sql_users = "SELECT * FROM users WHERE email = '$email' AND codigo = '$code'";
$result_users = $conn->query($sql_users);

// Consulta SQL para verificar si el correo electrónico y el código coinciden en la tabla "admin"
$sql_admin = "SELECT * FROM admin WHERE email = '$email' AND codigo = '$code'";
$result_admin = $conn->query($sql_admin);

// Verificar si se encontró algún registro con el correo electrónico y el código ingresados en ambas tablas
if ($result_users->num_rows > 0 || $result_admin->num_rows > 0) {
    // Si el correo electrónico y el código coinciden en al menos una tabla, devolver 'success'
    echo "success";
} else {
    // Si el correo electrónico y el código no coinciden en ninguna tabla, devolver 'error'
    echo "error";
}

// Cerrar la conexión a la base de datos
$conn->close();

?>
