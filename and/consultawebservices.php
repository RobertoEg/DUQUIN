<?php

// Establecer la URL del Web Service que recibirá el archivo
$url = 'http://190.71.130.115:8064/WSUNOEE/WSUNOEE.asmx?WSDL';
// Establecer las credenciales de autenticación
$username = 'e-commerce';
$password = 'E-commerce2020.';

// Consulta 1
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
    echo 'Error en la sesión cURL para la consulta 1: ' . curl_error($ch1);
}

// Cerrar la sesión cURL para la consulta 1
curl_close($ch1);

// Imprimir la respuesta de la consulta 1
echo $response1;


