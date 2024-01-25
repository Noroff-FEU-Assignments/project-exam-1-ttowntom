// WordPress base URL
import { API_BASE_URL } from "./config.js";

export async function getFeatureImg(id) {
	try {
		const response = await fetch(`${API_BASE_URL}/media/${id}`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const media = await response.json();
		return media;
	} catch (error) {
		console.log(`Error fetching media with ID ${id}:`, error);
	}
}
