import { getPosts } from "/js/api/index.js";

// Grab wrappers
const postsWrapper = document.querySelector("#posts");
const featuredWrapper = document.querySelector("#featured");

// Add event listener to load more button
document.getElementById("btn-load-more").addEventListener("click", loadPosts);

// Page tracking
let currentPage = 1;
const postsPerPage = 9;

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
// Build blog post card HTML
async function postCard(post) {
	// Create card wrapper
	const card = document.createElement("a");
	card.classList.add("post-card");
	card.href = `post/?id=${post.id}`;

	// Create card header image
	const headerImg = document.createElement("img");
	headerImg.classList.add("post-card-img");
	if (
		post._embedded &&
		post._embedded["wp:featuredmedia"] &&
		post._embedded["wp:featuredmedia"][0]
	) {
		headerImg.src = post._embedded["wp:featuredmedia"][0].source_url;
		headerImg.alt = post._embedded["wp:featuredmedia"][0].caption.rendered;
	} else {
		// Set a default image source or handle the absence of an image
		headerImg.src = "/img/codeJourneyLogoDarkBlue.png";
		headerImg.alt = "Code Journey Logo - No featured image available";
	}

	// Create card text wrapper
	const text = document.createElement("div");
	text.classList.add("post-text");

	// Create card title
	const title = document.createElement("h3");
	title.classList.add("post-title");
	title.textContent = post.title.rendered;

	// Create card date
	const date = document.createElement("p");
	date.classList.add("post-date");
	date.textContent = new Date(post.date).toLocaleDateString("nb-NO");

	// Create card excerpt
	const excerpt = document.createElement("p");
	excerpt.classList.add("post-excerpt");
	excerpt.innerHTML = post.excerpt.rendered;

	// Append elements to text wrapper
	text.appendChild(title);
	text.appendChild(date);
	text.appendChild(excerpt);

	// Append elements to card
	card.appendChild(headerImg);
	card.appendChild(text);

	// Return card
	return card;
}

///////////////////////////////////////////////////////////////
// Render the blog page
export default function blog() {
	loadPosts();
}
