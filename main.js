const db = {
  methods: {
    find: (id) => {
      return db.items.find((item) => item.id === id);
    },
    remove: (items) => {
      items.forEach((item) => {
        const product = db.methods.find(item.id);
        product.qty = product.qty - item.qty;
      });

      console.log(db);
    },
  },
  items: [
    {
      id: 1,
      title: "Marlene McFly",
      price: 120,
      qty: 5,
      img: "images/A12.png",
    },
    {
      id: 2,
      title: "Flux Compression",
      price: 160,
      qty: 7,
      img: "images/A13.png",
    },
    {
      id: 3,
      title: "Pink Floid",
      price: 150,
      qty: 11,
      img: "images/R3-pink-floid.png",
    },
    {
      id: 4,
      title: "Marge",
      price: 130,
      qty: 13,
      img: "images/S6.png",
    },
    {
      id: 5,
      title: "Nija Gaiden",
      price: 170,
      qty: 20,
      img: "images/B49.png",
    },
    {
      id: 6,
      title: "Contra",
      price: 110,
      qty: 20,
      img: "images/B19.png",
    },
  ],
};

const shoppingCart = {
  items: [],
  methods: {
    add: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);
      if (cartItem) {
        if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
          cartItem.qty += qty;
        } else {
          alert("No hay productos suficientes");
        }
      } else {
        shoppingCart.items.push({ id, qty });
      }
    },
    remove: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);
      if (cartItem.qty -qty >= 0) {
        cartItem.qty -= qty;
      } else {
        shoppingCart.items = shoppingCart.items.filter(
          (item) => item.id !== id
        );
      }
    },
    count: (id) => {
      return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
    },
    get: (id) => {
      const index = shoppingCart.items.findIndex((item) => item.id === id);
      return index >= 0 ? shoppingCart.items[index] : null;
    },
    getTotal: () => {
      const total = shoppingCart.items.reduce((acc, item) => {
        const found = db.methods.find(item.id);
        return acc + found.price * item.qty;
      }, 0);
      return total;
    },
    hasInventory: (id, qty) => {
      return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    purchase: () => {
      db.methods.remove(shoppingCart.items);
      shoppingCart.items = [];
    },
  },
};
// const boton = document.querySelector('.carrito');
renderStore();

function renderStore() {
  const html = db.items.map((item) => {
    return `
            </div>
            <div class="card">
            <div class="img-container radio">
                <a href="${item.img}" target="_blank" rel="noopener noreferrer"><img class="radio" src="${item.img}" alt="Playera Marlene McFly"></a>
            </div>
            <div class="item">
                <div class="infor title move">${item.title}</div>
                <div class="infor price move">$ ${item.price}</div>
                <div class="infor qty move">${item.qty} unidades</div>
                <div class="actions">
                    <img class="add" data-id="${item.id}" src="images/carrito.png" alt="">
                </div>
            </div>
            
        `;
  });

  document.querySelector("#store-container").innerHTML = html.join("");

  document.querySelectorAll(" .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      const item = db.methods.find(id);

      if (item && item.qty -1 > 0) {
        //añadir a shopping cart
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
        console.log(shoppingCart)
      } else {
        console.log("Ya no hay inventario");
      }
    });
  });
}

function renderShoppingCart() {
  const html = shoppingCart.items.map(item => {
    const dbItem = db.methods.find(item.id);
        return `
            <div class="item">
                <div class="title">${dbItem.title}</div>
                <div class="price">$${dbItem.price}</div>
                <div class="qty">${item.qty} unidades</div>
                <div class="subtotal">
                    Subtotal: $${item.qty * dbItem.price}
                </div>
                <div class="actions">
                    <button class="addOne" data-id="${item.id}">+</button>
                    <button class="removeOne" data-id="${item.id}">-</button>
                </div>
            </div>
        `;
  });
    const closeButton = `
        <div class="cart-header">
            <button class="bClose">Close</button>
        </div>
    `;

    const purchaseButton =
     shoppingCart.items.length > 0
    ? `
        <div class="cart-actions">
            <button id="bPurchase">Comprar</button>
        </div>
    ` 
        : "";

    const total = shoppingCart.methods.getTotal();
    const totalContainer = `<div class="total">Total: $${total}</div>`;

    const shoppingCartContainer = document.querySelector("#cart-container");

    shoppingCartContainer.classList.remove("hide");
        shoppingCartContainer.classList.add("show");

    shoppingCartContainer.innerHTML = 
    closeButton + html.join('') + totalContainer + purchaseButton;

    document.querySelectorAll('.addOne').forEach( (button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.add(id, 1);
            renderShoppingCart(); 
        })
    })

    document.querySelectorAll('.removeOne').forEach( (button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(button.getAttribute('data-id'));
            shoppingCart.methods.remove(id, 1);
            renderShoppingCart();   
        });
    });

    document.querySelector('.bClose').addEventListener('click', (e) => {
        shoppingCartContainer.classList.remove('show');
        shoppingCartContainer.classList.add('hide');
    })

    const bPurchase = document.querySelector('#bPurchase');
    if(bPurchase){
        bPurchase.addEventListener('click', (e) => {
            shoppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        });
    }
}

