// Import the functions you need from the SDKs you need

// Always hide admin panel on page load
window.addEventListener("load", function(){
   document.getElementById("adminPanel").style.display = "none";
});
/* =========================
   PAGE LOAD
========================= */
window.onload = function(){
  let modal = document.getElementById("cartModal");
  if(modal){ modal.style.display = "none"; }
};

/* =========================
   WHATSAPP GENERAL BUTTONS
========================= */
let phone = "923049589788";

function orderNow(){
    let message = "Hello Food Dot PK 🍔%0A%0AI want to place an order.";
    window.open("https://wa.me/" + phone + "?text=" + message);
}

/* =========================
   SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/* =========================
   BACK TO TOP
========================= */
let topBtn = document.getElementById("topBtn");
window.onscroll = function(){
  if(document.documentElement.scrollTop > 300){
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
}
function topFunction(){
  window.scrollTo({top:0, behavior:'smooth'});
}

/* =========================
   BANNER SLIDER
========================= */
let slides = document.querySelectorAll(".slide");
let index = 0;
setInterval(()=>{
  if(slides.length > 0){
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }
},3000);

/* =========================
   CART SYSTEM 🔥
========================= */

let cart = [];

/* Add to cart */
function addToCart(name, price){
  let existing = cart.find(item => item.name === name);

  if(existing){
    existing.qty++;
  } else {
    cart.push({name, price, qty:1});
  }

  updateCartBadge();
}

/* Cart badge */
function updateCartBadge(){
  let count = 0;
  cart.forEach(i => count += i.qty);
  document.querySelector(".cart-badge").innerText = count;
}

/* Open cart */
function openCart(){
  document.getElementById("cartModal").style.display = "flex";
  renderCart();
}

/* Close cart */
function closeCart(){
  document.getElementById("cartModal").style.display = "none";
}

/* Quantity controls */
function increaseQty(index){
  cart[index].qty++;
  renderCart();
  updateCartBadge();
}

function decreaseQty(index){
  if(cart[index].qty > 1){
    cart[index].qty--;
  } else {
    cart.splice(index,1);
  }
  renderCart();
  updateCartBadge();
}

function removeItem(index){
  cart.splice(index,1);
  renderCart();
  updateCartBadge();
}

/* Render cart */
function renderCart(){
  let cartItems = document.getElementById("cartItems");
  let total = 0;
  cartItems.innerHTML = "";

  if(cart.length === 0){
    cartItems.innerHTML = "<p>Your cart is empty 😢</p>";
    document.getElementById("cartTotal").innerText = 0;
    return;
  }

  cart.forEach((item,index)=>{
    let itemTotal = item.price * item.qty;
    total += itemTotal;

    cartItems.innerHTML += `
      <div style="margin:10px 0;">
        <b>${item.name}</b><br>
        Rs ${item.price} x ${item.qty} = Rs ${itemTotal}<br>

    <div class="qty-controls">
  <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
  <button class="qty-btn" onclick="increaseQty(${index})">+</button>
  <button class="remove-btn" onclick="removeItem(${index})">✖</button>
</div>
      <hr>
    `;
  });

  document.getElementById("cartTotal").innerText = total;
}

/* WhatsApp checkout */
function checkoutWhatsApp(){
let payment = document.getElementById("paymentMethod").value;
  let name = document.getElementById("custName").value;
  let phoneInput = document.getElementById("custPhone").value;
  let address = document.getElementById("custAddress").value;

  let msg = "NEW ORDER 🍔%0A%0A";

  cart.forEach(i=>{
    msg += `${i.name} x${i.qty} = Rs ${i.price*i.qty}%0A`;
  });

  msg += `%0ATotal: Rs ${document.getElementById("cartTotal").innerText}`;
  msg += `%0A%0APayment Method: ${payment}`;
msg += `%0A%0AName: ${name}%0APhone: ${phoneInput}%0AAddress: ${address}`;

  window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
}
/* =========================
   ADMIN PANEL FINAL 🔐
========================= */

// OPEN ADMIN
function checkAdmin(){
  let pass = prompt("Enter Admin Password");

  if(pass === "7896"){
     document.getElementById("adminPanel").style.display = "block";
     document.body.style.overflow = "hidden";
     loadAdminProducts();   // ⭐ IMPORTANT
  }
  else{
     alert("Wrong Password ❌");
  }
}

// CLOSE ADMIN
function closeAdmin(){
  document.getElementById("adminPanel").style.display = "none";
  document.body.style.overflow = "auto";
}

// LOAD PRODUCTS IN ADMIN PANEL
function loadAdminProducts(){
  let box = document.getElementById("adminProducts");
  box.innerHTML = "";

  menu.forEach((item, index) => {

    let isOff = item.status === false;

    box.innerHTML += `
      <div style="
        display:flex; 
        justify-content:space-between; 
        align-items:center;
        margin:8px 0;
        padding:8px;
        border-radius:8px;
        ${isOff ? "background:#f2f2f2; opacity:0.6;" : ""}
      ">

        <span>
          ${item.name} - Rs ${item.price}
          ${isOff ? " <b style='color:red;'>(Unavailable)</b>" : ""}
        </span>

        <div style="display:flex; gap:6px;">
          <button onclick="editProduct(${index})">✏️</button>

          <button onclick="toggleStatus(${index})">
            ${item.status ? "🟢 ON" : "🔴 OFF"}
          </button>

          <button onclick="deleteProduct(${index})" style="background:#ff4d4d; color:white;">
            ❌
          </button>
        </div>

      </div>
    `;
  });
}

// EDIT PRODUCT
async function editProduct(index){

  let newName = prompt("New name:", menu[index].name);
  if(!newName) return;

  let newPrice = prompt("New price:", menu[index].price);
  if(!newPrice) return;

  let productId = menu[index].id;

  try{
    await db.collection("menu").doc(productId).update({
      Name: newName,
      price: Number(newPrice)
    });

    alert("Product Updated ✅");

    loadMenuFromFirebase();

  }catch(error){
    alert(error);
  }
}
async function deleteProduct(index){

  if(!confirm("Are you sure you want to permanently delete this product?")){
    return;
  }

  let productId = menu[index].id;

  try{
    await db.collection("menu").doc(productId).delete();

    alert("Product Deleted Successfully ❌");

    loadMenuFromFirebase();

  }catch(error){
    alert(error);
  }
}
// ADD PRODUCT TO FIREBASE
// ADD PRODUCT WITH IMAGE (ImgBB + Firebase)
async function addProduct(){

  let name = document.getElementById("pName").value;
  let price = document.getElementById("pPrice").value;
  let category = document.getElementById("pCategory").value;
  let file = document.getElementById("pImageFile").files[0];

  if(name === "" || price === "" || !file){
    alert("Fill all fields & select image ❌");
    return;
  }

  try{

    // IMAGE → BASE64 convert
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async function(){

      let base64Image = reader.result.split(",")[1];

      // Upload to ImgBB
      let formData = new FormData();
      formData.append("image", base64Image);

      let response = await fetch(
        "https://api.imgbb.com/1/upload?key=ad87f489d84b9210557b070d0f9a4140",
        { method:"POST", body:formData }
      );

      let data = await response.json();
      let imageURL = data.data.url;

      // Save to Firebase
      await db.collection("menu").add({
  Name: name,
  price: Number(price),
  category: category,
  Image: imageURL,
  status: true   // ⭐ NEW FIELD
});

      alert("Product Added with Image 🔥");

      loadMenuFromFirebase();
    }

  }catch(error){
    alert(error);
  }
}




/* =========================
   LOAD MENU FROM FIREBASE
========================= */

async function loadMenuFromFirebase(){

  menu = [];

  const snapshot = await db.collection("menu").get();

  snapshot.forEach(doc => {
    const data = doc.data();

    menu.push({
      id: doc.id,
      name: data.Name,
      price: data.price,
      category: data.category,
      image: data.Image,
      status: data.status !== false
    });
  });

  showCategories();
  showAll();

  // ⭐ IMPORTANT FIX
  let adminPanel = document.getElementById("adminPanel");

if(adminPanel && adminPanel.style.display !== "none"){
    loadAdminProducts();
}
}

window.addEventListener("load", loadMenuFromFirebase);
window.addEventListener("load", loadCategories);

// 🔥 LOAD CATEGORIES FROM FIREBASE
async function loadCategories(){

  let select = document.getElementById("pCategory");
  if(!select) return;

  select.innerHTML = "";

  const snapshot = await db.collection("categories").get();

  snapshot.forEach(doc=>{
    let option = document.createElement("option");
    option.value = doc.data().name;
    option.textContent = doc.data().name;
    select.appendChild(option);
  });
}

// 🔥 ADD CATEGORY FROM ADMIN PANEL
async function addCategory(){

  let name = document.getElementById("newCategoryName").value;

  if(name === ""){
    alert("Enter category name");
    return;
  }

  await db.collection("categories").add({
    name: name
  });

  alert("Category Added 🔥");
  document.getElementById("newCategoryName").value = "";

  loadCategories();
}
document.getElementById("year").innerText = new Date().getFullYear();
// 🔐 SECRET ADMIN SHORTCUT (CTRL + ALT + A)
document.addEventListener("keydown", function(e){
  if(e.ctrlKey && e.altKey && e.key === "a"){
    checkAdmin();
  }
});
async function toggleStatus(index){

  let productId = menu[index].id;
  let newStatus = !menu[index].status;

  try{
    await db.collection("menu").doc(productId).update({
      status: newStatus
    });

    alert("Status Updated 🔥");

    loadMenuFromFirebase();

  }catch(error){
    alert(error);
  }
}