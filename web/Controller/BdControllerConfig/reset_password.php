<?php
// Datos de conexión a la base de datos
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Obtener el correo electrónico ingresado por el usuario
$email = $_POST['email'];

// Conectar a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay algún error en la conexión
if ($conn->connect_error) {
    die("Error en la conexión a la base de datos: " . $conn->connect_error);
}

// Consulta SQL para verificar si el correo electrónico existe en la tabla "users"
$sqlUser = "SELECT * FROM users WHERE email = '$email'";
$resultUser = $conn->query($sqlUser);

// Consulta SQL para verificar si el correo electrónico existe en la tabla "admin"
$sqlAdmin = "SELECT * FROM admin WHERE email = '$email'";
$resultAdmin = $conn->query($sqlAdmin);

// Verificar si se encontró algún registro con el correo electrónico ingresado
if ($resultUser->num_rows > 0 || $resultAdmin->num_rows > 0) {
    // Si el correo electrónico existe en alguna de las dos tablas, generar un código de restablecimiento de 6 dígitos
    $codigoRestablecimiento = generarCodigo();

    // Obtener la fecha y hora actual en la zona horaria de Colombia (America/Bogota)
    date_default_timezone_set('America/Bogota');
    $fechaHoraActual = date('Y-m-d H:i:s');

    // Guardar el código de restablecimiento y la fecha y hora actual en "codigo" y "codigo_expiracion", respectivamente
    if ($resultUser->num_rows > 0) {
        $sqlGuardarCodigoUser = "UPDATE users SET codigo = '$codigoRestablecimiento', codigo_expiracion = '$fechaHoraActual' WHERE email = '$email'";
        $conn->query($sqlGuardarCodigoUser);
    }

    if ($resultAdmin->num_rows > 0) {
        $sqlGuardarCodigoAdmin = "UPDATE admin SET codigo = '$codigoRestablecimiento', codigo_expiracion = '$fechaHoraActual' WHERE email = '$email'";
        $conn->query($sqlGuardarCodigoAdmin);
    }

    // Configura las credenciales de la API de Mailjet
    $apiKey = 'fbb3309dd9ed1146a5268c599b322172'; // Reemplaza con tu clave de API de Mailjet
    $apiSecret = '354ec61b946c0552d5adf2892b6bc551'; // Reemplaza con tu secreto de API de Mailjet

    // Configura el destinatario del correo electrónico
    $destinatario = $email; // El mismo correo ingresado previamente

    // Crea el contenido del correo electrónico
    $asunto = 'Código de restablecimiento de contraseña';
    $mensaje = "Estimado/a,\n\nHemos recibido una solicitud para restablecer la contraseña de su cuenta.\n\nSu código de restablecimiento es:\n\n----- $codigoRestablecimiento -----\n\nSi no realizó esta solicitud, puede ignorar este correo electrónico.\n\nGracias,\nEl Gigante de Hogar\n\nEste correo es confidencial y pertenece a El Gigante del Hogar. No compartir ni divulgar esta información.";

    // Configura los datos del correo electrónico
    $data = [
        'Messages' => [
            [
                'From' => [
                    'Email' => 'correo.pedidos@gigantedelhogar.com',
                    'Name' => 'El Gigante de Hogar Restart Password'
                ],
                'To' => [
                    [
                        'Email' => $destinatario,
                        'Name' => 'Destinatario'
                    ]
                ],
                'Subject' => $asunto,
                'TextPart' => $mensaje
            ]
        ]
    ];

    // Realiza la solicitud HTTP a la API de Mailjet
    $ch = curl_init('https://api.mailjet.com/v3.1/send');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, $apiKey . ':' . $apiSecret);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Verifica el resultado de la solicitud
    if ($httpCode === 200) {
        echo "success"; // Devolver 'success' si el correo electrónico se envió correctamente

        // Agregar el evento programado para restablecer el código después de 1 minuto, solo si no existe
        $sqlEliminarCodigoUser = "CREATE EVENT IF NOT EXISTS eliminarCodigoUser ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE DO UPDATE users SET codigo = NULL, codigo_expiracion = NULL WHERE email = '$email'";
        $sqlEliminarCodigoAdmin = "CREATE EVENT IF NOT EXISTS eliminarCodigoAdmin ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE DO UPDATE admin SET codigo = NULL, codigo_expiracion = NULL WHERE email = '$email'";
        
        if ($resultUser->num_rows > 0) {
            $conn->query($sqlEliminarCodigoUser);
        }
        
        if ($resultAdmin->num_rows > 0) {
            $conn->query($sqlEliminarCodigoAdmin);
        }
    } else {
        echo "error"; // Devolver 'error' si ocurrió algún problema al enviar el correo electrónico
    }
} else {
    // Si el correo electrónico no existe en ninguna de las dos tablas
    echo "error"; // Devolver 'error' si el correo electrónico no está registrado
}

// Cerrar la conexión a la base de datos
$conn->close();

// Función para generar un código de restablecimiento de 6 dígitos
function generarCodigo()
{
    return str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
}

?>
