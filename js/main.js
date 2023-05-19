var productos_actuales = [];
var lista_carrito = [];

const listaProductos = document.querySelector("#productos");
function generar_productos(data) {
  let lista1 = data;
  console.log(`La data es ${lista1}`);
  lista1.forEach(function (elemento) {
    console.log(elemento.nombre);

    const div = document.createElement("div");

    div.innerHTML = `
    <div class="card" id="producto">
    <img src="" alt="">
    <h3>${elemento.nombre}</h3>
    <p>Description of product 1.</p>
    <p>${elemento.precio}</p>
    <button class="add-to-cart" data-producto-id="${elemento.id}" >Add to cart</button>
    </div>
    `;

    listaProductos.append(div);
  });
}

//ELIMINAR DIVS
function eliminar_productos() {
  while (listaProductos.firstChild) {
    listaProductos.removeChild(listaProductos.firstChild);
  }
}

//Obtener informacion de un json
function cargar_json() {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "productos.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      eliminar_productos();
      // generar_productos(data.lista1);
      // generar_productos(data.lista2);
      filtrar_por_precio(data);
      // return data;
    }
  };
  xhr.send(null);
}

cargar_json();

// ESTA PARTE ES PARA EL ARANGO DE PRECIOS
const rangeInput = document.querySelectorAll(".range-input input"),
  priceInput = document.querySelectorAll(".price-input input"),
  progress = document.querySelector(".slider .progress");

let priceGap = 1000;

priceInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(priceInput[0].value),
      maxVal = parseInt(priceInput[1].value);

    if (maxVal - minVal >= priceGap && maxVal <= 10000) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxVal;
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

//Filtro precio

function filtrar_por_precio(data_json) {
  generar_productos(data_json.lista1);
  let minVal = parseInt(priceInput[0].value);
  let maxVal = parseInt(priceInput[1].value);
  data_json.lista1;
  const nuevo_array = data_json.lista1.filter(function (elemento) {
    console.log(`valor producto ${elemento.precio}`);
    console.log(`mnVal ${minVal}`);
    //probando backup productos del filtros para funcion carrito
    return elemento.precio >= minVal && elemento.precio <= maxVal;
  });
  //no es lo mejor pero por alguna razon copy() no funciona asique hago esto
  productos_actuales.push(nuevo_array);
  eliminar_productos();
  generar_productos(nuevo_array);
}

priceInput[0].addEventListener("input", function () {
  cargar_json();
});

priceInput[1].addEventListener("input", function () {
  cargar_json();
});

//Carrito
// function buscar_en_json(idProducto) {}
function buscar_producto_por_id(lista, id_buscado) {
  for (let posicion = 0; posicion < lista.length; posicion++) {
    if (lista[posicion].id == id_buscado) {
      console.log(`El producto es ${lista[posicion].nombre}`);
      return lista[posicion];
    }
  }
  console.log("NO SE ENCONTRO");
  return -1;
}

listaProductos.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart")) {
    const idProducto = event.target.dataset.productoId;
    var producto_encontrado = buscar_producto_por_id(
      productos_actuales[0],
      idProducto
    );

    //podria avisar que tengo este producto en carrito
    lista_carrito.push(producto_encontrado);
  }
});

//PASAR A LA SECCION DE COMPRA (OCULTO EL CONTEINER DE LOS PRODUCTOS Y FILTROS)
const listaProductosCarrito = document.querySelector("#carrito ul");

///////////////////////////////////
//ESTOY TRABAJANDO ACAAA AHORAA
////////////////////////////////////

listaProductosCarrito.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove")) {
    const idProducto = event.target.dataset.productoId;
    console.log(lista_carrito);
    for (i = 0; i < lista_carrito.length; i++) {
      if (lista_carrito[i].id == idProducto) {
        // console.log("antes de quitar elemento");
        console.log(lista_carrito.length);
        lista_carrito.splice(i, 1);
        console.log(lista_carrito.length);
        console.log("despues de quitar elemento");
        mostrar_carrito();
        break;
      }
    }
  }
});

var lista_mostrar = [];
function crear_lista_objetos_con_cantidad(lista_carrito) {
  // var lista_mostrar = [];

  for (let posicion = 0; posicion < lista_carrito.length; posicion++) {
    let repetido = false;
    for (let i = 0; i < lista_mostrar.length; i++) {
      if (lista_mostrar[i][0].id == lista_carrito[posicion].id) {
        lista_mostrar[i][1] = lista_mostrar[i][1] + 1;
        repetido = true;
      }
    }
    if (!repetido) {
      lista_mostrar.push([lista_carrito[posicion], 1]);
    }
  }
  return lista_mostrar;
}

//Funcion auxiliar para evitar duplicados en el carrito cada vez que tocamos el carrito
function borrar_carrito() {
  while (listaProductosCarrito.firstChild) {
    listaProductosCarrito.removeChild(listaProductosCarrito.firstChild);
  }
}

function mostrar_carrito_reset(lista_nueva) {
  borrar_carrito();
  lista_nueva.forEach(function (elemento) {
    const div = document.createElement("div");

    div.innerHTML = `
    <li class="carrito__producto"> <h3>${elemento[0].nombre}</h3><h3>${elemento[0].precio}</h3><h3>x(${elemento[1]})</h3> <button class='remove' data-producto-id="${elemento[0].id}">Eliminar</button> </li>
    `;

    listaProductosCarrito.append(div);
  });
}
var primera_vez = true;
function mostrar_carrito() {
  borrar_carrito();
  if (primera_vez) {
    lista_mostrar = crear_lista_objetos_con_cantidad(lista_carrito);
    primera_vez = false;
  } else {
    lista_mostrar = [];
    lista_mostrar = crear_lista_objetos_con_cantidad(lista_carrito);
  }

  // console.log("LISTA MOSTRARRRRRRRRRRR");
  // console.log(lista_mostrar);
  lista_mostrar.forEach(function (elemento) {
    const div = document.createElement("div");

    div.innerHTML = `
    <li class="carrito__producto"> <h3>${elemento[0].nombre}</h3><h3>${elemento[0].precio}</h3><h3>x(${elemento[1]})</h3> <button class='remove' data-producto-id="${elemento[0].id}">Eliminar</button> </li>
    `;

    listaProductosCarrito.append(div);
  });
  // lista_carrito_eliminar.push(lista_mostrar);
}

var contador_prueba = 0;
function vista_carrito() {
  console.log("ESTOY DENTRO DEL CARRITO");
  var contenedor = document.querySelector(".container");
  if (contador_prueba % 2 == 0) {
    contenedor.style.display = "none";
  } else {
    contenedor.style.display = "";
  }
  contador_prueba++;
  mostrar_carrito();
}

//ESTO ES PARA SABER QUE OPCION TOCAMOS EN LA NAVBAR (Lo voy a usar mas adelante)
var navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function () {
    var selectedText = this.innerHTML;
    console.log(selectedText);
  });
});
