document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("delcast_cart")) || [];

    const cartBtns = document.querySelectorAll(".cart-btn");
    const addCartBtns = document.querySelectorAll(".add-cart");

    const formatPrice = (amount) => {
        return "₱" + amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const showToast = (message, type = "info") => {
        let toastContainer = document.getElementById("delcast-toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "delcast-toast-container";
            toastContainer.className = "position-fixed bottom-0 end-0 p-3";
            toastContainer.style.zIndex = "1090";
            document.body.appendChild(toastContainer);
        }

        const bgClassMap = {
            info: "text-bg-info text-dark",
            success: "text-bg-success text-white",
            warning: "text-bg-warning text-dark",
            danger: "text-bg-danger text-white"
        };
        const badgeClass = bgClassMap[type] || bgClassMap.info;

        const toastEl = document.createElement("div");
        toastEl.className = `toast align-items-center ${badgeClass} border-0 show mb-2 shadow`;
        toastEl.setAttribute("role", "alert");
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body fw-semibold">${message}</div>
                <button type="button" class="btn-close me-2 m-auto" aria-label="Close"></button>
            </div>
        `;

        toastEl.querySelector(".btn-close").addEventListener("click", () => toastEl.remove());
        toastContainer.appendChild(toastEl);

        setTimeout(() => {
            if (toastEl.parentElement) toastEl.remove();
        }, 4000);
    };

    const saveAndUpdateCart = () => {
        localStorage.setItem("delcast_cart", JSON.stringify(cart));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtns.forEach((btn) => {
            btn.textContent = `Cart (${totalItems})`;
        });
        renderCartModalBody();
    };

    // Inject Shopify-Style Modals Dynamically
    const injectShopifyModals = () => {
        if (!document.getElementById("cartModal")) {
            const cartModalHTML = `
                <div class="modal fade shopify-modal" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl">
                        <div class="modal-content" style="background-color: #ffffff; color: #111827; border-radius: 8px;">
                            <div class="modal-header border-bottom px-4 py-3">
                                <h5 class="modal-title fw-bold fs-3" id="cartModalLabel">Your cart</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body px-4 py-3" id="cart-modal-body"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", cartModalHTML);
        }

        if (!document.getElementById("checkoutModal")) {
            const checkoutModalHTML = `
                <div class="modal fade shopify-modal" id="checkoutModal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl">
                        <div class="modal-content" style="background-color: #ffffff; color: #111827; border-radius: 8px;">
                            <div class="modal-header border-bottom px-4 py-3">
                                <button type="button" class="btn btn-link text-decoration-none text-dark p-0 fw-semibold" id="back-to-cart-btn">&larr; Return to cart</button>
                                <h5 class="modal-title fw-bold fs-4 mx-auto" id="checkoutModalLabel">Secure Checkout</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body px-4 py-4">
                                <form id="shopify-checkout-form">
                                    <div class="row g-4">
                                        <div class="col-lg-7">
                                            <h5 class="fw-bold mb-3">Contact</h5>
                                            <div class="mb-3">
                                                <input type="email" class="form-control" placeholder="Email or mobile phone number" required>
                                            </div>
                                            <div class="form-check mb-4">
                                                <input class="form-check-input" type="checkbox" id="newsCheck" checked>
                                                <label class="form-check-label text-muted small" for="newsCheck">Email me with news and offers</label>
                                            </div>

                                            <h5 class="fw-bold mb-3">Delivery</h5>
                                            <div class="mb-3">
                                                <select class="form-select">
                                                    <option selected>Philippines</option>
                                                </select>
                                            </div>
                                            <div class="row g-2 mb-3">
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="First name" required></div>
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="Last name" required></div>
                                            </div>
                                            <div class="mb-3"><input type="text" class="form-control" placeholder="Address" required></div>
                                            <div class="row g-2 mb-3">
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="Apartment, suite, etc. (optional)"></div>
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="Barangay" required></div>
                                            </div>
                                            <div class="row g-2 mb-3">
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="Postal code" required></div>
                                                <div class="col-md-6"><input type="text" class="form-control" placeholder="City" required></div>
                                            </div>
                                            <div class="mb-3">
                                                <select class="form-select">
                                                    <option selected>Cebu</option>
                                                </select>
                                            </div>
                                            <div class="mb-4"><input type="text" class="form-control" placeholder="Phone" required></div>

                                            <h5 class="fw-bold mb-3">Payment</h5>
                                            <p class="text-muted small mb-3">All transactions are secure and encrypted.</p>
                                            
                                            <div class="border rounded p-3 mb-3 bg-light">
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="radio" name="paymentMethod" id="payPaypal" checked>
                                                    <label class="form-check-label fw-semibold" for="payPaypal">PayPal</label>
                                                </div>
                                                <p class="text-muted small ps-4 mb-0">You'll be redirected to PayPal to complete your purchase.</p>
                                            </div>
                                            <div class="border rounded p-3 mb-2">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="paymentMethod" id="payPaymongo">
                                                    <label class="form-check-label fw-semibold" for="payPaymongo">Secure Payments via PayMongo (MC, VISA, GCash)</label>
                                                </div>
                                            </div>
                                            <div class="border rounded p-3 mb-2">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="paymentMethod" id="payCod">
                                                    <label class="form-check-label fw-semibold" for="payCod">Cash on Delivery (COD)</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-lg-5">
                                            <div class="p-4 bg-light rounded border">
                                                <div id="checkout-summary-items" class="mb-3"></div>
                                                <hr>
                                                <div class="d-flex justify-content-between mb-2 text-muted">
                                                    <span>Subtotal</span>
                                                    <span id="co-subtotal" class="fw-semibold text-dark">₱0.00</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-2 text-muted">
                                                    <span>Shipping</span>
                                                    <span class="fw-semibold text-dark">₱250.00</span>
                                                </div>
                                                <div class="d-flex justify-content-between mb-3 text-muted">
                                                    <span>Estimated taxes (12% VAT)</span>
                                                    <span id="co-tax" class="fw-semibold text-dark">₱0.00</span>
                                                </div>
                                                <hr>
                                                <div class="d-flex justify-content-between align-items-center mb-4">
                                                    <span class="fs-5 fw-bold text-dark">Total</span>
                                                    <span class="fs-4 fw-bold text-dark" id="co-total">PHP ₱0.00</span>
                                                </div>
                                                <button type="submit" class="btn text-white w-100 py-3 fw-bold" style="background-color: #0f172a;">Pay now</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", checkoutModalHTML);
        }

        document.getElementById("back-to-cart-btn").addEventListener("click", () => {
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
            checkoutModal.hide();
            const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
            cartModal.show();
        });

        document.getElementById("shopify-checkout-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
            checkoutModal.hide();

            cart = [];
            saveAndUpdateCart();
            showToast("Order placed successfully! Thank you for shopping at DELCAST TECH.", "success");
        });
    };

    
    const renderCartModalBody = () => {
        const bodyEl = document.getElementById("cart-modal-body");
        if (!bodyEl) return;

        if (cart.length === 0) {
            bodyEl.innerHTML = `
                <div class="text-center py-5">
                    <p class="text-muted fs-5 mb-4">Your cart is currently empty.</p>
                    <button type="button" class="btn text-white px-5 py-3 fw-bold" style="background-color: #0f172a;" data-bs-dismiss="modal">START SHOPPING</button>
                </div>
            `;
            return;
        }

        let subtotal = 0;
        const itemsHTML = cart
            .map((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                return `
                    <div class="row align-items-center py-3 border-bottom">
                        <div class="col-md-6">
                            <h6 class="fw-bold mb-1 text-dark">${item.name}</h6>
                            <p class="text-muted mb-0 small">${formatPrice(item.price)}</p>
                            <small class="text-secondary">Spec: Standard Edition</small>
                        </div>
                        <div class="col-md-3">
                            <div class="input-group input-group-sm" style="width: 110px;">
                                <button class="btn btn-outline-secondary qty-btn" data-index="${index}" data-action="decrease">-</button>
                                <input type="text" class="form-control text-center bg-white" value="${item.quantity}" readonly>
                                <button class="btn btn-outline-secondary qty-btn" data-index="${index}" data-action="increase">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-end fw-bold text-dark">
                            ${formatPrice(itemTotal)}
                        </div>
                        <div class="col-md-1 text-end">
                            <button class="btn btn-link text-danger p-0 remove-item-btn" data-index="${index}" title="Remove">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
            })
            .join("");

        const shipping = 250.00;
        const tax = subtotal * 0.12;
        const total = subtotal + shipping + tax;

        bodyEl.innerHTML = `
            <div class="row text-uppercase text-muted small pb-2 border-bottom fw-semibold d-none d-md-flex">
                <div class="col-md-6">Product</div>
                <div class="col-md-3">Quantity</div>
                <div class="col-md-3 text-end">Total</div>
            </div>
            <div>${itemsHTML}</div>
            <div class="mt-4 pt-3 text-end">
                <div class="text-muted small mb-1">Taxes, discounts and shipping calculated at checkout.</div>
                <h4 class="fw-bold mb-3 text-dark">Estimated total <span class="text-primary ms-2">${formatPrice(subtotal)} PHP</span></h4>
                <div class="d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-link text-decoration-none text-dark p-0 fw-semibold" data-bs-dismiss="modal">Continue shopping</button>
                    <button type="button" class="btn text-white px-4 py-2 fw-bold" style="background-color: #0f172a;" id="proceed-checkout-btn">CHECK OUT</button>
                </div>
            </div>
        `;

        bodyEl.querySelectorAll(".qty-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                const action = e.target.dataset.action;
                if (action === "increase") cart[idx].quantity += 1;
                else if (action === "decrease") {
                    cart[idx].quantity -= 1;
                    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
                }
                saveAndUpdateCart();
            });
        });

        bodyEl.querySelectorAll(".remove-item-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.closest("button").dataset.index, 10);
                cart.splice(idx, 1);
                saveAndUpdateCart();
                showToast("Item removed from cart.", "danger");
            });
        });

        document.getElementById("proceed-checkout-btn").addEventListener("click", () => {
            const cartModal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
            cartModal.hide();

            document.getElementById("checkout-summary-items").innerHTML = cart
                .map(i => `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small text-dark"><strong>${i.name}</strong> (x${i.quantity})</span>
                        <span class="small fw-semibold text-dark">${formatPrice(i.price * i.quantity)}</span>
                    </div>
                `).join("");

            document.getElementById("co-subtotal").textContent = formatPrice(subtotal);
            document.getElementById("co-tax").textContent = formatPrice(tax);
            document.getElementById("co-total").textContent = `PHP ${formatPrice(total)}`;

            const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
            checkoutModal.show();
        });
    };

    addCartBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            if (!card) return;

            const nameEl = card.querySelector("h3, .card-title");
            const priceEl = card.querySelector(".price");

            const name = nameEl ? nameEl.textContent.trim() : "DELCAST Laptop";
            const rawPrice = priceEl ? priceEl.textContent.replace(/[₱,]/g, "").trim() : "0";
            const price = parseInt(rawPrice, 10) || 0;

            const existingItem = cart.find((item) => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ name, price, quantity: 1 });

            saveAndUpdateCart();
            showToast(`Added "${name}" to cart!`, "info");
        });
    });

    injectShopifyModals();
    cartBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            renderCartModalBody();
            const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
            cartModal.show();
        });
    });

    const serviceModals = document.querySelectorAll("#serviceModal1, #serviceModal2, #serviceModal3");
    serviceModals.forEach((modal) => {
        const footer = modal.querySelector(".modal-footer");
        const titleEl = modal.querySelector(".modal-title");
        if (footer && titleEl) {
            const serviceName = titleEl.textContent.trim();
            const bookBtn = document.createElement("a");
            bookBtn.href = `index.html?service=${encodeURIComponent(serviceName)}#contact`;
            bookBtn.className = "btn btn-info fw-bold text-dark";
            bookBtn.textContent = "Book This Service";
            footer.prepend(bookBtn);
        }
    });

    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        const inputs = contactForm.querySelectorAll("input");
        const urlParams = new URLSearchParams(window.location.search);
        const bookedService = urlParams.get("service");
        if (bookedService && inputs[2]) {
            inputs[2].value = `Service Booking: ${bookedService}`;
            showToast(`Selected "${bookedService}". Complete the form below to book!`, "info");
        }

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = inputs[0] ? inputs[0].value.trim() : "Customer";
            const subject = inputs[2] ? inputs[2].value.trim() : "Inquiry";
            showToast(`Thank you, ${name}! Your request for "${subject}" has been sent.`, "success");
            contactForm.reset();
        });
    }

    saveAndUpdateCart();
});