/* =====================================================================
	 Lechon De Jay | script.js
	 Sections: 1 Form validation
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

			form.reset();
			controls.forEach(clearError);
			showSuccessToast("Your form was submitted successfully.");
		});
	});
});
