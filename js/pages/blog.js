import { getPosts } from "/js/api/index.js";
import { postCard } from "../components/buildPostCard.js";

// Grab wrappers
const postsWrapper = document.querySelector("#posts");
const featuredWrapper = document.querySelector("#featured");

// Add event listener to load more button
document.getElementById("btn-load-more").addEventListener("click", loadPosts);

// Page tracking
let currentPage = 1;
const postsPerPage = 9;

///////////////////////////////////////////////////////////////
// Get all blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts(`per_page=${postsPerPage}&page=${currentPage}`);
		renderPosts(posts);
		// Remove load more button if there are no more posts to load
		posts.length < postsPerPage
			? document.getElementById("btn-load-more").remove()
			: null;
		currentPage++;
	} catch (error) {
		console.log("Error fetching posts:", error);
	}
}

// Render posts to the DOM
async function renderPosts(posts) {
	for (const post of posts) {
		try {
			const card = await postCard(post);
			postsWrapper.appendChild(card);
		} catch (error) {
			console.error("Error creating post card:", error);
		}
	}
}

///////////////////////////////////////////////////////////////
// Render the blog page
export default function blog() {
	loadPosts();
}
