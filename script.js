// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoview({
            behavior: 'smooth'
        });
    });
});

// --- WhatsApp Ordering System with Cart ---

// Selectors for elements
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const viewCartBtn = document.getElementById('viewCartBtn');
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('.close-button');
const cartItemsDisplay = document.getElementById('cartItemsDisplay');
const cartTotalDisplay = document.getElementById('cartTotal');
const cartCountDisplay = document.getElementById('cart-count');
const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');
const notesInput = document.getElementById('notes');
const sendOrderWhatsAppBtn = document.getElementById('sendOrderWhatsApp');

// New selectors for pizza size toggle buttons
const sizeToggleGroups = document.querySelectorAll('.size-toggle-group'); // Container for size buttons

let cart = []; // Array to store cart items: [{ id, name, price, quantity }]

// Admin WhatsApp number for Khanista
const adminWhatsAppNumber = '27788852245'; // Format: CountryCodePhoneNumber (e.g., 27821234567)

// Function to update cart display and count
function updateCartDisplay() {
    cartItemsDisplay.innerHTML = ''; // Clear current display
    let total = 0;

    if (cart.length === 0) {
        cartItemsDisplay.innerHTML = '<p>Your cart is empty.</p>';
        sendOrderWhatsAppBtn.disabled = true; // Disable order button if cart is empty
    } else {
        sendOrderWhatsAppBtn.disabled = false; // Enable order button
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
            total += item.price * item.quantity;
        });
    }

    cartTotalDisplay.textContent = `R${total.toFixed(2)}`;
    cartCountDisplay.textContent = cart.length; // Number of unique items in cart
}

// --- Pizza Size Toggle Logic ---
sizeToggleGroups.forEach(group => {
    const buttons = group.querySelectorAll('.size-toggle-btn');
    const baseId = group.dataset.baseId; // e.g., 'bbq-steak'

    // Find the parent item-details div for this group
    const itemDetails = group.closest('.item-details');
    if (!itemDetails) return; // Should not happen

    const priceSpan = itemDetails.querySelector('.current-pizza-price');
    const addToCartBtn = itemDetails.querySelector('.add-to-cart-btn');
    const pizzaNameElement = itemDetails.querySelector('h4'); // The h4 containing the pizza name

    // Function to update the UI for a specific size toggle group
    const updateSizeSelection = (selectedButton) => {
        buttons.forEach(btn => btn.classList.remove('active'));
        selectedButton.classList.add('active');

        const newPrice = parseFloat(selectedButton.dataset.price);
        const newSize = selectedButton.dataset.size; // 'med' or 'lar'

        if (priceSpan) {
            priceSpan.textContent = `R${newPrice}`;
        }

        if (addToCartBtn && pizzaNameElement) {
            // Construct the new data-item-id (e.g., bbq-steak-med, bbq-steak-lar)
            addToCartBtn.dataset.itemId = `${baseId}-${newSize}`;
            // Construct the new data-item-name (e.g., BBQ Steak Pizza (Medium))
            const pizzaBaseName = pizzaNameElement.textContent.replace(' Pizza', ''); // Get base name
            addToCartBtn.dataset.itemName = `${pizzaBaseName} Pizza (${newSize === 'med' ? 'Medium' : 'Large'})`;
            addToCartBtn.dataset.itemPrice = newPrice;
        }
    };

    // Add click listeners to buttons within this group
    buttons.forEach(button => {
        button.addEventListener('click', () => updateSizeSelection(button));
    });

    // Initialize the selection on page load
    // Find the initially active button (should be "Medium") and update UI
    const initialActiveButton = group.querySelector('.size-toggle-btn.active');
    if (initialActiveButton) {
        updateSizeSelection(initialActiveButton);
    } else {
        // Fallback: if no active class, default to first button
        if (buttons.length > 0) {
            updateSizeSelection(buttons[0]);
        }
    }
});

