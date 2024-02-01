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

// // Modified getPosts function to handle "Load More" functionality
// export async function getPosts(apiUrl, page) {
// 	const cacheKey = 'posts';
// 	const postsPerPage = 10; // Number of posts per page
// 	const startIndex = (page - 1) * postsPerPage;
// 	const endIndex = page * postsPerPage;
// 	const cacheTime = 5 * 60 * 1000; // 5 minutes
// 	const now = new Date();

// 	// Retrieve the entire post cache from session storage
// 	const storedData = sessionStorage.getItem(cacheKey);

// 	if (storedData) {
// 	  const { data, timestamp } = JSON.parse(storedData);
// 	  const isCacheValid = now.getTime() - timestamp < cacheTime;

// 	  // Use cached data if it's still valid and contains the page we need
// 	  if (isCacheValid && data.length >= endIndex) {
// 		return data.slice(startIndex, endIndex); // Return the specific page from cache
// 	  }
// 	}

// 	// If cache is not valid or doesn't contain the page we need, fetch more posts
// 	try {
// 	  const response = await fetch(`${apiUrl}&page=${page}`);
// 	  if (!response.ok) {
// 		throw new Error(`HTTP error! status: ${response.status}`);
// 	  }
// 	  const newPosts = await response.json();

// 	  // If we had valid cached data, append new posts to it, otherwise start a new array
// 	  const updatedPosts = storedData ? [...JSON.parse(storedData).data, ...newPosts] : newPosts;

// 	  // Update the session storage with the new list of posts
// 	  sessionStorage.setItem(cacheKey, JSON.stringify({ data: updatedPosts, timestamp: now.getTime() }));

// 	  // Return the specific page of posts
// 	  return updatedPosts.slice(startIndex, endIndex);
// 	} catch (error) {
// 	  console.error(error);
// 	  return []; // Handle error appropriately
// 	}
//   }
