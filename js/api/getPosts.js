// WordPress base URL
import { API_BASE_URL } from "./config.js";

// Get all blog posts
export async function getPosts(params) {
	try {
		const response = await fetch(`${API_BASE_URL}/posts?_embed&${params}`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const posts = await response.json();
		return posts;
	} catch (error) {
		console.log("Error fetching posts:", error);
	}
}

// Get a single blog post
export async function getPost(id) {
	try {
		const response = await fetch(`${API_BASE_URL}/posts/${id}?_embed`);
		if (!response.ok) {
			throw Error(response.statusText);
		}
		const post = await response.json();
		return post;
	} catch (error) {
		console.log(`Error fetching post with ID ${postId}:`, error);
	}
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
