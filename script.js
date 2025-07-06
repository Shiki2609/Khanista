// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Header hide-on-scroll
let lastScrollY = window.scrollY;
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    header.style.top = '-140px';
  } else {
    header.style.top = '0';
  }
  lastScrollY = window.scrollY;
});

// Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const viewCartBtn = document.getElementById('viewCartBtn');
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('.close-button');
const cartItemsDisplay = document.getElementById('cartItemsDisplay');
const cartTotalDisplay = document.getElementById('cartTotal');
const cartCountDisplay = document.getElementById('cart-count');

// Order form fields (new improved form)
const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');
const notesInput = document.getElementById('notes');
const sendOrderWhatsAppBtn = document.getElementById('sendOrderWhatsApp');
const subtotalSpan = document.getElementById('subtotal');
const deliveryFeeSpan = document.getElementById('deliveryFee');
const totalSpan = document.getElementById('total');
const addressSection = document.getElementById('addressSection');
const customerAddress = document.getElementById('customerAddress');
const deliveryToggle = document.getElementById('deliveryToggle');
const toggleSlider = document.getElementById('toggleSlider');
const pickupOption = document.getElementById('pickupOption');
const deliveryOption = document.getElementById('deliveryOption');

// Cart logic
let cart = [];
const adminWhatsAppNumber = '27788852245';
const deliveryFee = 20.00;
let isDelivery = false;

// --- Delivery Toggle Logic (fully improved form compatible) ---
let startX = 0;
let currentX = 0;
let isDragging = false;
function updateDeliveryToggleState(delivery) {
  isDelivery = delivery;

  if (isDelivery) {
    toggleSlider.classList.add('delivery');
    addressSection.classList.add('show');
    customerAddress.required = true;
    pickupOption.classList.remove('active');
    pickupOption.classList.add('inactive');
    deliveryOption.classList.remove('inactive');
    deliveryOption.classList.add('active');
  } else {
    toggleSlider.classList.remove('delivery');
    addressSection.classList.remove('show');
    customerAddress.required = false;
    customerAddress.value = '';
    pickupOption.classList.remove('inactive');
    pickupOption.classList.add('active');
    deliveryOption.classList.remove('active');
    deliveryOption.classList.add('inactive');
  }
  updateCartDisplay();
}

// Delivery toggle event bindings
if (deliveryToggle) {
  // Click handler
  deliveryToggle.addEventListener('click', function () {
    updateDeliveryToggleState(!isDelivery);
  });

  // Touch start
  deliveryToggle.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  // Touch move
  deliveryToggle.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    e.preventDefault();
  });

  // Touch end
  deliveryToggle.addEventListener('touchend', function () {
    if (!isDragging) return;
    const deltaX = currentX - startX;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        updateDeliveryToggleState(true);
      } else {
        updateDeliveryToggleState(false);
      }
    }
    isDragging = false;
    startX = 0;
    currentX = 0;
  });

  // Mouse events for desktop
  deliveryToggle.addEventListener('mousedown', function (e) {
    startX = e.clientX;
    isDragging = true;
  });

  deliveryToggle.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  deliveryToggle.addEventListener('mouseup', function () {
    if (!isDragging) return;
    const deltaX = currentX - startX;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        updateDeliveryToggleState(true);
      } else {
        updateDeliveryToggleState(false);
      }
    }
    isDragging = false;
    startX = 0;
    currentX = 0;
  });

  // Prevent drag
  deliveryToggle.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  // Initialize
  updateDeliveryToggleState(false);
}

