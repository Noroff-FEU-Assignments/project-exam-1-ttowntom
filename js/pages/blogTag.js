import { getPosts } from "/js/api/getPosts.js";
import { postCard } from "../components/buildPostCard.js";

///////////////////////////////////////////////////////////////
// Grab meta tags
const postOgUrl = document.querySelector('meta[property="og:url"]');

// Set meta tags
function setMetaTags() {
	postOgUrl.setAttribute("content", window.location.href);
}

///////////////////////////////////////////////////////////////
// Grab wrappers
const heroTitle = document.querySelector(".hero h1 span");
const tagTitle = document.querySelector("#tag-name");
const postsWrapper = document.querySelector("#posts");
const mainLoader = document.querySelector("#main-loader");
const postsLoader = document.querySelectorAll(".posts-loader");
const loadMoreBtn = document.querySelector("#btn-load-more");

// Get url parameters
const urlParams = new URLSearchParams(window.location.search);
const tag = urlParams.get("post_tag");
const tagName = urlParams.get("name");

// Page tracking
let currentPage = 1;
const postsPerPage = 9;

///////////////////////////////////////////////////////////////
// Set hero
heroTitle.textContent = `${tagName}`;
tagTitle.textContent = `${tagName}`;

///////////////////////////////////////////////////////////////
// Get blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts(
			`per_page=${postsPerPage}&page=${currentPage}&tags=${tag}`
		);
		renderPosts(posts);
		// Hide loaders
		postsLoader.forEach((loader) => loader.classList.add("display--none"));
		setMetaTags();
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

export default function blogTag() {
	loadPosts();
}
