
const itemForm = document.getElementById("item-form");
const itemNameInput = document.getElementById("item-name");
const itemPriceInput = document.getElementById("item-price");
const shoppingList = document.getElementById("shopping-list");
const totalCost = document.getElementById("total-cost");
const purchasedCount = document.getElementById("purchased-count");
const markPurchasedButton = document.getElementById("mark-purchased");
const clearListButton = document.getElementById("clear-list");

// Array containing all shopping items
let items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

function saveItems() {
  localStorage.setItem("shoppingItems", JSON.stringify(items));
}

function updateSummary() {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const purchased = items.filter(item => item.purchased).length;

  totalCost.textContent = `KSh ${total.toFixed(2)}`;
  purchasedCount.textContent = purchased;
}

function renderItems() {
  shoppingList.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "shopping-item";
    li.classList.toggle("purchased", item.purchased);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.selected || false;
    checkbox.setAttribute("aria-label", `Select ${item.name}`);

    checkbox.addEventListener("change", () => {
      item.selected = checkbox.checked;
      saveItems();
    });

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;

    const price = document.createElement("span");
    price.textContent = `KSh ${item.price.toFixed(2)}`;

    const purchaseButton = document.createElement("button");
    purchaseButton.textContent = item.purchased ? "Unmark" : "Purchased";
    purchaseButton.type = "button";

    purchaseButton.addEventListener("click", () => {
      item.purchased = !item.purchased;
      saveItems();
      renderItems();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";

    editButton.addEventListener("click", () => {
      const newName = prompt("Edit item name:", item.name);
      if (newName === null || !newName.trim()) return;

      const newPrice = prompt("Edit price in KSh:", item.price);
      if (newPrice === null || newPrice.trim() === "") return;

      const parsedPrice = Number(newPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        alert("Please enter a valid price.");
        return;
      }

      item.name = newName.trim();
      item.price = parsedPrice;
      saveItems();
      renderItems();
    });

    li.append(checkbox, name, price, purchaseButton, editButton);
    shoppingList.appendChild(li);
  });

  updateSummary();
}

itemForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const price = Number(itemPriceInput.value);

  if (!name || itemPriceInput.value.trim() === "" ||
      !Number.isFinite(price) || price < 0) {
    alert("Enter an item name and a valid non-negative price.");
    return;
  }

  items.push({
    id: Date.now() + Math.random(),
    name,
    price,
    purchased: false,
    selected: false
  });

  saveItems();
  renderItems();
  itemForm.reset();
  itemNameInput.focus();
});

markPurchasedButton.addEventListener("click", () => {
  items.forEach(item => {
    if (item.selected) {
      item.purchased = true;
      item.selected = false;
    }
  });

  saveItems();
  renderItems();
});

clearListButton.addEventListener("click", () => {
  if (!items.length || !confirm("Clear the entire shopping list?")) return;

  items = [];
  saveItems();
  renderItems();
});

// Display saved items when the page opens
renderItems();
