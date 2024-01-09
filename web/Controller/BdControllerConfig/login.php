<?php
session_start(); // Iniciar la sesión

// Datos de conexión a la base de datos
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Obtener los datos del formulario
$usernameInput = $_POST['username'];
$passwordInput = $_POST['password'];

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay errores en la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Consultar la base de datos para verificar el usuario y contraseña en la tabla admin
$sqlAdmin = "SELECT * FROM admin WHERE email = ? AND contrasena = ?";
$stmtAdmin = $conn->prepare($sqlAdmin);
$stmtAdmin->bind_param("ss", $usernameInput, $passwordInput);
$stmtAdmin->execute();
$resultAdmin = $stmtAdmin->get_result();

if ($resultAdmin->num_rows > 0) {
    // Usuario es administrador, definir el rol en la sesión y redirigir al panel de control de administrador
    $_SESSION['userRole'] = 'admin';
    header("Location: /web/View/Admin/admindashboard.html");
} else {
    // El usuario no es administrador, consultar en la tabla users
    $sqlUser = "SELECT * FROM users WHERE email = ? AND contrasena = ?";
    $stmtUser = $conn->prepare($sqlUser);
    $stmtUser->bind_param("ss", $usernameInput, $passwordInput);
    $stmtUser->execute();
    $resultUser = $stmtUser->get_result();

    if ($resultUser->num_rows > 0) {
        // Usuario es un usuario normal, definir el rol y la razón social en la sesión
        $row = $resultUser->fetch_assoc();
        $_SESSION['userRole'] = 'user';
        $_SESSION['userNIT'] = $row['nit'];
        $_SESSION['userRazonSocial'] = $row['razon_social']; // Guardar la razón social en la sesión
        header("Location: items.php?nit=" . urlencode($row['nit']));
        header("Location: items_segunda_tabla.php?nit=" . urlencode($row['nit']));
        header("Location: redireccion.php?nit=" . urlencode($row['nit']));
        exit; 
    } else {
        // El usuario y contraseña son incorrectos, mostrar un mensaje de error y redirigir a la página de inicio
        echo "<script>alert('Acceso no permitido. Por favor, verifique el usuario y la contraseña.'); window.location.href = 'index.html';</script>";
    }
}

// Cerrar los statements y la conexión a la base de datos
$stmtAdmin->close();
$stmtUser->close();
$conn->close();
?>
