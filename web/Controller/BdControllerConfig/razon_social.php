<?php
session_start(); // Iniciar la sesión

$response = array(); // Crear un arreglo de respuesta

// Comprobar si la razón social está en la sesión
if (isset($_SESSION['userRazonSocial'])) {
    $razonSocial = $_SESSION['userRazonSocial'];

    // Asignar la razón social al arreglo de respuesta
    $response['razon_social'] = $razonSocial;
} else {
    // Si no se encuentra la razón social en la sesión, establecer un mensaje de error en el arreglo de respuesta
    $response['error'] = "Razón Social no disponible en la sesión.";
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
