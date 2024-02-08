// WordPress base URL
import { API_BASE_URL } from "./config.js";

export async function postCommentForm(formData) {
	const endpoint = `${API_BASE_URL}wp/v2/comments`;

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization:
					"Basic Y29tbWVudDpDSjB6IGQzdk4gY21SdSBiZlFDIHdOcHogVG94eA==",
			},
			body: formData,
		});

		const data = await response.json();

		if (!response.ok) {
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
