import { getPosts } from "/js/api/index.js";
import { postCard } from "../components/buildPostCard.js";

// Grab wrappers
const postsWrapper = document.querySelector("#posts");
const featuredWrapper = document.querySelector("#featured");
const mainLoader = document.querySelector("#main-loader");
const postsLoader = document.querySelectorAll(".posts-loader");
const loadMoreBtn = document.querySelector("#btn-load-more");
const categories = document.querySelectorAll(".category");

let activeCategory = null;

// Handle category filtering
categories.forEach((catElement) => {
	catElement.addEventListener("click", function () {
		// Reset currentPage to 1
		currentPage = 1;
		// Clear posts wrapper
		postsWrapper.innerHTML = "";
		// Hide load more button
		loadMoreBtn.classList.add("display--none");
		// Show loaders
		postsLoader.forEach((loader) => loader.classList.remove("display--none"));
		// Remove active class from all categories
		categories.forEach((cat) => cat.classList.remove("active"));
		// Add active class to clicked category
		this.classList.add("active");
		activeCategory = this.dataset.category;
		// Get category name or an empty string for "all"
		const categoryParam =
			this.dataset.category === "all"
				? ""
				: `categories=${this.dataset.category}`;

		// Get posts from server
		loadPosts(categoryParam);
	});
});

// Add event listener to load more button
loadMoreBtn.addEventListener("click", function () {
	currentPage++;
	loadPosts();
	this.classList.add("display--none");
	postsLoader.forEach((loader) => loader.classList.remove("display--none"));
	categories.forEach((cat) => {
		if (cat.dataset.category === activeCategory) {
			cat.classList.add("active");
		}
	});
});

// Page tracking
let currentPage = 1;
const postsPerPage = 9;

///////////////////////////////////////////////////////////////
// Get blog posts from server
async function loadPosts(categoryParams = "") {
	try {
		let posts = await getPosts(
			`per_page=${postsPerPage}&page=${currentPage}&${categoryParams}`
		);
		renderPosts(posts);
		// Hide loaders
		postsLoader.forEach((loader) => loader.classList.add("display--none"));
	} catch (error) {
		console.error("Error fetching posts:", error);
	}
}

// Hide or show load more button based on the number of posts returned
function toggleLoadMoreButton(posts) {
	// If there's a possibility that there are more posts to load
	if (posts.length === postsPerPage) {
		loadMoreBtn.classList.remove("display--none");
	} else {
		loadMoreBtn.classList.add("display--none");
	}
}

// Render posts to the DOM
async function renderPosts(posts) {
	for (const post of posts) {
		try {
			const card = await postCard(post);
			mainLoader.remove();
			postsWrapper.appendChild(card);
			toggleLoadMoreButton(posts);
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
