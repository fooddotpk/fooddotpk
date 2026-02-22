let currentCategory = "All";

// 🔥 UNIQUE CATEGORIES BANANA
function showCategories(){

  let cats = ["All"];
  menu.forEach(item => {
    if(!cats.includes(item.category)){
      cats.push(item.category);
    }
  });

  let box = document.getElementById("categories");
  box.innerHTML = "";

  cats.forEach(cat=>{
    box.innerHTML += `
      <button class="catBtn" onclick="filterCategory('${cat}')">
        ${cat}
      </button>
    `;
  });

}

// CATEGORY FILTER
function filterCategory(cat){
  currentCategory = cat;
  showAll();
}

// 🔥 MENU CARDS BANANA
function showAll(){

  let box = document.getElementById("menuItems");
  box.innerHTML = "";

  // Pehle sirf ON items lo
  let filteredMenu = menu.filter(item => item.status !== false);

  // Agar specific category select hai
  if(currentCategory != "All"){
    filteredMenu = filteredMenu.filter(item => item.category == currentCategory);
  }

  filteredMenu.forEach(item => {

    let img = item.image ? item.image : "slide1.jpg";

    box.innerHTML += `
      <div class="food-card">
        <img src="${img}">
        <h3>${item.name}</h3>
        <p>Rs ${item.price}</p>
        <button onclick="addToCart('${item.name}', ${item.price})">
          Add to Cart 🛒
        </button>
      </div>
    `;

  });

}