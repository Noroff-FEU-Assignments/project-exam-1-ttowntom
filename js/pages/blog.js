import { getPosts } from "/js/api/index.js";

// Grab the blog posts wrapper
const postsWrapper = document.querySelector("#posts");

// Get all blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts();
		renderPosts(posts);
	} catch (error) {
		console.log("Error fetching posts:", error);
	}
}

// Render posts to the DOM
function renderPosts(posts) {
	posts.forEach((post) => {
		postsWrapper.appendChild(postCard(post));
	});
}

// Build blog post card HTML
function postCard(post) {
	// Create card wrapper
	const card = document.createElement("a");
	card.classList.add("post-card");
	card.href = `/post.html?id=${post.id}`;

	// Create card header image
	const headerImg = document.createElement("div");
	headerImg.classList.add("post-img");

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

// Render the blog page
export default function blog() {
	loadPosts();
}
