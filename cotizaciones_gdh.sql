-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-10-2023 a las 21:34:03
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cotizaciones_gdh`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `codigo_expiracion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id`, `nit`, `nombre`, `telefono`, `email`, `contrasena`, `codigo`, `codigo_expiracion`) VALUES
(1, '1002390115', 'admin', '3242832735', 'coord.ventasdigitales@gigantedelhogar.com.co', '1549', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_number` int(11) DEFAULT NULL,
  `codigo_barra` varchar(50) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `unidad_empaque` varchar(50) DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `precio_con_descuento` decimal(10,2) DEFAULT NULL,
  `descuento_porcentaje` decimal(5,2) DEFAULT NULL,
  `estado` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `items`
--

INSERT INTO `items` (`id`, `order_id`, `item_number`, `codigo_barra`, `referencia`, `descripcion`, `unidad_empaque`, `precio_base`, `precio_con_descuento`, `descuento_porcentaje`, `estado`) VALUES
(1, 1, 493, '7702073664754', '5850003596', 'ESPATULA PLANA 37CM PRF 6647500 IMUSA', 'UND', 17276.00, 17276.00, 0.00, NULL),
(2, 1, 20, '7702073138385', '5850001935', 'REC GALLETAS 3 TACOS IMUSA', 'UND', 6338.00, 6338.00, 0.00, NULL),
(6, 2, 95, '7702147236160', '10025960 0630AL96', 'COPA SHOT BARMAN 10Z CRISTAR', 'UND', 576.00, 576.00, 0.00, NULL),
(7, 2, 23, '7702147216063', '10025401 0314AL', 'JARRO CERVECERO HAMBURGO CRISTAR', 'UND', 3107.00, 3107.00, 0.00, NULL),
(8, 2, 249, '7702147241645', '10029519', 'VASO SIENA BEBIDAS CRISTAR', 'UND', 1101.00, 1101.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_nit` varchar(20) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `Nueva` varchar(100) DEFAULT NULL,
  `Aprobada` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `user_nit`, `fecha_creacion`, `fecha_aprobacion`, `Nueva`, `Aprobada`) VALUES
(1, 1, '890900307', '2023-08-21 05:20:41', NULL, 'Sí', NULL),
(3, 2, '815002936', '2023-08-21 07:02:23', NULL, 'Sí', NULL),
(4, 3, '890900307', '2023-08-21 07:24:48', NULL, NULL, 'Sí'),
(5, 4, '815002936', '2023-08-21 07:24:48', NULL, NULL, 'Sí');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `razon_social` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `codigo_expiracion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nit`, `razon_social`, `nombre`, `telefono`, `email`, `contrasena`, `codigo`, `codigo_expiracion`) VALUES
(1, '1002390115', 'Roberto Espinosa', 'Roberto Espinosa', '3242832735', 'robertheg109@gmail.com', '1549Eg12', NULL, NULL),
(2, '890900307', 'GROUPE SEB ANDEAN SA', 'Groupeseb', '324000000', 'Groupeseb@gmail.com', '1549Eg12', NULL, NULL),
(3, '815002936', 'CRISTAR SAS', 'Cristar', '324000000', 'Cristar@gmail.com', '1549', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
