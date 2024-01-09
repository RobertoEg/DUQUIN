<?php
// Datos de conexión a la base de datos
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Obtener el correo electrónico ingresado por el usuario
$email = $_POST['email'];
$newPassword = $_POST['newPassword']; // Obtener la nueva contraseña ingresada por el usuario

// Conectar a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay algún error en la conexión
if ($conn->connect_error) {
    die("Error en la conexión a la base de datos: " . $conn->connect_error);
}

// Consulta SQL para verificar si el correo electrónico existe en la tabla "users"
$sqlUsers = "SELECT * FROM users WHERE email = '$email'";
$resultUsers = $conn->query($sqlUsers);

// Consulta SQL para verificar si el correo electrónico existe en la tabla "admin"
$sqlAdmin = "SELECT * FROM admin WHERE email = '$email'";
$resultAdmin = $conn->query($sqlAdmin);

// Verificar si se encontró algún registro con el correo electrónico ingresado
if ($resultUsers->num_rows > 0 || $resultAdmin->num_rows > 0) {
    // Si el correo electrónico existe en alguna de las tablas, actualizar la contraseña
    $sqlUpdatePassword = "UPDATE users SET contrasena = '$newPassword' WHERE email = '$email'";
    $conn->query($sqlUpdatePassword);
    
    $sqlUpdatePasswordAdmin = "UPDATE admin SET contrasena = '$newPassword' WHERE email = '$email'";
    $conn->query($sqlUpdatePasswordAdmin);

    // Restablecer el código de restablecimiento y la fecha de expiración
    $sqlResetCode = "UPDATE users SET codigo = NULL, codigo_expiracion = NULL WHERE email = '$email'";
    $conn->query($sqlResetCode);
    
    $sqlResetCodeAdmin = "UPDATE admin SET codigo = NULL, codigo_expiracion = NULL WHERE email = '$email'";
    $conn->query($sqlResetCodeAdmin);

    echo "success"; // Devolver 'success' si la contraseña se actualizó correctamente
} else {
    // Si el correo electrónico no existe en ninguna de las tablas
    echo "error"; // Devolver 'error' si el correo electrónico no está registrado
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
