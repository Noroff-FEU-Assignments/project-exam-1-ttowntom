import { getPosts } from "/js/api/index.js";
import { postCard } from "../components/buildPostCard.js";

// Grab wrappers
const postsWrapper = document.querySelector("#posts");
const featuredWrapper = document.querySelector("#featured");
const mainLoader = document.querySelector("#main-loader");
const postsLoader = document.querySelectorAll(".posts-loader");
const loadMoreBtn = document.querySelector("#btn-load-more");

// Add event listener to load more button
loadMoreBtn.addEventListener("click", function () {
	loadPosts();
	this.classList.add("display--none");
	postsLoader.forEach((loader) => loader.classList.remove("display--none"));
});

// Page tracking
let currentPage = 1;
const postsPerPage = 9;

///////////////////////////////////////////////////////////////
// Get all blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts(`per_page=${postsPerPage}&page=${currentPage}`);
		renderPosts(posts);
		// Hide loaders
		postsLoader.forEach((loader) => loader.classList.add("display--none"));
		// Remove load more button if there are no more posts to load
		posts.length < postsPerPage
			? loadMoreBtn.remove()
			: loadMoreBtn.classList.remove("display--none");
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
			mainLoader.remove();
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
