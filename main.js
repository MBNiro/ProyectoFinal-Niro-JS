class Paquete {
    constructor(id, nombre, recorrido, precio, salida, img) {
        this.id = id;
        this.nombre = nombre;
        this.recorrido = recorrido;
        this.precio = precio;
        this.salida = salida;
        this.img = img;
        this.cantidad = 1;
    }
}

const norteArgentino = new Paquete (1,"Norte Argentino","Salta Capital, Jujuy y Salinas ", 90000, new Date("April 28, 2023 20:00"), "img/NORTE ARGENTINO.PNG");
const costaArgentina = new Paquete (2,"Costa Argentina","Pinamar y Carilo", 80000, new Date("April 26, 2023 07:00"), "img/costa.PNG");
const patagonia = new Paquete (3,"Patagonia","Tierra del fuego y Calafate", 120000, new Date("April 18, 2023 12:00"), "img/patagonia.PNG");

const paquetes = [norteArgentino, costaArgentina, patagonia]; 

let carrito = [];

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorPaquetes = document.getElementById("contenedorPaquetes");

const mostrarPaquetes = () => {
    paquetes.forEach(paquete => {
        const card = document.createElement("div");
        card.className = "negrita"
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                            <div class="card">
                                <img class="card-img-tom imgPaquetes" src="${paquete.img}" alt="${paquete.nombre}">
                                <div class= "card-body">
                                    <h3>${paquete.nombre}</h3>
                                    <p>${paquete.recorrido}</p>
                                    <p>${paquete.precio}</p>
                                    <button class="botones" id="boton${paquete.id}"> Comprar </button>
                                </div>
                            </div>`
                         
        contenedorPaquetes.appendChild(card);

        const boton = document.getElementById(`boton${paquete.id}`);
        boton.addEventListener("click", () => {
            agregarPaquete(paquete.id);
            Toastify({
                text: "Paquete agregado al carrito", 
                duration: 3000,
                gravity: "top", 
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                  },
            }).showToast();
        })
    })
}

mostrarPaquetes();

const agregarPaquete = (id) => {
    const paqueteEnCarrito = carrito.find(paquete => paquete.id === id);
    if (paqueteEnCarrito) {
        paqueteEnCarrito.cantidad++;
    } else {
        const paquete = paquetes.find(paquete => paquete.id === id);
        carrito.push(paquete);
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    totalCompraPaquetes();
}
 

const verMiCarrito = document.getElementById("verMiCarrito");
const contenedorCompra = document.getElementById("contenedorCompra");

verMiCarrito.addEventListener("click", () => {
    paquetesSeleccionados();
})


const paquetesSeleccionados = () => {
    contenedorCompra.innerHTML = "";
    carrito.forEach(paquete => {
        const card = document.createElement("div");
        card.className = "negrita"
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                            <div class="card">
                                <img class="card-img-tom imgPaquetes" src="${paquete.img}" alt="${paquete.nombre}">
                                <div class="card-body">
                                    <h3>${paquete.nombre}</h3>
                                    <p>${paquete.precio}</p>
                                    <p>${paquete.cantidad}</p>
                                    <button class="botones" id="eliminar${paquete.id}"> Eliminar Paquete </button>
                                </div>
                            </div>`
        contenedorCompra.appendChild(card);
        
        const boton = document.getElementById(`eliminar${paquete.id}`);
        boton.addEventListener("click", () => {
            eliminarPaquete(paquete.id);
            Toastify({
                text: "Paquete eliminado del carrito", 
                duration: 3000,
                gravity: "top", 
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                  },
            }).showToast();
        })

    })
    totalCompraPaquetes();
}

const eliminarPaquete = (id) => {
    const paquete = carrito.find(paquete => paquete.id === id);
    let indice = carrito.indexOf(paquete);
    carrito.splice(indice, 1);
    paquetesSeleccionados();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const vaciarElCarrito = document.getElementById("vaciarElCarrito");
vaciarElCarrito.addEventListener("click", () => {
    Swal.fire({
        title: "¿Estas seguro que desea eliminar el carrito?",
        icon: "error",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            Swal.fire({
                title: "Carrito Eliminado",
                icon: "success",
                confirmButtonText: "Aceptar"
            })
        }
    })
})
    

const vaciarCarrito = () => {
    carrito = [];

    localStorage.clear();
    paquetesSeleccionados();
}

const compra = document.getElementById("compra");

const totalCompraPaquetes = () => {
    let totalCompra = 0;
    carrito.forEach(paquete => {
        totalCompra += paquete.precio * paquete.cantidad;
    })
    compra.innerHTML = ` $${totalCompra}`;
}

const clientes = document.getElementById("clientes");
const clientesComentarios = "json/clientes.json";

fetch(clientesComentarios)
    .then(respuesta => respuesta.json())
    .then(datos => {
        datos.forEach(cliente => {
            clientes.innerHTML += `
                                    <h2>Cliente: ${cliente.nombre} </h2>                    
                                    <p>Comentario: ${cliente.comentario} </p>
                                    <p>Fecha: ${cliente.Fecha} </p>
                                    <p>Puntuacion: ${cliente.puntuacion} </p>

                                    `
        })
    })
    .catch(error => console.log(error))

