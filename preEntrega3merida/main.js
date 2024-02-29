//Iniciamos el evenlistener para poder interactuar con el html 
document.addEventListener('DOMContentLoaded', () => {
    
    const baseDeDatos = [ 
        {id: 1, nombre: "anillo", precio: 1500, imagen: 'img/anillo.jpg'},
        {id: 2, nombre: "arete2", precio: 2500, imagen: 'img/arete2.jpg'},
        {id: 3, nombre: "collares", precio: 4700, imagen: 'img/collares.jpg'},
        {id: 4, nombre: "pulseras", precio: 3900, imagen: 'img/pulseras.webp'}
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const Storage = window.localStorage;


    function armarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            
            //nombre
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            
            //imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            
            //precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;
            

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', agregarCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    function agregarCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        armarCarrito();
        guardarStorage();
    }

    function armarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} = ${divisa}${miItem[0].precio}`;
            
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        //Calculamos el total de lo agregado
        DOMtotal.textContent = calcularTotal();
    }

    function borrarCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        armarCarrito();
        //Guardamos los cambios en el storage
        guardarStorage();
    }

    function calcularTotal() {
        // Recorremos el array del carrito
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        armarCarrito();
        localStorage.clear(); //Se limpia el local storage
    }

    function guardarStorage(){
        Storage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoStorage() {
        if (Storage.getItem('carrito') != null) {
            carrito=JSON.parse(Storage.getItem('carrito'));
        }
    }

    // Evento
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    cargarCarritoStorage();
    armarProductos();
    armarCarrito();
});