// WordPress base URL
import { API_BASE_URL } from "./config.js";

export async function postContactForm(formId, formData) {
	const endpoint = `${API_BASE_URL}contact-form-7/v1/contact-forms/${formId}/feedback`;

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (!response.ok || data.status !== "mail_sent") {
			// Handle API-level error or unsuccessful form submission
			console.error("Form submission error:", data.message);
			throw new Error(
				data.message || "An error occurred during form submission."
			);
		}

		console.log("Form submitted successfully! 🎉");
		return data;
	} catch (error) {
		console.error("Error submitting form:", error);
		throw error; // Rethrow to be handled by the caller
	}
}
