import { getPost } from "/js/api/index.js";

// Grab wrappers
const postHero = document.querySelector("#hero-blog-post");
const postDate = document.querySelector(".post-date");
const postCategories = document.querySelector(".post-categories");
const postTags = document.querySelector(".post-tags");
const postContent = document.querySelector(".post-content");

// Get the blog post from server
async function loadPost(id) {
	try {
		let post = await getPost(id);
		buildPost(post);
	} catch (error) {
		console.log(`Error fetching post with id ${id}: `, error);
	}
}

// Build blog post HTML
function buildPost(post) {
	// Add hero image
	postHero.style.backgroundImage = `linear-gradient(to top, hsla(0, 0%, 0%, 0.7), transparent 150%), url(${post._embedded["wp:featuredmedia"][0].source_url})`;
	postHero.style.backgroundSize = "cover";
	postHero.style.backgroundPosition = "center";

	// Create post title
	const postTitle = document.createElement("h1");
	postTitle.innerText = post.title.rendered;
	postHero.appendChild(postTitle);

	// Create post date
	//(Modified from suggestion by ChatGPT)
	const date = new Date(post.date);
	// Options for toLocaleDateString
	const options = { year: "numeric", month: "long", day: "numeric" };

	postDate.textContent = `Posted on: ${date.toLocaleDateString(
		"en-US",
		options
	)} in`;

	// Create post taxonomy elements
	function createTaxonomyElements(post, taxonomyType, className, container) {
		const wrapper = document.createElement("div");
		wrapper.classList.add(`post-${taxonomyType}-wrapper`);

		// Add tags title
		if (taxonomyType === "post_tag") {
			const title = document.createElement("p");
			title.classList.add("post-tag-title");
			title.textContent = "Tags: ";
			wrapper.appendChild(title);
		}

		let elements = [];

		// Loop over taxonomy array
		for (let i = 0; i < post._embedded["wp:term"].length; i++) {
			let taxonomyArray = post._embedded["wp:term"][i];

			// Loop over each item in the taxonomy array
			for (let j = 0; j < taxonomyArray.length; j++) {
				let item = taxonomyArray[j];

				if (item.taxonomy === taxonomyType) {
					const element = document.createElement("a");
					element.classList.add(className);
					element.textContent = item.name;
					element.href = `/${taxonomyType}.html?id=${item.id}`;
					elements.push(element);
				}
			}
		}

		// Append links with commas to the wrapper
		for (let k = 0; k < elements.length; k++) {
			wrapper.appendChild(elements[k]);
			if (k < elements.length - 1) {
				wrapper.appendChild(document.createTextNode(", "));
			}
		}

		// Append the wrapper div to the container
		container.appendChild(wrapper);
	}

	// Invoke createTaxonomyElements for categories and tags
	createTaxonomyElements(post, "category", "post-category", postCategories);
	createTaxonomyElements(post, "post_tag", "post-tag", postTags);

	// Create post content
	// Unwrap images from divs (modified from suggestion by ChatGPT)
	function unwrapImages(content) {
		// Parse the HTML string
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, "text/html");

		// Clean images
		// Find all divs with the class 'wp-block-image'
		const imageWrappers = doc.querySelectorAll(".wp-block-image");

		imageWrappers.forEach((wrapper) => {
			// Find the image element inside the wrapper
			const img = wrapper.querySelector("img");
			if (img) {
				// Remove all classes and add the 'breakout' class
				img.className = "";
				img.classList.add("breakout", "post-img");
				// Replace the wrapper with the image
				wrapper.parentNode.replaceChild(img, wrapper);
			}
		});

		// Serialize the document back to a string
		const serializer = new XMLSerializer();
		const serializedContent = serializer.serializeToString(doc);

		return serializedContent;
	}

	const tempContent = unwrapImages(post.content.rendered);

	// Remove WP classes
	function cleanContent(content) {
		// Match the specific classes
		const heading = /class="wp-block-heading"/g;

		// Remove the matched class attributes
		content = content.replace(heading, "");
		return content;
	}

	postContent.innerHTML = cleanContent(tempContent);
}

export default function blogPost() {
	// Get query string from the URL
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const postId = urlParams.get("id");

	// Check if postId is valid and then load the post
	if (postId) {
		loadPost(postId);
	} else {
		console.error("No post ID found in the URL");
		// 404 page
	}
}
