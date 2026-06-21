console.log("CHECKOUT PAGE LOADED");

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const checkoutCart = document.getElementById("checkout-cart");
  const checkoutTotal = document.getElementById("checkout-total");

  // -------------------------------
  // DISPLAY CART ITEMS
  // -------------------------------
  function loadCheckoutCart() {
    checkoutCart.innerHTML = "";
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
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="decreaseCheckout(${index})">−</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary ms-2" onclick="increaseCheckout(${index})">+</button>
        </div>
      `;

      checkoutCart.appendChild(li);
    });

    checkoutTotal.textContent = total;
  }

  loadCheckoutCart();

  // -------------------------------
  // QUANTITY CONTROLS
  // -------------------------------
  window.increaseCheckout = function (index) {
    cart[index].quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCheckoutCart();
  };

  window.decreaseCheckout = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCheckoutCart();
  };

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
  function payWithPaystack(customerEmail) {
    let totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let handler = PaystackPop.setup({
      key: "pk_live_770db6b55d41c36dee3145bcfa5002b376730fd8",
      email: customerEmail,
      amount: totalAmount * 100,
      currency: "NGN",
      ref: "FASHIONBRAND-" + Math.floor(Math.random() * 1000000000),

      callback: function (response) {
        alert("Payment successful! Reference: " + response.reference);
        cart = [];
        localStorage.removeItem("cart");
        window.location.href = "success.html";
      },

      onClose: function () {
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  }

  // -------------------------------
  // FORM SUBMIT HANDLER
  // -------------------------------
  const checkoutForm = document.getElementById("checkout-form");

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("customer-email").value.trim();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("customerEmail", email);

    payWithPaystack(email);
  });
});
