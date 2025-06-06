// === Sample canteen menu data ===
const menuItems = [
  {
    name: "Veggie Sandwich",
    description: "A delicious sandwich with fresh vegetables.",
    dietary: "Vegetarian",
    price: 5
  },
  {
    name: "Chicken Wrap",
    description: "Grilled chicken with lettuce and sauce.",
    dietary: "Halal",
    price: 6.5
  },
  {
    name: "Vegan Salad",
    description: "A healthy mix of greens and veggies.",
    dietary: "Vegan",
    price: 6
  }
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

// === Handle order submission and redirect to summary ===
function handleOrderSubmit(event) {
  event.preventDefault();

  const customerName = document.getElementById('customerName')?.value;
  const pickupDate = document.getElementById('pickupDate')?.value;
  const pickupTime = document.getElementById('pickupTime')?.value;

  if (!customerName || !pickupDate || !pickupTime) {
    alert("Please complete all fields.");
    return;
  }

  localStorage.setItem('customer_name', customerName);
  localStorage.setItem('pickup_date', pickupDate);
  localStorage.setItem('pickup_time', pickupTime);
  localStorage.setItem('order_submitted', 'true');

  alert("Thank you for your order!");
  window.location.href = 'order-summary.html';
}

// === Clear the order (cart reset) ===
function clearOrder() {
  if (confirm("Are you sure you want to clear your entire order?")) {
    localStorage.removeItem('orders');
    showOrderDetails();
    alert("Your order has been cleared.");
  }
}

// === Show order summary on the summary page ===
function showOrderSummary() {
  const section = document.getElementById('orderDetails');
  if (!section) return;

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const submitted = localStorage.getItem('order_submitted');
  let name = localStorage.getItem('customer_name') || "Customer";
  let pickupTime = localStorage.getItem('pickup_time') || "N/A";
  let pickupDate = localStorage.getItem('pickup_date') || "N/A";

  if (!submitted || orders.length === 0) {
    section.innerHTML = `<p>You have not placed any orders yet.</p>`;
    return;
  }

  section.innerHTML = `
    <h2>Order Summary</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Pickup Date:</strong> ${pickupDate}</p>
    <p><strong>Pickup Time:</strong> ${pickupTime}</p>
    <ul>
      ${orders.map(order => `<li>${order.name} x ${order.quantity} - $${(order.price * order.quantity).toFixed(2)}</li>`).join('')}
    </ul>
    <p><strong>Total:</strong> $${orders.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2)}</p>
    <button id="deleteOrderBtn">🗑️ Delete Order</button>
    <button id="editOrderBtn">✏️ Edit Order</button>
  `;

  const deleteBtn = document.getElementById('deleteOrderBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this order summary?")) {
        localStorage.removeItem('orders');
        localStorage.removeItem('order_submitted');
        localStorage.removeItem('customer_name');
        localStorage.removeItem('pickup_time');
        localStorage.removeItem('pickup_date');
        showOrderSummary();
      }
    });
  }

  const editBtn = document.getElementById('editOrderBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const editForm = document.createElement('form');
      editForm.id = 'editForm';
      editForm.innerHTML = `
        <h3>Edit Your Order Details</h3>
        <label for="editName">Name:</label>
        <input type="text" id="editName" value="${name}" required>
        <label for="editDate">Pickup Date:</label>
        <input type="date" id="editDate" value="${pickupDate}" required>
        <label for="editPickup">Pickup Time:</label>
        <input type="time" id="editPickup" value="${pickupTime}" min="08:00" max="15:00" required>
        <button type="submit">Save Changes</button>
      `;
      section.appendChild(editForm);

      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('editName')?.value;
        const newDate = document.getElementById('editDate')?.value;
        const newTime = document.getElementById('editPickup')?.value;

        localStorage.setItem('customer_name', newName);
        localStorage.setItem('pickup_date', newDate);
        localStorage.setItem('pickup_time', newTime);

        alert("Order updated successfully!");
        showOrderSummary();
      });
    });
  }
}

// === Initialize Everything on Page Load ===
document.addEventListener('DOMContentLoaded', () => {
  // Collapse toggle for each menu category
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const arrow = toggle.querySelector('.arrow');

      if (content && arrow) {
        content.classList.toggle('hidden');
        arrow.textContent = content.classList.contains('hidden') ? '▶' : '▼';
      }
    });
  });

  // Init functions
  displayMenu();
  showOrderDetails();
  showOrderSummary();

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }

  const pickupTimeInput = document.getElementById('pickupTime');
  if (pickupTimeInput) {
    pickupTimeInput.setAttribute('min', '08:00');
    pickupTimeInput.setAttribute('max', '15:00');
  }

  // Instruction Modal
  const modal = document.getElementById('instructionModal');
  const closeBtn = document.getElementById('closeInstruction');

  if (modal && closeBtn) {
    modal.style.display = 'block';
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});
