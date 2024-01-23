import { getPosts } from "/js/api/index.js";
import { getFeatureImg } from "/js/api/index.js";

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

// Build blog post card HTML
async function postCard(post) {
	// Create card wrapper
	const card = document.createElement("a");
	card.classList.add("post-card");
	card.href = `/post.html?id=${post.id}`;

	// Create card header image
	const headerImg = document.createElement("img");
	headerImg.classList.add("post-img");
	try {
		const imgData = await getFeatureImg(post.featured_media);
		console.log(imgData.guid.rendered);
		headerImg.src = imgData.guid.rendered;
	} catch (error) {
		console.error(`Error fetching feature image: ${error}`);
		headerImg.src = ""; // Fallback image or style
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

// Render the blog page
export default function blog() {
	loadPosts();
}
