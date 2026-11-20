/* =====================================================================
	 Lechon De Jay | script.js
	 Sections: 1 Form validation · 2 Menu category filter · 3 Cart
	 ===================================================================== */

/* ===== 1. Form validation ===== */
document.addEventListener("DOMContentLoaded", () => {
	const validationPages = ["register", "login", "contact", "reserve", "event", "cart", "profile"];
	const page = document.body ? document.body.dataset.page : "";

	if (!validationPages.includes(page)) return;

	const forms = document.querySelectorAll("form.form-box");
	if (forms.length === 0) return;

	let fieldId = 0;
	const errorElements = new WeakMap();

	function getErrorElement(control) {
		let error = errorElements.get(control);
		if (error) return error;

		if (!control.id) {
			fieldId += 1;
			control.id = `form-field-${fieldId}`;
		}

		error = document.createElement("span");
		error.id = `${control.id}-error`;
		error.className = "field-error";
		error.setAttribute("aria-live", "polite");
		error.setAttribute("aria-atomic", "true");

		const label = control.closest("label");
		const isChoice = control.type === "checkbox" || control.type === "radio";
		if (label && isChoice) {
			label.insertAdjacentElement("afterend", error);
		} else {
			control.insertAdjacentElement("afterend", error);
		}

		const describedBy = (control.getAttribute("aria-describedby") || "")
			.split(/\s+/)
			.filter(Boolean);
		if (!describedBy.includes(error.id)) describedBy.push(error.id);
		control.setAttribute("aria-describedby", describedBy.join(" "));
		errorElements.set(control, error);
		return error;
	}

	function clearError(control) {
		const error = errorElements.get(control);
		if (error) error.textContent = "";
		control.classList.remove("invalid");
		control.removeAttribute("aria-invalid");
	}

	function getErrorMessage(control, form) {
		const value = control.type === "checkbox" ? control.checked : control.value.trim();
		const name = control.name;

		if (control.required && (control.type === "checkbox" ? !value : value === "")) {
			return "This field is required.";
		}

		if (name === "email" && value && control.validity.typeMismatch) {
			return "Enter a valid email address.";
		}

		if (name === "mobile" && value && !/^(09\d{9}|\+639\d{9})$/.test(value)) {
			return "Enter a PH mobile number: 09XXXXXXXXX or +639XXXXXXXXX.";
		}

		if (name === "password" && value && value.length < 8) {
			return "Password must be at least 8 characters.";
		}

		if (name === "confirm") {
			const password = form.elements.namedItem("password");
			if (password && control.value !== password.value) return "Passwords do not match.";
		}

		if (name === "date" && value) {
			const today = new Date();
			const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
			if (value < localToday) return "Choose today or a future date.";
		}

		if (name === "guests" && value && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
			return "Enter a positive number of guests.";
		}

		if (control.validity.rangeUnderflow || control.validity.rangeOverflow) {
			return "Choose a value within the allowed range.";
		}

		if (control.validity.typeMismatch || control.validity.badInput) {
			return "Enter a valid value.";
		}

		return "";
	}

	function validateField(control, form) {
		const message = getErrorMessage(control, form);
		const error = errorElements.get(control);

		if (message) {
			const fieldError = getErrorElement(control);
			fieldError.textContent = message;
			control.classList.add("invalid");
			control.setAttribute("aria-invalid", "true");
			return false;
		}

		clearError(control);
		if (error) error.textContent = "";
		return true;
	}

	function showSuccessToast(message) {
		let host = document.getElementById("toastHost");
		if (!host) {
			host = document.createElement("div");
			host.id = "toastHost";
			host.setAttribute("role", "status");
			host.setAttribute("aria-live", "polite");
			host.setAttribute("aria-atomic", "false");
			document.body.append(host);
		}

		const toast = document.createElement("div");
		toast.className = "toast";
		toast.textContent = message;
		host.append(toast);
		window.setTimeout(() => toast.remove(), 4000);
	}

	forms.forEach((form) => {
		const controls = Array.from(form.querySelectorAll("input, select, textarea"))
			.filter((control) => !control.disabled && control.type !== "submit" && control.type !== "button");

		if (controls.length === 0) return;
		form.noValidate = true;

		form.addEventListener("focusout", (event) => {
			const control = event.target;
			if (!controls.includes(control)) return;

			validateField(control, form);
			if (control.name === "password") {
				const confirmation = form.elements.namedItem("confirm");
				if (confirmation && confirmation !== control) validateField(confirmation, form);
			}
		});

		form.addEventListener("submit", (event) => {
			event.preventDefault();
			let firstInvalid = null;

			controls.forEach((control) => {
				if (!validateField(control, form) && !firstInvalid) firstInvalid = control;
			});

			if (firstInvalid) {
				firstInvalid.focus();
				return;
			}

			if (page !== "cart") {
				form.reset();
				controls.forEach(clearError);
				showSuccessToast("Your form was submitted successfully.");
			}
		});
	});
});