document.querySelectorAll('.size-toggle-group').forEach(group => {
    group.addEventListener('click', function(event) {
        if (event.target.classList.contains('size-toggle-btn')) {
            const selectedBtn = event.target;
            const parentGroup = selectedBtn.closest('.size-toggle-group');
            const itemDetails = parentGroup.closest('.item-details');

            // Remove active class from all buttons in this group
            parentGroup.querySelectorAll('.size-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to the clicked button
            selectedBtn.classList.add('active');

            // Update price display
            const price = selectedBtn.dataset.price;
            itemDetails.querySelector('.current-pizza-price').textContent = `R${price}`;

            // Update Add to Cart button details
            const itemIdBase = parentGroup.dataset.baseId;
            const itemType = selectedBtn.dataset.type; // Use data-type for burger
            const itemName = `Classic Burger (${itemType.charAt(0).toUpperCase() + itemType.slice(1)})`; // Capitalize first letter

            const addToCartBtn = itemDetails.querySelector('.add-to-cart-btn');
            addToCartBtn.dataset.itemId = `${itemIdBase}-${itemType}`;
            addToCartBtn.dataset.itemName = itemName;
            addToCartBtn.dataset.itemPrice = price;
        }
    });
});

// Event listeners for "Add to Cart" buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const itemId = event.target.dataset.itemId;
        const itemName = event.target.dataset.itemName;
        const itemPrice = parseFloat(event.target.dataset.itemPrice);

        // Check if item already exists in cart with the exact ID (which now includes size)
        const existingItem = cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }
        updateCartDisplay();
        alert(`${itemName} added to cart!`); // Simple confirmation
    });
});

// Open the cart modal when cart icon/button is clicked
viewCartBtn.addEventListener('click', () => {
    updateCartDisplay(); // Refresh display before opening
    cartModal.style.display = 'block';
});

// Close the modal when the close button is clicked
closeButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
});

// Handle quantity changes in the cart modal
cartItemsDisplay.addEventListener('change', (event) => {
    if (event.target.classList.contains('cart-item-quantity')) {
        const itemId = event.target.dataset.itemId;
        const newQuantity = parseInt(event.target.value);
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex > -1 && newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
            updateCartDisplay();
        } else if (newQuantity <= 0) {
            // If quantity is 0 or less, remove the item
            cart.splice(itemIndex, 1);
            updateCartDisplay();
        }
    }
});

// Handle item removal from cart
cartItemsDisplay.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-btn')) {
        const itemId = event.target.dataset.itemId;
        cart = cart.filter(item => item.id !== itemId);
        updateCartDisplay();
    }
});

// Send order via WhatsApp
sendOrderWhatsAppBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before sending an order.');
        return;
    }

    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    const notes = notesInput.value.trim();

    if (!customerName || !customerPhone) {
        alert('Please fill in your name and WhatsApp phone number.');
        return;
    }

    let totalAmount = 0;
    let orderDetailsAdmin = '';
    let orderDetailsClient = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        orderDetailsAdmin += `${index + 1}. ${item.name} x${item.quantity} (R${itemTotal.toFixed(2)})\n`;
        orderDetailsClient += `${index + 1}. ${item.name} x${item.quantity}\n`;
    });

    // Prepare message for Admin
    let adminMessage = `*New Khanista Order!*\n`;
    adminMessage += `*Client Name:* ${customerName}\n`;
    adminMessage += `*Client Phone:* ${customerPhone}\n`;
    adminMessage += `\n*Order Details:*\n${orderDetailsAdmin}`;
    adminMessage += `*Total Amount:* R${totalAmount.toFixed(2)}\n`;
    if (notes) {
        adminMessage += `*Notes:* ${notes}\n`;
    }
    adminMessage += `\n_Please confirm with the client for collection._`;

    // Prepare message for Client (confirmation)
    let clientMessage = `*Hello ${customerName}!*\n`;
    clientMessage += `Your Khanista order has been received:\n`;
    clientMessage += `${orderDetailsClient}`;
    clientMessage += `*Total Amount:* R${totalAmount.toFixed(2)}\n`;
    if (notes) {
        clientMessage += `*Notes:* ${notes}\n`;
    }
    clientMessage += `We will confirm your order shortly. Please collect your order at 41 Granada Street.\n`;
    clientMessage += `Thank you for choosing Khanista!`;

    // Construct WhatsApp URLs, ensuring the message text is URL-encoded
    const adminWhatsAppURL = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(adminMessage)}`;
    const clientWhatsAppURL = `https://wa.me/${customerPhone}?text=${encodeURIComponent(clientMessage)}`;

    // Open WhatsApp links
    window.open(adminWhatsAppURL, '_blank'); // Open admin chat first
    setTimeout(() => {
        window.open(clientWhatsAppURL, '_blank'); // Open client chat after a small delay
    }, 1000); // Small delay to allow the first tab to open

    alert('Your order has been sent to Khanista via WhatsApp! A confirmation message will also be sent to your WhatsApp.');
    cartModal.style.display = 'none'; // Close modal after sending
    cart = []; // Clear cart after order is sent
    updateCartDisplay(); // Update display to show empty cart
});

// Initial update of cart count on page load
updateCartDisplay();