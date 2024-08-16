document.addEventListener("DOMContentLoaded", function () {
  updateProductTable();
});

// Función para validar números en el evento input
function validarNumeros(event) {
  var tecla = event.data;

  if (tecla === null) {
    return false;
  }

  var patron = /^[0-9]$/;
  return patron.test(tecla);
}

// Obtener una lista de elementos con la clase ".recipient-input"
var inputElements = document.querySelectorAll(".recipient-input");

// Agregar evento de input a los elementos para validar números
inputElements.forEach(function (inputElement) {
  inputElement.addEventListener("input", function (event) {
    var newValue = this.value.slice(-1);

    if (!validarNumeros({ data: newValue })) {
      this.value = this.value.slice(0, -1);
    }
  });
});

/* URL de la API */
const API_URL = "http://localhost:5209/api/Product/";
const table = document.getElementById("datatable");

let datatable = new DataTable('#datatable', {
  responsive: true,
  language: {
    "decimal": "",
    "emptyTable": "No hay información",
    "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
    "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
    "infoFiltered": "(Filtrado de _MAX_ total entradas)",
    "infoPostFix": "",
    "thousands": ",",
    "lengthMenu": "Mostrar _MENU_ Entradas",
    "loadingRecords": "Cargando...",
    "processing": "Procesando...",
    "search": "Buscar:",
    "zeroRecords": "Sin resultados encontrados",
    "paginate": {
        "first": "Primero",
        "last": "Ultimo",
        "next": "Siguiente",
        "previous": "Anterior"
    }
  },
});

function updateProductTable() {
  // Realizar la solicitud GET a la API usando fetch
  fetch(`${API_URL}getAll`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar los datos en la tabla
      displayDataInTable(data);

      // Después de mostrar los datos, agregar el evento de clic para los botones de edición
      document.querySelectorAll(".edit-btn").forEach(function (editBtn) {
        editBtn.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          openEditModal(productId);
        });
      });
    })
    .catch((error) => {
      console.error("Error al obtener datos:", error);
    });
}
// Cargar la data al data table
function displayDataInTable(data) {
  const tbody = document.createElement("tbody");

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="text-center">${item.id}</td>
        <td class="text-center">${item.name}</td>
        <td class="text-center">${item.description}</td>
        <td class="text-center">$${item.price}</td>
        <td class="text-center">${item.amount}</td>
        <td class="text-center">${item.check}</td>
        <td class="text-center">
          <a data-id="${item.id}" data-target-modal="modal-editar" class="btn btn-sm btn-success edit-btn" title="Editar Producto"> <i style="color: white" class="fe fe-edit"></i></a>
        </td>
    `;
    tbody.appendChild(row);
  });

  // Reemplazar el contenido del cuerpo de la tabla sin afectar los encabezados
  const existingTbody = table.querySelector("tbody");
  if (existingTbody) {
    table.replaceChild(tbody, existingTbody);
  } else {
    table.appendChild(tbody);
  }
}

/* EDITAR PRODUCTO */

function openEditModal(productId) {
  // Realiza una solicitud GET a la API para obtener los detalles del producto
  fetch(`${API_URL}getById/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Llena la modal de edición con los datos obtenidos
      fillEditModal(data);
      // Obtén una referencia al modal de edición
      const editModal = new bootstrap.Modal(
        document.getElementById("modal-editar")
      );
      // Agrega un evento que se dispare cuando la modal se muestre completamente
      editModal.show();
      editModal._element.addEventListener("shown.bs.modal", function () {
        // Llena la modal de edición con los datos obtenidos (nuevamente, por precaución)
        fillEditModal(data);
      });
    })
    .catch((error) => {
      console.error("Error al obtener detalles del producto:", error);
    });
}

// Función para llenar la modal de edición con los datos del producto
function fillEditModal(productData) {
  // Obtener referencias a los elementos de la modal
  const editid = document.getElementById("editid");
  const editNameElement = document.getElementById("editName");
  const editDescriptionElement = document.getElementById("editDescription");
  const editPrecioInputElement = document.getElementById("editPrecioInput");
  const editCantidadInputElement = document.getElementById("editCantidadInput");
  const editCheckElement = document.getElementById("editCheck");

  // Verificar si los elementos existen antes de intentar establecer sus valores
  if (
    editNameElement &&
    editDescriptionElement &&
    editPrecioInputElement &&
    editCantidadInputElement &&
    editCheckElement
  ) {
    // Llenar los campos de la modal con los datos del producto
    editid.value = productData.id;
    editNameElement.value = productData.name;
    editDescriptionElement.value = productData.description;
    editPrecioInputElement.value = productData.price;
    editCantidadInputElement.value = productData.amount;
    editCheckElement.value = productData.check;
  } else {
    console.error("Error: Elementos de la modal no encontrados.");
  }
}