/* ===== 2. Menu category filter ===== */
document.addEventListener("DOMContentLoaded", () => {
	const page = document.body ? document.body.dataset.page : "";
	if (page !== "menu") return;

	const filterButtons = Array.from(document.querySelectorAll(".menu-filter [data-category]"));
	const searchInput = document.getElementById("menu-search");
	const status = document.getElementById("menu-filter-status");
	const sections = Array.from(document.querySelectorAll("main section[aria-labelledby]"));

	if (filterButtons.length === 0 || sections.length === 0) return;

	let activeCategory = "All";

	function applyFilter() {
		const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
		let visibleCount = 0;

		sections.forEach((section) => {
			const heading = section.querySelector(".section-title");
			if (!heading) return;

			const categoryMatch = activeCategory === "All" || heading.textContent.trim() === activeCategory;
			const cards = Array.from(section.querySelectorAll(".menu-card"));
			let sectionVisibleCount = 0;

			cards.forEach((card) => {
				const name = card.querySelector(".name");
				const nameMatch = !query || (name && name.textContent.toLowerCase().includes(query));
				const visible = categoryMatch && nameMatch;
				card.hidden = !visible;
				if (visible) sectionVisibleCount += 1;
			});

			section.hidden = sectionVisibleCount === 0;
			visibleCount += sectionVisibleCount;
		});

		if (status) {
			if (visibleCount === 0) {
				status.textContent = "No menu items match this filter.";
			} else {
				status.textContent = `${visibleCount} menu item${visibleCount === 1 ? "" : "s"} shown.`;
			}
		}
	}

	function selectCategory(category) {
		activeCategory = category;
		filterButtons.forEach((button) => {
			const selected = button.dataset.category === category;
			button.setAttribute("aria-pressed", String(selected));
		});
		applyFilter();
	}

	filterButtons.forEach((button) => {
		button.addEventListener("click", () => selectCategory(button.dataset.category || "All"));
	});

	if (searchInput) {
		searchInput.addEventListener("input", applyFilter);
	}

	const urlCategory = new URLSearchParams(window.location.search).get("cat");
	const validCategory = filterButtons.some((button) => button.dataset.category === urlCategory)
		? urlCategory
		: "All";

	selectCategory(validCategory);
});