// --- Cart Operations ---
function updateCartDisplay() {
  cartItemsDisplay.innerHTML = '';
  let subtotal = 0;
  if (cart.length === 0) {
    cartItemsDisplay.innerHTML = '<p>Your cart is empty.</p>';
    sendOrderWhatsAppBtn.disabled = true;
    subtotalSpan.textContent = '0.00';
    deliveryFeeSpan.textContent = isDelivery ? deliveryFee.toFixed(2) : '0.00';
    totalSpan.textContent = isDelivery ? deliveryFee.toFixed(2) : '0.00';
  } else {
    sendOrderWhatsAppBtn.disabled = false;
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item-entry');
      itemElement.innerHTML = `
        <div class="cart-item-info">
            <span>${item.name}</span>
            <span>R${item.price.toFixed(2)}</span>
        </div>
        <input type="number" class="cart-item-quantity" data-item-id="${item.id}" value="${item.quantity}" min="1">
        <button class="remove-item-btn" data-item-id="${item.id}">Remove</button>
      `;
      cartItemsDisplay.appendChild(itemElement);
      subtotal += item.price * item.quantity;
    });
    subtotalSpan.textContent = subtotal.toFixed(2);
    deliveryFeeSpan.textContent = isDelivery ? deliveryFee.toFixed(2) : '0.00';
    totalSpan.textContent = (subtotal + (isDelivery ? deliveryFee : 0)).toFixed(2);
  }
  cartTotalDisplay.textContent = `R${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + (isDelivery ? deliveryFee : 0)).toFixed(2)}`;
  cartCountDisplay.textContent = cart.length;
}

// --- Pizza Size Toggle Logic ---
document.querySelectorAll('.size-toggle-group').forEach(group => {
  group.addEventListener('click', function (event) {
    if (event.target.classList.contains('size-toggle-btn')) {
      const selectedBtn = event.target;
      const parentGroup = selectedBtn.closest('.size-toggle-group');
      const itemDetails = parentGroup.closest('.item-details');
      parentGroup.querySelectorAll('.size-toggle-btn').forEach(btn => btn.classList.remove('active'));
      selectedBtn.classList.add('active');

      // Update price display
      const price = selectedBtn.dataset.price;
      itemDetails.querySelector('.current-pizza-price').textContent = `R${price}`;

      // Update Add to Cart button details
      const itemIdBase = parentGroup.dataset.baseId;
      const itemType = selectedBtn.dataset.type || selectedBtn.dataset.size; // Use data-type for burger, data-size for pizza
      const itemNameRaw = itemDetails.querySelector('h4').textContent;
      const itemName = /burger/i.test(itemNameRaw)
        ? `Classic Burger (${itemType.charAt(0).toUpperCase() + itemType.slice(1)})`
        : `${itemNameRaw.replace(' Pizza', '')} Pizza (${itemType === "med" ? "Medium" : "Large"})`;

      const addToCartBtn = itemDetails.querySelector('.add-to-cart-btn');
      addToCartBtn.dataset.itemId = `${itemIdBase}-${itemType}`;
      addToCartBtn.dataset.itemName = itemName;
      addToCartBtn.dataset.itemPrice = price;
    }
  });
  // Default to first button active if none
  const buttons = group.querySelectorAll('.size-toggle-btn');
  if (!group.querySelector('.size-toggle-btn.active') && buttons.length > 0) {
    buttons[0].classList.add('active');
  }
});

// Add to cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const itemId = event.target.dataset.itemId;
    const itemName = event.target.dataset.itemName;
    const itemPrice = parseFloat(event.target.dataset.itemPrice);

    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCartDisplay();
    alert(`${itemName} added to cart!`);
  });
});

// Open cart modal
viewCartBtn.addEventListener('click', () => {
  updateCartDisplay();
  cartModal.style.display = 'block';
});

// Close modal
closeButton.addEventListener('click', () => {
  cartModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target == cartModal) {
    cartModal.style.display = 'none';
  }
});

// Cart quantity change
cartItemsDisplay.addEventListener('change', (event) => {
  if (event.target.classList.contains('cart-item-quantity')) {
    const itemId = event.target.dataset.itemId;
    const newQuantity = parseInt(event.target.value);
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1 && newQuantity > 0) {
      cart[itemIndex].quantity = newQuantity;
      updateCartDisplay();
    } else if (newQuantity <= 0) {
      cart.splice(itemIndex, 1);
      updateCartDisplay();
    }
  }
});

