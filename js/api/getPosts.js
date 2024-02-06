// WordPress base URL
import { API_BASE_URL } from "./config.js";

// Get all blog posts
export async function getPosts(params) {
	try {
		const response = await fetch(`${API_BASE_URL}wp/v2/posts?_embed&${params}`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const posts = await response.json();
		return posts;
	} catch (error) {
		console.log("Error fetching posts:", error);
	}
}

// Get a single blog post
export async function getPost(id) {
	try {
		const response = await fetch(`${API_BASE_URL}wp/v2/posts/${id}?_embed`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const post = await response.json();
		return post;
	} catch (error) {
		console.log(`Error fetching post with ID ${postId}:`, error);
	}
}
