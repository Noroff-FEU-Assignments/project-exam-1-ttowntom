import { postContactForm } from "/js/api/index.js";

function formValidation() {
	// Get the form and input fields
	const form = document.querySelector("#contact-form");
	const nameInput = form.querySelector("#name");
	const emailInput = form.querySelector("#email");
	const subjectInput = form.querySelector("#subject");
	const messageInput = form.querySelector("#message");
	const submitButton = form.querySelector("#form-send");
	const loader = document.querySelectorAll(".loader-display");

	// Show loader and hide form function
	function showLoaderHideForm() {
		form.style.display = "none";
		loader.forEach((loader) => loader.classList.remove("display--none"));
	}

	// Hide loader and show form function
	function hideLoaderShowForm() {
		form.style.display = "grid";
		loader.forEach((loader) => loader.classList.add("display--none"));
	}

	// Function to validate input
	function validateInput(input) {
		const validity = input.validity;
		const minLength = input.dataset.minLength; // Using data attributes in HTML for custom minimum lengths

		if (validity.valueMissing) {
			return "Please fill out this field.";
		} else if (validity.typeMismatch && input.type === "email") {
			return "Please enter a valid email address.";
		} else if (input.value.length < minLength) {
			return `Please lengthen this text to ${minLength} characters or more.`;
		}
		return "";
	}

	// Function to display error
	function displayError(input, message) {
		const errorField = input.nextElementSibling;
		errorField.textContent = message;
		errorField.classList.remove("display--none");
		submitButton.classList.add("btn-error");
	}

	// Function to clear error
	function clearError(input) {
		const errorField = input.nextElementSibling;
		errorField.textContent = "";
		errorField.classList.add("display--none");
		submitButton.classList.remove("btn-error");
	}

	// Event listener for form submission
	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		let isFormValid = true;

		[nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
			const error = validateInput(input);
			if (error) {
				displayError(input, error);
				isFormValid = false;
			} else {
				clearError(input);
			}
		});

		if (isFormValid) {
			showLoaderHideForm();
			const formData = new FormData(form);
			const formId = 162;

			postContactForm(formId, formData)
				.then((data) => {
					// Handle success
					window.location.href = "/success/";
				})
				.catch((error) => {
					// Handle failure
					console.error("Error submitting form:", error);

					// Error is expected as I host the WP myself and have not setup email sending, thus a faky-fake success is in order 😜
					window.location.href = "/success/";

					// Under normal conditions, the form would be shown again with an error message
					// hideLoaderShowForm();
				});
		}
	});

	// Event listeners for input blur events
	[nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
		input.addEventListener("blur", function () {
			const error = validateInput(this);
			if (error) {
				displayError(this, error);
			} else {
				clearError(this);
			}
		});
	});
}

export default function contact() {
	formValidation();
}
