<?php

session_start(); // Iniciar la sesión
// Datos de conexión a la base de datos
$servername = "localhost";
$username = "superadmingh";
$password = "G-H2023**07";
$dbname = "cotizaciones_gdh";

// Crear la conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay errores en la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener el NIT del usuario de la sesión
if (isset($_SESSION['userNIT'])) {
    $userNIT = $_SESSION['userNIT'];
} else {
    // Si no se proporciona el NIT en la sesión, muestra un mensaje de error
    echo json_encode(array("error" => "NIT de usuario no encontrado en la sesión."));
    exit;
}

// Establecer la URL del Web Service que recibirá el archivo
$url = 'http://192.168.2.15:8064/WSUNOEE/WSUNOEE.asmx?WSDL';

// Establecer las credenciales de autenticación
$username = 'e-commerce';
$password = 'E-commerce2020.';

// Consulta 1 (XML para solicitud SOAP)
$consulta1 = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
   <soap:Header/>
   <soap:Body>
      <tem:EjecutarConsultaXML>
         <!--Optional:-->
         <tem:pvstrxmlParametros><![CDATA[<?xml version="1.0" encoding="utf-8"?>
         <Consulta>
            <NombreConexion>Pruebas</NombreConexion>
            <IdCia>1</IdCia>
            <IdProveedor>ES</IdProveedor>
            <IdConsulta>CONSULTA_ITEMS_PROVEEDOR</IdConsulta>
            <Usuario>e-commerce</Usuario>
            <Clave>E-commerce2020.</Clave>
            <Parametros>
                <id_cia>1</id_cia>
            </Parametros>
         </Consulta>
         ]]></tem:pvstrxmlParametros>
      </tem:EjecutarConsultaXML>
   </soap:Body>
</soap:Envelope>';

// Relación de ID_Proveedor con NIT utilizando el archivo relacion.php
require_once 'relacion.php';

// Función para buscar NIT por ID de proveedor utilizando la relación
function buscarNITPorIDProveedor($idProveedor) {
    global $relacion; // Variable definida en relacion.php
    if (isset($relacion[$idProveedor])) {
        return $relacion[$idProveedor];
    }
    return null;
}

// Iniciar una sesión cURL para la consulta 1
$ch1 = curl_init();

// Establecer las opciones de la sesión cURL para la consulta 1
curl_setopt($ch1, CURLOPT_URL, $url);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch1, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch1, CURLOPT_POST, true);
curl_setopt($ch1, CURLOPT_POSTFIELDS, $consulta1);
curl_setopt($ch1, CURLOPT_HTTPHEADER, array('Content-Type: application/soap+xml; charset=utf-8', 'Content-Length: '.strlen($consulta1)));

// Ejecutar la sesión cURL para la consulta 1 y obtener la respuesta
$response1 = curl_exec($ch1);

// Verificar si se produjo algún error durante la ejecución de la sesión cURL para la consulta 1
if (curl_errno($ch1)) {
    echo json_encode(array("error" => 'Error en la sesión cURL para la consulta 1: ' . curl_error($ch1)));
    exit;
}

// Cerrar la sesión cURL para la consulta 1
curl_close($ch1);

// Parsear la respuesta XML
$xml = simplexml_load_string($response1);

// Obtener la razón social del usuario
$razonSocial = "";

// Buscar en la tabla 'users'
$sqlUsers = "SELECT razon_social FROM users WHERE nit = ?";
$stmtUsers = $conn->prepare($sqlUsers);
$stmtUsers->bind_param("s", $userNIT);
$stmtUsers->execute();
$resultUsers = $stmtUsers->get_result();

if ($resultUsers->num_rows > 0) {
    $row = $resultUsers->fetch_assoc();
    $razonSocial = $row['razon_social'];
} 

 // Limpiar la razón social para que sea un nombre de tabla válido
$razonSocial = preg_replace('/\s+/', '_', $razonSocial); // Reemplazar espacios con guiones bajos
$razonSocial = preg_replace('/[^a-zA-Z0-9_]/', '', $razonSocial); // Eliminar caracteres especiales

// Crear una tabla con el nombre de la razón social si no existe
if (!empty($razonSocial)) {
    $createTableSQL = "CREATE TABLE IF NOT EXISTS `$razonSocial` (
        `Item` VARCHAR(255),
        `Descripcion` VARCHAR(255),
        `Referencia` VARCHAR(255),
        `EAN13` VARCHAR(13),
        `UM` VARCHAR(10),
        `Proveedor` VARCHAR(255),
        `Precio` DECIMAL(10, 2)
    )";

    if ($conn->query($createTableSQL) === TRUE) {
        // Realizar otras operaciones necesarias en la base de datos
    } else {
        echo json_encode(array("error" => "Error creating table: " . $conn->error));
        exit;
    }

    // Consultar los registros existentes en la tabla
    $existingRecords = array();
    $selectExistingSQL = "SELECT `Item`, `Descripcion`, `Referencia`, `EAN13`, `UM`, `Proveedor`, `Precio` FROM `$razonSocial`";
    $resultExisting = $conn->query($selectExistingSQL);

    if ($resultExisting->num_rows > 0) {
        while ($row = $resultExisting->fetch_assoc()) {
            $existingRecords[] = $row;
        }
    }

    // Insertar solo los registros nuevos en la tabla
    foreach ($xml->xpath('//Resultado') as $result) {
        $idProveedor = (string)$result->ID_Proveedor;
        $nit = buscarNITPorIDProveedor($idProveedor);

        // Filtrar los resultados y relacionar por el NIT deseado
        if ($nit === $userNIT) {
            $newRecord = array(
                'Item' => (string)$result->Item,
                'Descripcion' => (string)$result->Descripcion_x0020_Item,
                'Referencia' => (string)$result->Referencia,
                'EAN13' => (string)$result->EAN_x0020_13,
                'UM' => (string)$result->UM,
                'Proveedor' => (string)$result->Proveedor,
                'Precio' => (float)$result->Precio_x0020_Unitario_x0020_del_x0020_Proveedor
            );

            // Verificar si el nuevo registro no existe en los registros existentes
            if (!in_array($newRecord, $existingRecords)) {
                $insertSQL = "INSERT INTO `$razonSocial` (`Item`, `Descripcion`, `Referencia`, `EAN13`, `UM`, `Proveedor`, `Precio`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtInsert = $conn->prepare($insertSQL);
                $stmtInsert->bind_param("ssssssd", $newRecord['Item'], $newRecord['Descripcion'], $newRecord['Referencia'], $newRecord['EAN13'], $newRecord['UM'], $newRecord['Proveedor'], $newRecord['Precio']);
                $stmtInsert->execute();
                $stmtInsert->close(); // Cerrar la declaración después de cada inserción
            }
        }
    }

    // Consulta para obtener todos los registros de la tabla
    $selectAllRecordsSQL = "SELECT * FROM `$razonSocial`";
    $resultAllRecords = $conn->query($selectAllRecordsSQL);

    if ($resultAllRecords->num_rows > 0) {
        $userTableData = array();
        while ($row = $resultAllRecords->fetch_assoc()) {
            $userTableData[] = $row;
        }

        // Cerrar la conexión a la base de datos
        $stmtUsers->close();
        $conn->close();

      
        
        // Devolver los datos en formato JSON
        echo json_encode($userTableData);


        exit;
    }
    
}

// Cerrar la conexión a la base de datos
$stmtUsers->close();
$conn->close();
?>