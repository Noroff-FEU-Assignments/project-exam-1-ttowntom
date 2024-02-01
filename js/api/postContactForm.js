// WordPress base URL
import { API_BASE_URL } from "./config.js";

export async function postContactForm(formId, formData) {
	const endpoint = `${API_BASE_URL}contact-form-7/v1/contact-forms/${formId}/feedback`;

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (data.status === "mail_sent") {
			console.log("Form submitted successfully!");
			// Redirect to success page
			window.location.href = "success/";
		} else {
			console.error("Form submission error:", data.message);
			console.log(
				"This is expected, as I'm hosting WP myself and have not set up the mail server, thus: you are redirected to the success page anyways! 🎉"
			);
			// Redirect to success page even though the form submission failed, cause I'm hosting WP myself and have not set up the mail server
			window.location.href = "success/";
		}

		return data;
	} catch (error) {
		console.error("Error submitting form:", error);
		throw error;
	}
}
