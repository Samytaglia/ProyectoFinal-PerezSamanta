const productos = [
    {
        id:1, 
        categoria:'Bandolera', 
        nombre:'Claire', 
        color:'negro', 
        descripcion: 'Sobre de mano con manopla',
        imagen: "../images/sobre1.8.jpeg",
        precio:3300,
        cantidad: 1,
    },
    {
        id:2, 
        categoria:'Sobre', 
        nombre:'Jane', 
        color:'blanco', 
        descripcion: 'Sobre de mano con manopla',
        imagen: "/images/sobre2.1.jpeg",
        precio:2000,
        cantidad: 1,
    },
    {
        id:3, 
        categoria:'Sobre', 
        nombre:'Mary', 
        color:'multicolor', 
        descripcion: 'Billetera amplia de cuero',
        imagen: "/images/billetera.jpeg",
        precio:5000,
        cantidad: 1,
    },
    {
        id:4, 
        categoria:'Riñonera', 
        nombre:'Blair', 
        color:'negro', 
        descripcion: 'Riñonera en charol',
        imagen: "/images/riñonera.jpeg",
        precio:2000,
        cantidad: 1,
    },
];

const cartContainer = document.getElementById("cartContainer");
const showCart = document.getElementById("showCart");
const modalContainer = document.getElementById("modal-container");
const showAlert = document.getElementById("showAlert");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

productos.forEach((product) => {
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
      console.log(carrito);
      console.log(carrito.length);
      carritoCounter();
      saveLocal();
    }
  });
});

//set item
const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

//get item

const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito.</h1>
      `;
    modalContainer.append(modalHeader);
  
    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
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
          <h3>${product.categoria} ${product.nombre}</h3>
          <p>${product.precio} $</p>
          <span class="restar"> - </span>
          <!--recomiendo no escribir la palabra cantidad para que no quede tan largo :)-->
          <p>${product.cantidad}</p>
          <span class="sumar"> + </span>
          <p>Total: ${product.cantidad * product.precio} $</p>
          <span class="delete-product"> ❌ </span>
        `;
  
      modalContainer.append(carritoContent);
  
      let restar = carritoContent.querySelector(".restar");
  
      restar.addEventListener("click", () => {
        if (product.cantidad !== 1) {
          product.cantidad--;
        }
        saveLocal();
        pintarCarrito();
      });
  
      let sumar = carritoContent.querySelector(".sumar");
      sumar.addEventListener("click", () => {
        product.cantidad++;
        saveLocal();
        pintarCarrito();
      });
  
      let eliminar = carritoContent.querySelector(".delete-product");
  
      eliminar.addEventListener("click", () => {
        eliminarProducto(product.id);
      });
  
    });
  
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  
    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerHTML = `Total a pagar: ${total} $`;
    modalContainer.append(totalBuying);
  };
  
  showCart.addEventListener("click", pintarCarrito);
  
  const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id);
  
    console.log(foundId);
  
    carrito = carrito.filter((carritoId) => {
      return carritoId !== foundId;
    });
  
    carritoCounter();
    saveLocal();
    pintarCarrito();
  };
  
  const carritoCounter = () => {
    cantidadCarrito.style.display = "block";
  
    const carritoLength = carrito.length;
  
    localStorage.setItem("carritoLength", JSON.stringify(carritoLength));
  
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
  };
  
  carritoCounter();