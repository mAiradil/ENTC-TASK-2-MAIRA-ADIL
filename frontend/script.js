// === Sample canteen menu data ===
const menuItems = [
  { name: "Veggie Sandwich", description: "A delicious sandwich with fresh vegetables.", dietary: "Vegetarian", price: 5 },
  { name: "Chicken Wrap", description: "Grilled chicken with lettuce and sauce.", dietary: "Halal", price: 6.5 },
  { name: "Vegan Salad", description: "A healthy mix of greens and veggies.", dietary: "Vegan", price: 6 }
];

// === Display menu items dynamically ===
function displayMenu() {
  const menuSection = document.getElementById('menu');
  if (!menuSection) return;

  menuSection.innerHTML = '';
  menuItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <h3>${item.name} - $${item.price.toFixed(2)}</h3>
      <p>${item.description}</p>
      <p><strong>${item.dietary}</strong></p>
      <button onclick="addToOrder('${item.name}', ${item.price})">Order</button>
    `;
    menuSection.appendChild(div);
  });
}

// === Add item to order (localStorage) ===
function addToOrder(itemName, itemPrice) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  const existingItem = orders.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    orders.push({ name: itemName, price: itemPrice, quantity: 1 });
  }
  localStorage.setItem('orders', JSON.stringify(orders));
  alert(`${itemName} has been added to your order!`);
}

// === Show current order on "Your Orders" page ===
function showOrderDetails() {
  const orderList = document.getElementById('orderList');
  const totalAmount = document.getElementById('totalAmount');
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (!orderList || !totalAmount) return;
  orderList.innerHTML = '';
  let total = 0;

  orders.forEach(order => {
    const item = document.createElement('li');
    item.textContent = `${order.name} x ${order.quantity} - $${(order.price * order.quantity).toFixed(2)}`;
    orderList.appendChild(item);
    total += order.price * order.quantity;
  });

  totalAmount.textContent = total.toFixed(2);
}

// === Handle order submission and save to submitted_orders array ===
function handleOrderSubmit(event) {
  event.preventDefault();

  const customerName = document.getElementById('customerName')?.value;
  const pickupDate = document.getElementById('pickupDate')?.value;
  const pickupTime = document.getElementById('pickupTime')?.value;
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (!customerName || !pickupDate || !pickupTime || orders.length === 0) {
    alert("Please complete all fields and add at least one item.");
    return;
  }

  const newOrder = {
    name: customerName,
    pickup_date: pickupDate,
    pickup_time: pickupTime,
    items: orders,
    total: orders.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  const previousOrders = JSON.parse(localStorage.getItem('submitted_orders')) || [];
  previousOrders.push(newOrder);
  localStorage.setItem('submitted_orders', JSON.stringify(previousOrders));
  localStorage.removeItem('orders');

  alert("Thank you for your order!");
  window.location.href = 'order-summary.html';
}

// === Clear the cart only ===
function clearOrder() {
  if (confirm("Are you sure you want to clear your entire order?")) {
    localStorage.removeItem('orders');
    showOrderDetails();
    alert("Your order has been cleared.");
  }
}

// === Display all submitted orders on summary page ===
function showOrderSummary() {
  const section = document.getElementById('orderDetails');
  if (!section) return;

  const orders = JSON.parse(localStorage.getItem('submitted_orders')) || [];
  section.innerHTML = '<h2>All Order Summaries</h2>';

  if (orders.length === 0) {
    section.innerHTML += `<p>You have not placed any orders yet.</p>`;
    return;
  }

  orders.forEach((order, index) => {
    const container = document.createElement('div');
    container.className = 'order-block';
    container.innerHTML = `
      <h3>Order #${index + 1}</h3>
      <p><strong>Name:</strong> ${order.name}</p>
      <p><strong>Pickup Date:</strong> ${order.pickup_date}</p>
      <p><strong>Pickup Time:</strong> ${order.pickup_time}</p>
      <ul>
        ${order.items.map(i => `<li>${i.name} x ${i.quantity} - $${(i.price * i.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <button onclick="deleteOrder(${index})">🗑️ Delete Order</button>
      <button onclick="editOrder(${index})">✏️ Edit Order</button>
      <div id="editForm${index}"></div>
    `;
    section.appendChild(container);
  });
}

// === Delete a specific order ===
function deleteOrder(index) {
  const orders = JSON.parse(localStorage.getItem('submitted_orders')) || [];
  if (confirm("Delete this order?")) {
    orders.splice(index, 1);
    localStorage.setItem('submitted_orders', JSON.stringify(orders));
    showOrderSummary();
  }
}

// === Edit a specific order ===
function editOrder(index) {
  const orders = JSON.parse(localStorage.getItem('submitted_orders')) || [];
  const order = orders[index];
  const container = document.getElementById(`editForm${index}`);
  container.innerHTML = `
    <form onsubmit="submitEdit(event, ${index})">
      <label>Name: <input type="text" id="editName${index}" value="${order.name}" required></label>
      <label>Date: <input type="date" id="editDate${index}" value="${order.pickup_date}" required></label>
      <label>Time: <input type="time" id="editTime${index}" value="${order.pickup_time}" min="08:00" max="15:00" required></label>
      <button type="submit">Save</button>
    </form>
  `;
}

// === Handle saving edited order ===
function submitEdit(event, index) {
  event.preventDefault();
  const orders = JSON.parse(localStorage.getItem('submitted_orders')) || [];

  orders[index].name = document.getElementById(`editName${index}`).value;
  orders[index].pickup_date = document.getElementById(`editDate${index}`).value;
  orders[index].pickup_time = document.getElementById(`editTime${index}`).value;

  localStorage.setItem('submitted_orders', JSON.stringify(orders));
  alert("Order updated!");
  showOrderSummary();
}

// === Init on page load ===
document.addEventListener('DOMContentLoaded', () => {
  displayMenu();
  showOrderDetails();
  showOrderSummary();

  const orderForm = document.getElementById('orderForm');
  if (orderForm) orderForm.addEventListener('submit', handleOrderSubmit);

  const pickupTimeInput = document.getElementById('pickupTime');
  if (pickupTimeInput) {
    pickupTimeInput.setAttribute('min', '08:00');
    pickupTimeInput.setAttribute('max', '15:00');
  }

  const modal = document.getElementById('instructionModal');
  const closeBtn = document.getElementById('closeInstruction');
  if (modal && closeBtn) {
    modal.style.display = 'block';
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  const toggle = document.getElementById('themeToggle');
  const body = document.body;
  if (toggle) {
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
      toggle.checked = true;
    }
    toggle.addEventListener('change', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }
});
