import { getPosts } from "/js/api/index.js";
import { postCard } from "../components/buildPostCard.js";

// Grab wrappers
const postsWrapper = document.querySelector("#posts");
const mainLoader = document.querySelector("#main-loader");
const postsLoader = document.querySelectorAll(".posts-loader");
const loadMoreBtn = document.querySelector("#btn-load-more");
const categories = document.querySelectorAll(".category");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector(".filter-search button");

let activeCategory = null;

// Handle category filtering
categories.forEach((catElement) => {
	catElement.addEventListener("click", function () {
		// Reset currentPage to 1
		currentPage = 1;
		// Clear search input
		searchInput.value = "";
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

// Handle search
function performSearch() {
	const searchTerm = searchInput.value.trim();

	if (searchTerm) {
		// Clear posts wrapper
		postsWrapper.innerHTML = "";
		// Hide load more button
		loadMoreBtn.classList.add("display--none");
		// Show loaders
		postsLoader.forEach((loader) => loader.classList.remove("display--none"));
		// Remove active class from all categories
		categories.forEach((cat) => cat.classList.remove("active"));
		// Get posts from server
		loadPosts("", searchTerm);
	}
}

// Add event listener to search button
searchBtn.addEventListener("click", performSearch);
// Add event listener to search input
searchInput.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		performSearch();
	}
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
async function loadPosts(categoryParams = "", searchTerm = "") {
	const searchParam = searchTerm
		? `&search=${encodeURIComponent(searchTerm)}`
		: "";
	try {
		let posts = await getPosts(
			`per_page=${postsPerPage}&page=${currentPage}&${categoryParams}${searchParam}`
		);
		// Handle no posts
		if (posts.length === 0) {
			// Hide loaders and change header text
			postsLoader.forEach((loader) => loader.classList.add("display--none"));
			const h2 = document.querySelector("h2");
			h2.textContent = "No posts found";
			// Build no posts message
			const noPostsWrapper = document.createElement("div");
			noPostsWrapper.classList.add("content-grid");

			const noPostsMessage = document.createElement("p");
			noPostsMessage.classList.add("text-center", "big-font");
			noPostsMessage.textContent = "🧐";
			noPostsWrapper.appendChild(noPostsMessage);

			const noPostsText = document.createElement("p");
			noPostsText.classList.add("text-center", "text-no-max-width");
			noPostsText.textContent =
				"The alien server-keeper has looked all throughout the database, but has come up empty-handed. No posts found.";
			noPostsWrapper.appendChild(noPostsText);

			postsWrapper.appendChild(noPostsWrapper);
		} else {
			// Render posts
			renderPosts(posts);
			// Hide loaders
			postsLoader.forEach((loader) => loader.classList.add("display--none"));
		}
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
