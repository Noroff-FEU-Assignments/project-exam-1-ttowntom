import { getPosts } from "/js/api/index.js";

export default function blog() {
	// Code for setting up the homepage
	console.log("Blog page loaded");

	// Get all blog posts
	async function loadPosts() {
		try {
			let posts = await getPosts();
			let blogPosts = [...posts];
			console.log(blogPosts);
		} catch (error) {
			console.log("Error fetching posts:", error);
		}
	}

	loadPosts();
}
