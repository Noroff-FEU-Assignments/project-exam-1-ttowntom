import { getPosts } from "/js/api/index.js";

// Grab wrappers
const carouselWrapper = document.querySelector(".carousel-track");

///////////////////////////////////////////////////////////////
// Get all blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts(`per_page=${totalSlides}`);
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
			carouselWrapper.appendChild(card);
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
	card.href = `/blog/post/?id=${post.id}`;

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
// Posts carousel
let currentSlide = 0;
const slidesToShow = 4;
const carouselTrack = document.querySelector(".carousel-track");
const totalSlides = 8;

// Load initial posts and create carousel items
// postCard(initialPosts);

document.querySelector(".next").addEventListener("click", () => {
	// Calculate the width of a single slide
	const slideWidth = carouselTrack.clientWidth / slidesToShow;

	// Move to the next set of posts
	currentSlide = Math.min(currentSlide + 1, totalSlides / slidesToShow - 1);
	carouselTrack.style.transform = `translateX(-${
		currentSlide * slideWidth * slidesToShow
	}px)`;
});

document.querySelector(".prev").addEventListener("click", () => {
	// Calculate the width of a single slide
	const slideWidth = carouselTrack.clientWidth / slidesToShow;

	// Move to the previous set of posts
	currentSlide = Math.max(currentSlide - 1, 0);
	carouselTrack.style.transform = `translateX(-${
		currentSlide * slideWidth * slidesToShow
	}px)`;
});

export default function home() {
	loadPosts();
}
