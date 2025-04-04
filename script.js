document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    function updateCartCount() {
        let cartBadge = document.getElementById("cart-badge");
        let count = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (count > 0) {
            cartBadge.style.display = "flex";
            cartBadge.textContent = count;
        } else {
            cartBadge.style.display = "none";
        }
    }

    function addToCart(event) {
        let product = event.target.closest(".product");
        let name = product.querySelector("h3").textContent;
        let price = product.querySelector("p").textContent;
        let image = product.querySelector("img").src;

        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        updateCartCount();
        alert(`${name} has been added to your cart!`);
    }

    function renderCart() {
        let cartItemsContainer = document.getElementById("cart-items");
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = cart.length ? "" : "<p>Your cart is empty.</p>";

        let totalPrice = 0;
        cart.forEach((item, index) => {
            totalPrice += parseFloat(item.price.replace("$", "")) * item.quantity;

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${parseFloat(item.price.replace("$", "")).toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${index})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById("total-price").textContent = totalPrice.toFixed(2);
        updateCartCount();
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }

    window.updateQuantity = function (index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        renderCart();
    };

    window.removeItem = function (index) {
        cart.splice(index, 1);
        renderCart();
    };

    if (document.getElementById("checkout-btn")) {
        document.getElementById("checkout-btn").addEventListener("click", function () {
            if (cart.length === 0) {
                alert("Your cart is empty!");
            } else {
                localStorage.setItem("lastOrder", JSON.stringify(cart));
                window.location.href = "thank-you.html";
            }
        });
    }

    if (document.getElementById("order-summary")) {
        let order = JSON.parse(localStorage.getItem("lastOrder")) || [];
        let summary = document.getElementById("order-summary");
        let total = order.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.quantity, 0);

        summary.innerHTML = order.map(item => `<p>${item.name} - ${item.quantity} x ${item.price}</p>`).join("");
        document.getElementById("total-price").textContent = total.toFixed(2);
        localStorage.removeItem("lastOrder");
    }

    document.querySelectorAll(".add-to-cart").forEach(button => button.addEventListener("click", addToCart));

    renderCart();
    updateCartCount();
});
