let productList = [];
let carrito = [];
let total = 0;
let order = {
  items: [],
};


function add(productId, price) {
  const product = productList.find((p) => p.id === productId);
  const quantity = document.getElementById(`quantity_${productId}`).value; // obtener la cantidad del input para ese productId

  product.stock = product.stock - quantity; // restar quantity del stock, en lugar de restar 1.

  // Agregar el producto al carrito tantas veces como cantidad seleccionada
  for (let i = 0; i < quantity; i++) {
    order.items.push(product); 
    carrito.push(productId);
  }
  
  console.log(productId, price, quantity);
  
  total = total + (price * quantity); // El total es el precio del producto por la cantidad seleccionada
  document.getElementById("checkout").innerHTML = `Orden ${total}`;
  displayProducts();
}

// Tu nuevo boton deberia llamar a esta funcion.
function devolver(productId, price) {
  const product = productList.find((p) => p.id === productId);
  product.stock++; // Pone el stock de vuelta

  // quitar 1 item de la orden
  order.items.splice(order.items.indexOf(productList.find((p) => p.id === productId)), 1);
  
  console.log(productId, price);
  carrito.push(productId);

  // quita el producto del carrito
  carrito.splice(carrito.indexOf(productId), 1);

  // devuelve el total
  total = total - price;

  document.getElementById("checkout").innerHTML = `Orden ${total}`;
  displayProducts();
}



async function showOrder() {
  document.getElementById("all-products").style.display = "none";
  document.getElementById("order").style.display = "block";

  document.getElementById("order-total").innerHTML = `Articulos: ${total}`;

  let productsHTML = `
    <tr>
        <th>Num. Art.</th>
        <th>Articulo</th>        
        <th>Detalle</th>
        <th>Cantidad</th>
    </tr>`;
  order.items.forEach((p) => {
    productsHTML += `<tr>
            <td>${p.id}</td>
            <td><img class="cart-item-image" src=${p.image}width="100" height="100"></td>       
            <td>${p.name}</td>
            <td><button id=buttonadd onclick="devolver(${p.id})">Remove</button> 1<div></div></td>
        </tr>`;
  });
  document.getElementById("order-table").innerHTML = productsHTML;
}

async function pay() {
  try {
    order.shipping = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      addressLine1: document.getElementById("addressLine1").value,
      addressLine2: document.getElementById("addressLine2").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
    };

    const preference = await (
      await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    var script = document.createElement("script");

    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src =
      "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference.preferenceId;
    script.setAttribute("data-button-label", "Pagar con Mercado Pago");
    document.getElementById("order-actions").innerHTML = "";
    document.querySelector("#order-actions").appendChild(script);

    document.getElementById("name").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("addressLine1").disabled = true;
    document.getElementById("addressLine2").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("postalCode").disabled = true;
    document.getElementById("state").disabled = true;
    document.getElementById("country").disabled = true;
  } catch {
    window.alert("Sin stock");
  }

  carrito = [];
  total = 0;
  order = {
    items: [],
  };
  //await fetchProducts();
  document.getElementById("checkout").innerHTML = `Orden ${total}`;
}

function displayProducts() {
  document.getElementById("all-products").style.display = "block";
  document.getElementById("order").style.display = "none";

  const kit = productList.filter((p) => p.category === "kit");
  displayProductsByType(kit, "product-cards-kit");

  const biblias = productList.filter((p) => p.category === "biblias");
  displayProductsByType(biblias, "product-cards-biblias");

  const libros = productList.filter((p) => p.category === "libros");
  displayProductsByType(libros, "product-cards-libros");

  const folletos = productList.filter((p) => p.category === "folletos");
  displayProductsByType(folletos, "product-cards-folletos");

  const tratados = productList.filter((p) => p.category === "tratados");
  displayProductsByType(tratados, "product-cards-tratados");
}


function displayProductsByType(productsByType, tagId) {
  let productsHTML = "";
  productsByType.forEach((p) => {
    let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;

    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})">Sin stock</button>`;
    }

    productsHTML += `<div class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" />
            <h3>Art.# ${p.id}&nbsp;&nbsp;&nbsp;&nbsp;Stock ${p.stock}</h3>
            <h3>Cantidad&nbsp;&nbsp;<input type="number" id="quantity_${p.id}"></h3>
            ${buttonHTML}
        </div>`;
  });
  document.getElementById(tagId).innerHTML = productsHTML;
}

async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts();
}

window.onload = async () => {
  await fetchProducts();
};

