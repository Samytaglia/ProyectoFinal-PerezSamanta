const cartContainer = document.getElementById("cartContainer");
const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");

const showAlert = document.getElementById("showAlert");
const showCart = document.getElementById("showCart");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const getProducts = async () => {
  const response = await fetch("./js/data.json");
  const data = await response.json();

  data.forEach((product) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
    <img src="${product.imagen}" class="card-img-top" alt="...">
    <div class="card-body text-center">
        <h5 class="card-title"><strong>${product.categoria} ${product.nombre}</strong></h5>
        <p class="card-text">${product.descripcion}</p>
    </div>
    <div class="card-footer text-center">
        <small class="text-muted"> $${product.precio}</small>
    </div>
    `;
  
    cartContainer.append(content);
  
    let comprar = document.createElement("button");
    comprar.innerText = "AGREGAR AL CARRITO";
    comprar.className = "comprar";
  
    content.append(comprar);
  
    comprar.addEventListener("click", () => {
      const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);
  
      if (repeat) {
        carrito.map((prod) => {
          if (prod.id === product.id) {
            prod.cantidad++;
          }
        });
      } else {
        carrito.push({
          id: product.id,
          imagen: product.imagen,
          categoria: product.categoria,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: product.cantidad,
        });
        carritoCount();
        saveLocalStorage();
        sendMessage()
      }
    });
  });
};

getProducts();

const saveLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const llenarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h2 class="modal-header-title">CARRITO DE COMPRA</h2>
      `;
    modalContainer.append(modalHeader);
  
    const modalbutton = document.createElement("a");
    modalbutton.innerHTML = '<a><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" color="whitesmoke" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></a>';
    modalbutton.className = "modal-header-button";
  
    modalbutton.addEventListener("click", () => {
    modalContainer.style.display = "none";
    });
  
    modalHeader.append(modalbutton);
  
    carrito.forEach((product) => {
      let carritoContent = document.createElement("div");
      carritoContent.className = "modal-content";
      carritoContent.innerHTML = `
      <img src="${product.imagen}">
      <table>
          <thead>
            <td style="width: 100px">${product.categoria} ${product.nombre}</td>
          </thead>
      </table>
      <div>
        <table>
          <thead style="text-align: center; border: 1px solid black;">
            <th class="restar" style="width: 25px;"><button style="width:100%; border: none">-</button></th>
            <th style="width: 50px;">${product.cantidad}</th>
            <th class="sumar" style="width: 25px;"><button style="width:100%; border: none">+</button></th>
          </thead>
        </table>
      </div>
      <td>Total: $ ${product.cantidad * product.precio} 
        <span class="delete-product">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
          </svg>
        </span>
      </td>
        `;
  
      modalContainer.append(carritoContent);
  
      let restar = carritoContent.querySelector(".restar");
  
      restar.addEventListener("click", () => {
        if (product.cantidad !== 1) {
          product.cantidad--;
        }
        saveLocalStorage();
        llenarCarrito();
      });
  
      let sumar = carritoContent.querySelector(".sumar");
      sumar.addEventListener("click", () => {
        product.cantidad++;
        saveLocalStorage();
        llenarCarrito();
      });
  
      let eliminar = carritoContent.querySelector(".delete-product");
  
      eliminar.addEventListener("click", () => {
        eliminarProducto(product.id);
      });
  
    });
  
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  
    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerHTML = `Total a pagar: $ ${total}
    `;
    modalContainer.append(totalBuying);
  };

  showCart.addEventListener("click", llenarCarrito);
  
    const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id);
  
    console.log(foundId);
  
    carrito = carrito.filter((carritoId) => {
      return carritoId !== foundId;
    });
  
    carritoCount();
    saveLocalStorage();
    llenarCarrito();
  };
  
    const carritoCount = () => {
    cantidadCarrito.style.display = "block";
  
    const carritoLength = carrito.length;
  
    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));
  
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
  };
  
  carritoCount();

  const $form = document.querySelector('#form')
  $form.addEventListener('submit', handleSubmit)
  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(this)
    mailing.setAttribute('href', `mailto:karminacarteras@gmail.com?subject=${form.get('name')}${form.get('email')}&body=${form.get('message')}`)
    maiing.click()

  }

function sendMessage(){
  Swal.fire('Producto agregado')
}