/* ===== 3. Working cart ===== */
document.addEventListener("DOMContentLoaded", () => {
	const storageKey = "lechonDeJayCart";

	function readCart() {
		try {
			const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
			return Array.isArray(stored) ? stored : [];
		} catch (error) {
			return [];
		}
	}

	function saveCart(cart) {
		try {
			localStorage.setItem(storageKey, JSON.stringify(cart));
			return true;
		} catch (error) {
			return false;
		}
	}

	function clearCart() {
		try {
			localStorage.removeItem(storageKey);
		} catch (error) {
			// Storage may be unavailable; the cart will remain empty for this session.
		}
	}

	function formatPesos(amount) {
		return `₱${Number(amount).toLocaleString("en-PH")}`;
	}

	function cartCount(cart) {
		return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
	}

	function updateCartBadge() {
		const cart = readCart();
		const count = cartCount(cart);
		document.querySelectorAll(".site-nav a").forEach((link) => {
			if (!/^cart\.html$/i.test(link.getAttribute("href") || "")) return;
			const existing = link.querySelector(".cart-count");
			if (existing) existing.remove();
			if (count > 0) {
				const badge = document.createElement("span");
				badge.className = "cart-count";
				badge.setAttribute("aria-label", `${count} item${count === 1 ? "" : "s"} in cart`);
				badge.textContent = String(count);
				link.append(badge);
			}
		});
	}

	function showToast(message, isError) {
		let host = document.getElementById("toastHost");
		if (!host) {
			host = document.createElement("div");
			host.id = "toastHost";
			host.setAttribute("role", "status");
			host.setAttribute("aria-live", "polite");
			host.setAttribute("aria-atomic", "false");
			document.body.append(host);
		}
		const toast = document.createElement("div");
		toast.className = `toast${isError ? " error" : ""}`;
		toast.textContent = message;
		host.append(toast);
		window.setTimeout(() => toast.remove(), 4000);
	}

	updateCartBadge();

	document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
		button.addEventListener("click", () => {
			const card = button.closest(".menu-card");
			if (!card) return;
			const name = card.querySelector(".name");
			const price = card.querySelector(".price");
			if (!name || !price) return;

			const itemName = name.textContent.trim();
			const itemPrice = Number(price.textContent.replace(/[^\d.]/g, ""));
			if (!itemName || !Number.isFinite(itemPrice) || itemPrice <= 0) return;

			const cart = readCart();
			const existing = cart.find((item) => item.name === itemName);
			if (existing) {
				existing.quantity = (Number(existing.quantity) || 0) + 1;
			} else {
				cart.push({ name: itemName, price: itemPrice, quantity: 1 });
			}

			if (saveCart(cart)) {
				updateCartBadge();
				showToast(`${itemName} added to cart.`);
			} else {
				showToast("Could not save the cart. Please enable browser storage.", true);
			}
		});
	});

	const page = document.body ? document.body.dataset.page : "";
	if (page !== "cart") return;

	const cartContents = document.getElementById("cart-contents");
	const checkoutForm = document.querySelector("form.form-box");
	const checkoutTotal = document.getElementById("checkout-total");

	function renderCart() {
		if (!cartContents) return;
		const cart = readCart();
		cartContents.replaceChildren();
		let total = 0;

		if (cart.length === 0) {
			const empty = document.createElement("p");
			empty.className = "empty";
			empty.textContent = "Your cart is empty.";
			const menuLink = document.createElement("a");
			menuLink.className = "btn btn-outline";
			menuLink.href = "menu.html";
			menuLink.textContent = "Browse the menu";
			cartContents.append(empty, menuLink);
			if (checkoutTotal) checkoutTotal.textContent = formatPesos(0);
			if (checkoutForm) checkoutForm.hidden = true;
			updateCartBadge();
			return;
		}

		const wrap = document.createElement("div");
		wrap.className = "table-wrap";
		const table = document.createElement("table");
		table.className = "data";

		const thead = document.createElement("thead");
		const headerRow = document.createElement("tr");
		["Item", "Quantity", "Price", "Subtotal", ""].forEach((text) => {
			const th = document.createElement("th");
			th.textContent = text;
			headerRow.append(th);
		});
		thead.append(headerRow);
		table.append(thead);

		const tbody = document.createElement("tbody");
		cart.forEach((item, index) => {
			const quantity = Math.max(1, Number(item.quantity) || 1);
			const price = Number(item.price) || 0;
			const subtotal = quantity * price;
			total += subtotal;
			const row = document.createElement("tr");

			const nameCell = document.createElement("td");
			nameCell.textContent = item.name;
			const quantityCell = document.createElement("td");
			quantityCell.className = "cart-quantity";

			const minus = document.createElement("button");
			minus.type = "button";
			minus.className = "btn btn-outline btn-sm";
			minus.textContent = "−";
			minus.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
			minus.addEventListener("click", () => changeQuantity(index, -1));

			const quantityText = document.createElement("span");
			quantityText.className = "cart-quantity-value";
			quantityText.textContent = String(quantity);

			const plus = document.createElement("button");
			plus.type = "button";
			plus.className = "btn btn-outline btn-sm";
			plus.textContent = "+";
			plus.setAttribute("aria-label", `Increase quantity of ${item.name}`);
			plus.addEventListener("click", () => changeQuantity(index, 1));

			quantityCell.append(minus, quantityText, plus);

			const priceCell = document.createElement("td");
			priceCell.textContent = formatPesos(price);
			const subtotalCell = document.createElement("td");
			subtotalCell.textContent = formatPesos(subtotal);
			const removeCell = document.createElement("td");
			const remove = document.createElement("button");
			remove.type = "button";
			remove.className = "btn btn-outline btn-sm";
			remove.textContent = "Remove";
			remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
			remove.addEventListener("click", () => removeItem(index));
			removeCell.append(remove);

			row.append(nameCell, quantityCell, priceCell, subtotalCell, removeCell);
			tbody.append(row);
		});
		table.append(tbody);

		const tfoot = document.createElement("tfoot");
		const totalRow = document.createElement("tr");
		const totalLabel = document.createElement("th");
		totalLabel.colSpan = 3;
		totalLabel.textContent = "Total";
		const totalValue = document.createElement("th");
		totalValue.textContent = formatPesos(total);
		totalRow.append(totalLabel, totalValue);
		tfoot.append(totalRow);
		table.append(tfoot);
		wrap.append(table);
		cartContents.append(wrap);

		if (checkoutForm) checkoutForm.hidden = false;
		if (checkoutTotal) checkoutTotal.textContent = formatPesos(total);
		updateCartBadge();
	}

	function changeQuantity(index, delta) {
		const cart = readCart();
		if (!cart[index]) return;
		cart[index].quantity = (Number(cart[index].quantity) || 1) + delta;
		if (cart[index].quantity <= 0) cart.splice(index, 1);
		saveCart(cart);
		renderCart();
	}

	function removeItem(index) {
		const cart = readCart();
		cart.splice(index, 1);
		saveCart(cart);
		renderCart();
	}

	function showConfirmationModal(cart, total) {
		const overlay = document.createElement("div");
		overlay.className = "modal-overlay";
		overlay.setAttribute("role", "presentation");
		const modal = document.createElement("div");
		modal.className = "modal";
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-modal", "true");
		modal.setAttribute("aria-labelledby", "order-confirmation-title");

		const title = document.createElement("h2");
		title.id = "order-confirmation-title";
		title.textContent = "Order confirmed";
		const summary = document.createElement("div");
		summary.className = "receipt";

		const table = document.createElement("table");
		cart.forEach((item) => {
			const row = document.createElement("tr");
			const itemCell = document.createElement("td");
			itemCell.textContent = `${item.name} × ${item.quantity}`;
			const priceCell = document.createElement("td");
			priceCell.textContent = formatPesos(item.price * item.quantity);
			row.append(itemCell, priceCell);
			table.append(row);
		});
		summary.append(table);

		const amount = document.createElement("p");
		amount.className = "amount";
		amount.textContent = formatPesos(total);
		const actions = document.createElement("div");
		actions.className = "modal-actions";
		const close = document.createElement("button");
		close.type = "button";
		close.className = "btn btn-primary";
		close.textContent = "Done";
		close.addEventListener("click", () => overlay.remove());
		actions.append(close);
		modal.append(title, summary, amount, actions);
		overlay.append(modal);
		document.body.append(overlay);
		close.focus();
	}

	renderCart();

	if (checkoutForm) {
		checkoutForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const cart = readCart();
			if (cart.length === 0) {
				showToast("Your cart is empty.", true);
				return;
			}

			const invalid = checkoutForm.querySelector(".invalid");
			if (invalid) {
				invalid.focus();
				return;
			}

			const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
			showConfirmationModal(cart, total);
			clearCart();
			if (checkoutForm) checkoutForm.reset();
			renderCart();
		});
	}
});
