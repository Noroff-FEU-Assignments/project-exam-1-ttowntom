// WordPress base URL
const baseUrl = "https://wp.ttowntom.com/wp-json/wp/v2";

// Get all blog posts
export async function getPosts() {
	try {
		const response = await fetch(`${baseUrl}/posts`);
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
		const response = await fetch(`${baseUrl}/posts/${id}`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const post = await response.json();
		return post;
	} catch (error) {
		console.log(`Error fetching post with ID ${postId}:`, error);
	}
}
