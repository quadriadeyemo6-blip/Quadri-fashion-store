console.log("SCRIPT LOADED");

document.addEventListener("DOMContentLoaded", () => {
  // Load cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // -------------------------------
  // UPDATE CART DISPLAY (MODAL)
  // -------------------------------
  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if (cartItems) {
      cartItems.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
          <div>
            <strong>${item.name}</strong><br>
            $${item.price}
          </div>

          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseQuantity(${index})">−</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary ms-2" onclick="increaseQuantity(${index})">+</button>
            <button class="btn btn-sm btn-danger ms-3" onclick="removeItem(${index})">Remove</button>
          </div>
        `;

        cartItems.appendChild(li);
      });

      cartTotal.textContent = total;
    }

    if (cartCount) {
      cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    }
  }

  // -------------------------------
  // CART ACTIONS
  // -------------------------------
  window.increaseQuantity = function (index) {
    cart[index].quantity++;
    updateCart();
  };

  window.decreaseQuantity = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateCart();
  };

  // -------------------------------
  // ADD TO CART BUTTONS
  // -------------------------------
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);

      let item = cart.find((i) => i.name === name);

      if (item) {
        item.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCart();
      alert(`${name} added to cart`);
    });
  });

  // -------------------------------
  // EMAIL VALIDATION
  // -------------------------------
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  // -------------------------------
  // PAYSTACK PAYMENT
  // -------------------------------
  function payWithPaystack() {
    let totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let emailField = document.getElementById("customer-email");
    let customerEmail = emailField ? emailField.value.trim() : "";

    if (!customerEmail || !isValidEmail(customerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // -------------------------------
    // DELIVERY DETAILS VALIDATION
    // -------------------------------
    const deliveryName = document.getElementById("delivery-name")?.value.trim();
    const deliveryPhone = document
      .getElementById("delivery-phone")
      ?.value.trim();
    const deliveryAddress = document
      .getElementById("delivery-address")
      ?.value.trim();
    const deliveryCity = document.getElementById("delivery-city")?.value.trim();
    const deliveryState = document
      .getElementById("delivery-state")
      ?.value.trim();
    const deliveryNote = document.getElementById("delivery-note")?.value.trim();

    if (
      !deliveryName ||
      !deliveryPhone ||
      !deliveryAddress ||
      !deliveryCity ||
      !deliveryState
    ) {
      alert("Please fill in all required delivery details.");
      return;
    }

    // Save delivery details
    localStorage.setItem(
      "deliveryDetails",
      JSON.stringify({
        name: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress,
        city: deliveryCity,
        state: deliveryState,
        note: deliveryNote,
      }),
    );

    localStorage.setItem("customerEmail", customerEmail);

    let handler = PaystackPop.setup({
      key: "pk_live_770db6b55d41c36dee3145bcfa5002b376730fd8", // your public key
      email: customerEmail,
      amount: totalAmount * 100,
      currency: "NGN",
      ref: "FASHIONBRAND-" + Math.floor(Math.random() * 1000000000),

      callback: function (response) {
        alert("Payment successful! Reference: " + response.reference);
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
        window.location.href = "success.html";
      },

      onClose: function () {
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  }

  // -------------------------------
  // CHECKOUT BUTTONS
  // -------------------------------
  document.addEventListener("click", (e) => {
    if (
      e.target.id === "checkout-btn" ||
      e.target.classList.contains("go-checkout")
    ) {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      payWithPaystack();
    }
  });

  // -------------------------------
  // AUTO-FILL EMAIL
  // -------------------------------
  let savedEmail = localStorage.getItem("customerEmail");
  if (savedEmail && document.getElementById("customer-email")) {
    document.getElementById("customer-email").value = savedEmail;
  }

  updateCart();
});