// Remove item from cart
cartItemsDisplay.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-item-btn')) {
    const itemId = event.target.dataset.itemId;
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
  }
});

// WhatsApp order
sendOrderWhatsAppBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before sending an order.');
    return;
  }

  const customerName = customerNameInput.value.trim();
  const customerPhone = customerPhoneInput.value.trim();
  const notes = notesInput.value.trim();
  const deliveryAddress = customerAddress ? customerAddress.value.trim() : '';

  if (!customerName || !customerPhone) {
    alert('Please fill in your name and WhatsApp phone number.');
    return;
  }
  if (isDelivery && !deliveryAddress) {
    alert('Please provide a delivery address.');
    return;
  }

  let subtotal = 0;
  let orderDetailsAdmin = '';
  let orderDetailsClient = '';
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    orderDetailsAdmin += `${index + 1}. ${item.name} x${item.quantity} (R${itemTotal.toFixed(2)})\n`;
    orderDetailsClient += `${index + 1}. ${item.name} x${item.quantity}\n`;
  });

  const currentDeliveryFee = isDelivery ? deliveryFee : 0;
  const totalAmount = subtotal + currentDeliveryFee;

  // Admin Message
  let adminMessage = `*New Khanista Order!*\n`;
  adminMessage += `*Client Name:* ${customerName}\n`;
  adminMessage += `*Client Phone:* ${customerPhone}\n`;
  adminMessage += `*Order Type:* ${isDelivery ? 'Delivery' : 'Pickup'}\n`;
  if (isDelivery && deliveryAddress) {
    adminMessage += `*Delivery Address:* ${deliveryAddress}\n`;
  }
  adminMessage += `\n*Order Details:*\n${orderDetailsAdmin}`;
  adminMessage += `*Subtotal:* R${subtotal.toFixed(2)}\n`;
  if (isDelivery) {
    adminMessage += `*Delivery Fee:* R${currentDeliveryFee.toFixed(2)}\n`;
  }
  adminMessage += `*Total Amount:* R${totalAmount.toFixed(2)}\n`;
  if (notes) adminMessage += `*Notes:* ${notes}\n`;
  adminMessage += `\n_Please confirm with the client for ${isDelivery ? 'delivery' : 'collection'}._`;

  // Client Message
  let clientMessage = `*Hello ${customerName}!*\n`;
  clientMessage += `Your Khanista order has been received:\n`;
  clientMessage += `${orderDetailsClient}`;
  clientMessage += `*Subtotal:* R${subtotal.toFixed(2)}\n`;
  if (isDelivery) {
    clientMessage += `*Delivery Fee:* R${currentDeliveryFee.toFixed(2)}\n`;
    clientMessage += `*Delivery Address:* ${deliveryAddress}\n`;
  }
  clientMessage += `*Total Amount:* R${totalAmount.toFixed(2)}\n`;
  if (notes) clientMessage += `*Notes:* ${notes}\n`;
  if (isDelivery) {
    clientMessage += `We will deliver your order to the address provided.\n`;
  } else {
    clientMessage += `Please collect your order at 41 Granada Street.\n`;
  }
  clientMessage += `Thank you for choosing Khanista!`;

  // WhatsApp links
  const adminWhatsAppURL = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(adminMessage)}`;
  const clientWhatsAppURL = `https://wa.me/${customerPhone}?text=${encodeURIComponent(clientMessage)}`;

  window.open(adminWhatsAppURL, '_blank');
  setTimeout(() => {
    window.open(clientWhatsAppURL, '_blank');
  }, 1000);

  alert('Your order has been sent to Khanista via WhatsApp! A confirmation message will also be sent to your WhatsApp.');
  cartModal.style.display = 'none';
  cart = [];
  updateCartDisplay();
});

// Hamburger menu for mobile
const hamburger = document.getElementById('hamburger-menu');
const navUl = document.querySelector('nav ul');
if (hamburger && navUl) {
  hamburger.addEventListener('click', () => {
    navUl.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      navUl.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// Initial cart display
updateCartDisplay();
