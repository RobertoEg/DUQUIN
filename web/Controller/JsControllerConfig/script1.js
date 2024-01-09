// Función para abrir el menú
function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.transform = "translateX(0)";
    sidebar.style.transition = "transform 0.4s ease"; // Ajusta la duración

    const menuIcon = document.getElementById('menuIcon');
    menuIcon.classList.add('white');

    const content = document.querySelector(".content2");
    content.style.marginLeft = "206px"; /* Ajusta el valor según el ancho del menú */
    content.style.transition = "margin-left 0.4s ease"; // Ajusta la duración

    const searchContainer = document.querySelector(".search-container");
    searchContainer.style.marginLeft = "250px"; /* Ajusta el valor según el ancho del menú */
    searchContainer.style.transition = "margin-left 0.4s ease"; // Ajusta la duración

    const tableContainer = document.querySelector(".table");
    tableContainer.style.marginLeft = "260px"; /* Ajusta el valor según el ancho del menú */
    tableContainer.style.transition = "margin-left 0.4s ease"; // Ajusta la duración
  
}

// Función para cerrar el menú
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.transform = "translateX(-100%)";
    sidebar.style.transition = "transform 0.4s ease"; // Ajusta la duración

    const menuIcon = document.getElementById('menuIcon');
    menuIcon.classList.remove('white');

    const content = document.querySelector(".content2");
    content.style.marginLeft = "0";
    content.style.transition = "margin-left 0.4s ease";

    const searchContainer = document.querySelector(".search-container");
    searchContainer.style.marginLeft = "4.3%"; /* Vuelve a la posición original */
    searchContainer.style.transition = "margin-left 0.4s ease";

    const tableContainer = document.querySelector(".table");
    tableContainer.style.marginLeft = "5%"; /* Vuelve a la posición original */
    tableContainer.style.transition = "margin-left 0.4s ease";


    const order = document.querySelector(".order");
    order.style.marginLeft = "0%"; /* Vuelve a la posición original */
    order.style.transition = "margin-left 0.4s ease";
}

// Función principal para alternar el menú
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    // Verifica si el menú está cerrado y lo abre, o si está abierto y lo cierra
    if (sidebar.style.transform === "translateX(0px)") {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Supongamos que 'notificationCount' es el número de notificaciones recibidas
const notificationCount = 5; // Ejemplo, reemplaza esto con tu valor real

const notificationSpan = document.querySelector(".notification-count");
notificationSpan.textContent = notificationCount;


