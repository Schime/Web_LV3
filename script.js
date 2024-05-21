// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button')
const buyModal = document.getElementById('buyModal');
const buyMessage = document.getElementById('buyMessage');
const buyModalClose = buyModal.querySelector('.close');



// Lista svih itema
let items = [
    {
        id: 1,
        name: 'Apple',
        price: 1.99,
        type: 'Food',
        subtype: 'Fruit',
    },
    {
        id: 2,
        name: 'Banana',
        price: 0.99,
        type: 'Food',
        subtype: 'Fruit',
    },
    {
        id: 3,
        name: 'Potato',
        price: 1.99,
        type: 'Food',
        subtype: 'Vegetable',
    },
    {
        id: 4,
        name: 'Tomato',
        price: 2.5,
        type: 'Food',
        subtype: 'Vegetable',
    },
    {
        id: 5,
        name: 'Persimmon',
        price: 2,
        type: 'Food',
        subtype: 'Fruit',
    },
];


// Pridruzivanje slika elementima iz liste preko ID-a

let itemImages = [
    {
        id: 1,
        src: "images/apple.jpg"
    },
    {
        id: 2,
        src: "images/banana.jpg"
    },
    {
        id: 3,
        src: "images/potato.jpg"
    },
    {
        id: 4,
        src: "images/tomato.jpg",
    },
    {
        id: 5,
        src: "images/persimmon.jpg",
    },
];


// Prazna kosarica
let cart = [];


// Funkcija za dodavanje listenera nakon kreiranja liste itema 
function attachButtonListeners(selector, listenerFunction){
    const addToCartButtons = document.querySelectorAll(selector);
    addToCartButtons.forEach(button => {
        button.addEventListener('click', listenerFunction);
    })
}


// Funkcija za dodavanje itema u kosaricu
function addToCart(event){
    const itemId = event.target.dataset.id;
    const selectedItem = items.find(item => item.id === parseInt(itemId));

    const existingItem = cart.find(item => item.id === selectedItem.id);

    if(existingItem){
        existingItem.quantity++;
    }else{
        selectedItem.quantity = 1;
        cart.push(selectedItem);
    }
    updateCartBadge();
    updateCartList();
}



// Funkcija za prikaz kosarice kada ima itema u njoj
function updateCartList(){
    cartItemsList.innerHTML = '';

    let totalPrice = 0;
    cart.forEach(item => {
        const itemImage = itemImages.find(img => img.id === item.id)

        let listItem = document.createElement('li');
        listItem.classList.add('cart-item');
        let imageElement = document.createElement('img');

        imageElement.src = itemImage.src;
        imageElement.alt = item.name;
        imageElement.style.width = '5em';
        imageElement.style.height = '5em';

        listItem.appendChild(imageElement);

        let itemInfoDiv = document.createElement('div');
        itemInfoDiv.classList.add('item-info');

        itemInfoDiv.innerHTML = `
            <p> ${item.name} - $${item.price}</p>
            <p> Type: ${item.type}</p>
            <p> Subtype: ${item.subtype}</p>
        `;

        listItem.appendChild(itemInfoDiv);

        let itemIncDec = document.createElement('div');
        itemIncDec.classList.add('incdec-buttons');

        itemIncDec.innerHTML = `
            <button class="increment-btn" data-id="${item.id}">+</button>
            <p>${item.quantity} </p>
            <button class="decrement-btn" data-id="${item.id}">-</button>
            <button class ="delete-btn" data-id="${item.id}">X</button>
        `;

        itemIncDec.querySelector('.increment-btn').addEventListener('click', () => incrementQuantity(item.id));
        itemIncDec.querySelector('.decrement-btn').addEventListener('click', () => decrementQuantity(item.id));
        itemIncDec.querySelector('.delete-btn').addEventListener('click', () => removeCartItem(item.id));

        listItem.appendChild(itemIncDec);

        cartItemsList.appendChild(listItem);

        totalPrice += item.price * item.quantity;
    });


    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}



// Uvecanje countera za item u kosarici
function incrementQuantity(itemId){
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if(itemIndex !== -1){
        cart[itemIndex].quantity++;
        updateCartList();
        updateCartBadge();
    }
}


// Uklanjanje itema iz kosarice jedan po jedan, osim ako nije preostao jedan
function decrementQuantity(itemId){
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if(itemIndex !== -1){
        if(cart[itemIndex].quantity > 1){
            cart[itemIndex].quantity--;
        }
    }
    updateCartList();
    updateCartBadge();
}



// Brise sve iteme u kosarici
function removeCartItem(itemId){
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if(itemIndex !== -1){
        cart.splice(itemIndex, 1);
    }
    updateCartList();
    updateCartBadge();
}


// Azuriranje kolicine itema u kosarici
function updateCartBadge(){
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalQuantity;
}


// Brisanje/kupnja itema iz kosarice i prikazivanje prikladnih poruka
function buyItems(){
    if(cart.length === 0){
        buyMessage.textContent = 'Košarica je prazna. Molimo dodajte artikle prije kupovine.'
    }else{
        buyMessage.textContent = 'Uspješno ste kupili artikle iz košarice.';
        cart = [];
        updateCartList();
        updateCartBadge();
    }

    buyModal.style.display = 'block';
}


// Prikaz svih itema
function fillItemsGrid(items) {
    for (const item of items) {
        
        const itemImage = itemImages.find(img => img.id === item.id);

        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${itemImage.src}" alt="${item.name}" style="width: 15em; height: 15em;">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);

    }
    attachButtonListeners('.add-to-cart-btn', addToCart);
}


// Funkcija za "querianje" itema
// Poziva funkciju fillItemsGrid kako bi prikazali samo "queriane" iteme
function displayQueriedItems(searchTerm){
    const searchTermLower = searchTerm.toLowerCase();

    const quriedItems = items.filter(item => item.name.toLowerCase().includes(searchTermLower) 
    || item.type.toLowerCase().includes(searchTermLower) 
    || item.subtype.toLowerCase().includes(searchTermLower));

    // Display nothing
    itemsGrid.innerHTML = '';

    fillItemsGrid(quriedItems)
}


// Toggla modal view za kosaricu
function toggleModal() {
  modal.classList.toggle('show-modal');
}


fillItemsGrid(items);

cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);


// Listener za searchButton kod "querianja"
searchButton.addEventListener('click', function() {
    if(searchInput.value != null){
        displayQueriedItems(searchInput.value)
    }
});


// Kod pretrazivanja, "ENTER" radi isto sto i klik na tipku "search"
searchInput.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        event.preventDefault();
        if(searchInput.value!= null){
            displayQueriedItems(searchInput.value)
        }
    }
})


// Listener za kupovanje itema
buyButton.addEventListener('click', buyItems);


// Listener za micanje modala za prikaz poruke o kupnji
buyModalClose.addEventListener('click', () =>{
    buyModal.style.display = 'none';
})