// Después de la función fillEditModal, agrega el evento de clic para el botón "Editar Producto" dentro de la modal
document
  .querySelector("#modal-editar button.btn-success")
  .addEventListener("click", function () {
    // Obtiene los valores del formulario de edición
    const editid = document.getElementById("editid").value;
    const editName = document.getElementById("editName").value;
    const editDescription = document.getElementById("editDescription").value;
    const editPrecio = document.getElementById("editPrecioInput").value;
    const editCantidad = document.getElementById("editCantidadInput").value;
    const editCheck = document.getElementById("editCheck").value;

    // Obtiene el ID del producto
    const productId = editid;

    // Realiza una solicitud PUT a la API para editar el producto
    fetch(`${API_URL}edit/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editName,
        description: editDescription,
        price: parseFloat(editPrecio),
        amount: parseInt(editCantidad),
        check: editCheck,
      }),
    })
      .then((response) => {
        // Verifica si la respuesta es un objeto JSON antes de llamar a response.json()
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          // Si no es JSON, devuelve la respuesta directamente
          return response.text();
        }
      })
      .then((data) => {
        // Mostrar un mensaje de éxito
        swal("Edición correcta!", data, "success");
        // Cierra la modal de edición
        const editModal = new bootstrap.Modal(
          document.getElementById("modal-editar")
        );
        editModal._hideModal();
        opacity();
        // Actualizacion de tabla
        updateProductTable();
      })
      .catch((error) => {
        // Mostrar un mensaje de error
        swal("Error", "Error al editar el producto", "error");
      });
  });

function opacity() {
  // Quitar la opacidad del fondo oscuro del modal
  const backdrop = document.querySelector(".modal-backdrop.show");
  backdrop.remove();
}

//-----------  CREACION DEL PRODUCTO: Obtén una referencia al botón "Crear Producto"
const openCreateModalBtn = document.getElementById("openCreateModalBtn");

// Agrega un evento de clic al botón
openCreateModalBtn.addEventListener("click", function () {
  // Obtén una referencia al modal de creación y ábrelo
  const createModal = new bootstrap.Modal(
    document.getElementById("modalCreate")
  );
  createModal.show();
});

// Obtén una referencia al formulario de creación
const createProductForm = document.getElementById("createProductForm");

// Agrega un evento de clic al botón "Crear Producto" dentro del modal
document
  .querySelector("#modalCreate button.btn-success")
  .addEventListener("click", function () {
    // Obtiene los valores del formulario
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const precio = document.getElementById("precioInput").value;
    const cantidad = document.getElementById("cantidadInput").value;
    const check = document.getElementById("check").value;

    // Realiza una solicitud POST a la API para crear el producto
    fetch(`${API_URL}create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(precio), // Asegúrate de convertir el precio a un número flotante
        amount: parseInt(cantidad), // Asegúrate de convertir la cantidad a un entero
        check,
      }),
    })
      .then((response) => {
        // Verifica si la respuesta es un objeto JSON antes de llamar a response.json()
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          // Si no es JSON, devuelve la respuesta directamente
          return response.text();
        }
      })
      .then((data) => {
        // Limpiar los campos del formulario
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("precioInput").value = "";
        document.getElementById("cantidadInput").value = "";
        document.getElementById("check").value = "";

        // Mostrar un mensaje de éxito
        swal("Creación correcta!", data, "success");
        const modal = new bootstrap.Modal(
          document.getElementById("modalCreate")
        );
        modal._hideModal();
        opacity();
        // Actualizacion de tabla
        updateProductTable();
      })
      .catch((error) => {
        // Mostrar un mensaje de error
        swal("Error", error, "error");
      });
  });

/* GENERAR INVENTARIOS */

// Obtener una referencia al botón "Generar Inventario"
const btnGenerarInventario = document.getElementById("btnGenerarInventario");

// Agregar un evento de clic al botón
btnGenerarInventario.addEventListener("click", function () {
  const modalInforme = new bootstrap.Modal(
    document.getElementById("modalInforme")
  );
  // Realizar la solicitud GET a la API para obtener el conteo global
  fetch(`${API_URL}getGlobalInventario`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar los datos en los elementos HTML correspondientes
      showGlobalInventario(data);
    })
    .catch((error) => {
      // Mostrar un mensaje de error
      swal("Error", error, "error");
    });
  modalInforme.show();
});

// Función para mostrar el conteo global en los elementos HTML correspondientes
function showGlobalInventario(data) {
  const spEntrada = document.querySelector(".spEntrada");
  const spSalida = document.querySelector(".spSalida");

  // Actualizar los valores en los elementos HTML
  spEntrada.innerHTML = data.entrada;
  spSalida.innerHTML = data.salida;

  // Mostrar la sección centrada (si estaba oculta)
  const centeredRow = document.querySelector(".inevntariodiv");
  if (centeredRow) {
    centeredRow.style.display = "block";
  }
}
