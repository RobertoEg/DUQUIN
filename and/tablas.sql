CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nit VARCHAR(20),
  razon_social VARCHAR(20),
  nombre VARCHAR(100),
  telefono VARCHAR(20), 
  email VARCHAR(100),
  contrasena VARCHAR(255),
  codigo VARCHAR(50), 
  codigo_expiracion DATETIME
);


CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  user_nit VARCHAR(20),
  fecha_creacion DATETIME,
  fecha_aprobacion DATETIME,
  Nueva VARCHAR(100),
  Aprobada VARCHAR(100)
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  item_number INT,
  codigo_barra VARCHAR(50),
  referencia VARCHAR(100),
  descripcion VARCHAR(255),
  unidad_empaque VARCHAR(50),
  precio_base DECIMAL(10, 2),
  precio_con_descuento DECIMAL(10, 2),
  descuento_porcentaje DECIMAL(5, 2)
);


INSERT INTO admin (nit, nombre, telefono, email, contrasena)
VALUES ('1002390115', 'admin', '3242832735', 'robertheg109@gmail.com', '1549');


INSERT INTO users (nit, nombre, razon_social, telefono, email, contrasena)
VALUES ('815002936', 'Cristar', 'CRISTAR SAS','324000000', 'Cristar@gmail.com', '1549');

-- Insertar la orden
INSERT INTO orders (order_id, user_nit, fecha_creacion, Nueva)
VALUES (1, '890900307', NOW(), 'Sí');

-- Insertar los items de la orden
INSERT INTO items (order_id, item_number, codigo_barra, referencia, descripcion, unidad_empaque, precio_base, precio_con_descuento, descuento_porcentaje)
VALUES
    (1, 493, '7702073664754', '5850003596', 'ESPATULA PLANA 37CM PRF 6647500 IMUSA', 'UND', 17276.0000, 17276.0000, 0.00),
    (1, 20, '7702073138385', '5850001935', 'REC GALLETAS 3 TACOS IMUSA', 'UND', 6338.0000, 6338.0000, 0.00);



   