import { getPosts } from "/js/api/index.js";
import { postCard } from "../components/buildPostCard.js";

// Grab wrappers
const carouselWrapper = document.querySelector(".carousel-track");
const loader = document.querySelector(".loader-wrapper");
const carouselBtns = document.querySelectorAll(".carousel-button");

///////////////////////////////////////////////////////////////
// Get all blog posts from server
async function loadPosts() {
	try {
		let posts = await getPosts(`per_page=${4 * 3}`);
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
			loader.remove();
			updateCarouselItemsWidth();
			carouselWrapper.appendChild(card);
			carouselBtns.forEach((btn) => btn.classList.remove("display--none"));
			createDots(Math.ceil(totalSlides / slidesToShow));
		} catch (error) {
			console.error("Error creating post card:", error);
		}
	}
}

///////////////////////////////////////////////////////////////
// Posts carousel
// Modified suggestion from ChatGPT

// Setup
const carouselTrack = document.querySelector(".carousel-track");
let currentSlide = 0;
let slidesToShow = getSlidesToShow();
let totalSlides = getSlidesToShow() * 3;

// Function to determine slides to show based on screen width
function getSlidesToShow() {
	const screenWidth = window.innerWidth;

	if (screenWidth < 250 * 2) {
		// For mobile devices
		return 1;
	} else if (screenWidth < 250 * 3) {
		// For tablets
		return 2;
	} else if (screenWidth < 250 * 4) {
		// For smaller desktops
		return 3;
	} else {
		// For larger desktops
		return 4;
	}
}

// Function to update the carousel items' flex-basis based on slidesToShow
function updateCarouselItemsWidth() {
	const carouselItems = document.querySelectorAll(".carousel-track .post-card");
	carouselItems.forEach((item) => {
		item.style.flex = `0 0 calc(${100 / slidesToShow}% - 1.25rem)`;
	});
}

// Event listener to adjust slidesToShow on window resize
window.addEventListener("resize", () => {
	slidesToShow = getSlidesToShow();
	updateCarouselItemsWidth();
	adjustCarousel();
	createDots(Math.ceil(totalSlides / slidesToShow));
});

// Function to adjust the carousel display
function adjustCarousel() {
	// Calculate the width of a single slide
	// With help from ChatGPT
	const slideWidth = carouselTrack.clientWidth / slidesToShow;
	const newTransformValue = -currentSlide * slideWidth * slidesToShow;
	carouselTrack.style.transform = `translateX(${newTransformValue}px)`;
}

// Event listeners for next and previous buttons
document.querySelector(".next").addEventListener("click", () => {
	// Calculate the width of a single slide
	// With help from ChatGPT
	const slideWidth = carouselTrack.clientWidth / slidesToShow;

	// Move to the next set of posts
	currentSlide = Math.min(currentSlide + 1, totalSlides / slidesToShow - 1);
	carouselTrack.style.transform = `translateX(-${
		currentSlide * slideWidth * slidesToShow
	}px)`;
	createDots(Math.ceil(totalSlides / slidesToShow));
});

document.querySelector(".prev").addEventListener("click", () => {
	// Calculate the width of a single slide
	// With help from ChatGPT
	const slideWidth = carouselTrack.clientWidth / slidesToShow;

	// Move to the previous set of posts
	currentSlide = Math.max(currentSlide - 1, 0);
	carouselTrack.style.transform = `translateX(-${
		currentSlide * slideWidth * slidesToShow
	}px)`;
	createDots(Math.ceil(totalSlides / slidesToShow));
});

// Function to create dots
function createDots(numberOfDots) {
	const dotsContainer = document.querySelector(".carousel-dots");
	dotsContainer.innerHTML = "";

	for (let i = 0; i < numberOfDots; i++) {
		const dot = document.createElement("div");
		dot.classList.add("carousel-dot");
		dot.addEventListener("click", () => moveToSlide(i));
		dotsContainer.appendChild(dot);
	}

	updateDots();
}

// Function to update the active state of dots
function updateDots() {
	const dots = document.querySelectorAll(".carousel-dot");
	dots.forEach((dot, index) => {
		dot.classList.toggle("active", index === currentSlide);
	});
}

// Function to move to a specific slide when a dot is clicked
function moveToSlide(slideIndex) {
	currentSlide = slideIndex;
	adjustCarousel();
	updateDots();
}

export default function home() {
	loadPosts();
}
