// Función para validar el formato del correo electrónico
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// JavaScript para mostrar y ocultar el modal
function openForgotPasswordModal() {
  $("#forgotPasswordModal").show();
}

function closeForgotPasswordModal() {
  $("#forgotPasswordModal").hide();
}

// Función para enviar el correo electrónico con el código
function sendResetCode() {
  var email = $("#emailInput").val();

  // Validar el formato del correo electrónico
  if (!isValidEmail(email)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }

  // Aquí se realiza la solicitud AJAX al servidor para enviar el correo electrónico
  $.ajax({
    type: "POST",
    url: "/web/Controller/BdControllerConfig/reset_password.php", // Ruta del archivo PHP que manejará el envío del correo
    data: { email: email }, // Datos que se enviarán al servidor (en este caso, solo el correo)
    success: function (response) {
      // Verificar la respuesta del servidor
      if (response === "success") {
        // Si el correo electrónico está registrado, mostrar el modal "Ingresar Código"
        openEnterCodeModal();
      } else {
        // Si el correo electrónico no está registrado, mostrar un mensaje de error
        alert("El correo electrónico ingresado no está registrado.");
        closeForgotPasswordModal();
      }
    },
    error: function (xhr, status, error) {
      // Manejar el error si ocurre algún problema con la solicitud
      console.error(error);
      closeForgotPasswordModal();
    }
  });
}

// Función para mostrar el modal "Ingresar Código"
function openEnterCodeModal() {
  $("#enterCodeModal").show();
}

function closeEnterCodeModal() {
  $("#enterCodeModal").hide();
}

// Función para mostrar el modal de nueva contraseña
function openNewPasswordModal() {
  $("#newPasswordModal").show();
}

function closeNewPasswordModal() {
  $("#newPasswordModal").hide();
}

// Función para resetear la contraseña
function resetPassword() {
  var email = $("#emailInput").val();
  var newPassword = $("#newPasswordInput").val();

  // Aquí se realiza la solicitud AJAX al servidor para guardar la nueva contraseña
  $.ajax({
    type: "POST",
    url: "/web/Controller/BdControllerConfig/update_password.php",
    data: { email: email, newPassword: newPassword },
    success: function (response) {
      // Verificar la respuesta del servidor
      if (response === "success") {
        // Mostrar la alerta de éxito y redireccionar a la página de inicio de sesión
        alert("¡Contraseña restablecida con éxito! Por favor, inicie sesión con su nueva contraseña.");
        window.location.href = "/index.html"; // Reemplaza "/iniciar_sesion.html" con la URL de la página de inicio de sesión
      } else {
        // Mostrar una alerta en caso de error
        alert("Ha ocurrido un error al restablecer la contraseña. Por favor, intente nuevamente.");
      }
      closeNewPasswordModal();
    },
    error: function (xhr, status, error) {
      // Manejar el error si ocurre algún problema con la solicitud
      console.error(error);
      closeNewPasswordModal();
    }
  });
}

// Función para verificar el código ingresado
function verifyCode() {
  var email = $("#emailInput").val();
  var code = $("#codeInput").val();

  // Aquí se realiza la solicitud AJAX al servidor para verificar el código
  $.ajax({
    type: "POST",
    url: "/web/Controller/BdControllerConfig/verify_code.php",
    data: { email: email, codigo: code },
    success: function (response) {
      // Verificar la respuesta del servidor
      if (response === "success") {
        // Mostrar la alerta de verificación exitosa
        alert("¡Código verificado con éxito!");
        // Cerrar el modal de ingreso del código
        closeEnterCodeModal();
        // Mostrar el modal para ingresar la nueva contraseña
        openNewPasswordModal();
      } else {
        // Si el código es incorrecto, mostrar la alerta de error
        alert("El código ingresado es incorrecto.");
      }
    },
    error: function (xhr, status, error) {
      // Manejar el error si ocurre algún problema con la solicitud
      console.error(error);
    }
  });
}

// Verificar cuando se carga la página para mostrar u ocultar el modal según el hash en la URL
$(document).ready(function () {
  var hash = window.location.hash;
  if (hash === "#forgotPasswordModal") {
    openForgotPasswordModal();
  }
});

// Asignar el evento click al botón "Restablecer Contraseña" dentro del modal "Nueva Contraseña"
$(document).ready(function () {
  $("#resetPasswordButton").on("click", function () {
    resetPassword();
  });
});
