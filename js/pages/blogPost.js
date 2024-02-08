import { getPost } from "/js/api/index.js";

///////////////////////////////////////////////////////////////
// Grab meta tags
const postTitle = document.querySelector("title");
const postDescription = document.querySelector('meta[name="description"]');
const postKeywords = document.querySelector('meta[name="keywords"]');
const postOgTitle = document.querySelector('meta[property="og:title"]');
const postOgDescription = document.querySelector(
	'meta[property="og:description"]'
);
const postOgImage = document.querySelector('meta[property="og:image"]');
const postOgUrl = document.querySelector('meta[property="og:url"]');
const postTwitterTitle = document.querySelector('meta[name="twitter:title"]');
const postTwitterDescription = document.querySelector(
	'meta[name="twitter:description"]'
);
const postTwitterImage = document.querySelector('meta[name="twitter:image"]');

// Set meta tags
function setMetaTags(post) {
	const title = post.title.rendered + " | CodeJourney.io";
	const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, "");
	const postImage = post._embedded["wp:featuredmedia"][0].source_url;

	postTitle.textContent = title;
	postDescription.setAttribute("content", description);
	// Loop over taxonomy array and set keywords from category and tags
	let keywords = "";
	for (let i = 0; i < post._embedded["wp:term"].length; i++) {
		let taxonomyArray = post._embedded["wp:term"][i];
		for (let j = 0; j < taxonomyArray.length; j++) {
			let item = taxonomyArray[j];
			keywords += item.name + ", ";
		}
	}
	postKeywords.setAttribute("content", keywords);
	postOgTitle.setAttribute("content", title);
	postOgDescription.setAttribute("content", description);
	postOgImage.setAttribute("content", postImage);
	postOgUrl.setAttribute("content", window.location.href);
	postTwitterTitle.setAttribute("content", title);
	postTwitterDescription.setAttribute("content", description);
	postTwitterImage.setAttribute("content", postImage);
}

///////////////////////////////////////////////////////////////
// Grab wrappers
const postHero = document.querySelector("#hero-blog-post");
const postDate = document.querySelector(".post-date");
const postCategories = document.querySelector(".post-categories");
const postTags = document.querySelector(".post-tags");
const postContent = document.querySelector(".post-content");
const loader = document.querySelector(".loader-wrapper");
const commentSection = document.querySelector("#comment-section");
const comments = document.querySelector("#comments-list");
const noComments = document.querySelector(".comments-empty");
const commentForm = document.querySelector(".comment-form");
const commentsLoader = document.querySelector(".comments-loader");
const commentsHeader = document.querySelector(".comments-header");

///////////////////////////////////////////////////////////////
// Get the blog post from server
async function loadPost(id) {
	try {
		let post = await getPost(id);
		buildPost(post);
		loader.remove();
		postHero.style.borderColor = "var(--clr-grey-desat)";
		setMetaTags(post);
		openModal();
		buildCommentSection(post);
	} catch (error) {
		console.log(`Error fetching post with id ${id}: `, error);
	}
}

///////////////////////////////////////////////////////////////
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
					element.href = `/blog/${taxonomyType}/?${taxonomyType}=${item.id}&name=${item.name}`;
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

		// Save li markers from going off screen
		const liItems = doc.querySelectorAll("li");
		liItems.forEach((li) => {
			li.classList.add("padding-left-1");
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

///////////////////////////////////////////////////////////////
// Build comment section

// Function to convert date to "time ago"
function timeAgo(dateParam) {
	const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
	const now = new Date();
	const seconds = Math.round((now - date) / 1000);
	const minutes = Math.round(seconds / 60);
	const hours = Math.round(minutes / 60);
	const days = Math.round(hours / 24);
	const months = Math.round(days / 30.4); // Average month in days
	const years = Math.round(days / 365);

	if (seconds < 60) return "Just now";
	else if (minutes < 60) return `${minutes} minutes ago`;
	else if (hours < 24) return `${hours} hours ago`;
	else if (days < 30) return `${days} days ago`;
	else if (months < 12) return `${months} months ago`;
	else return `${years} years ago`;
}

function buildCommentSection(post) {
	// Build comments list
	commentSection.classList.remove("display--none");
	if (!post._embedded.replies) {
		// There are no comments on this post
		commentsHeader.textContent = "No comments yet";
		noComments.classList.remove("display--none");
	} else {
		// There are comments on this post
		// Build comments list
		post._embedded.replies[0].forEach((comment) => {
			// Create comment wrapper
			const commentWrapper = document.createElement("div");
			commentWrapper.classList.add("comment-wrapper");

			// Create comment avatar
			const commentAvatar = document.createElement("img");
			commentAvatar.classList.add("comment-avatar");
			commentAvatar.src = comment.author_avatar_urls["96"];
			commentAvatar.alt = comment.author_name + " avatar";
			commentWrapper.appendChild(commentAvatar);

			// Create comment meta
			const commentMeta = document.createElement("div");
			commentMeta.classList.add("comment-meta");
			// Create comment author
			const commentAuthor = document.createElement("h3");
			commentAuthor.innerText = comment.author_name;
			commentMeta.appendChild(commentAuthor);
			// Create comment date
			const commentDate = document.createElement("p");
			commentDate.innerText = timeAgo(comment.date);
			commentMeta.appendChild(commentDate);
			commentWrapper.appendChild(commentMeta);

			// Create comment content
			const commentContent = document.createElement("div");
			commentContent.classList.add("comment-content");
			commentContent.innerHTML = comment.content.rendered;
			commentWrapper.appendChild(commentContent);

			comments.appendChild(commentWrapper);
		});
	}
}

///////////////////////////////////////////////////////////////
// Function to open images in modal
function openModal() {
	// Get the modal
	var modal = document.querySelector("#image-modal");
	var modalWrapper = document.querySelector(".modal-wrapper");

	// Get the image and insert it inside the modal - use its "alt" text as a caption
	var modalImg = document.querySelector("#modal-image");
	var captionText = document.querySelector(".modal-caption");

	// Function to get the largest image URL from srcset
	// (Modified from suggestion by ChatGPT)
	function getLargestImageUrl(srcset) {
		const sources = srcset.split(",").map((src) => {
			const [url, width] = src.trim().split(" ");
			return { url, width: parseInt(width) };
		});

		// Find the source with the largest width
		const largestSource = sources.reduce(
			(max, src) => (src.width > max.width ? src : max),
			sources[0]
		);
		return largestSource.url;
	}

	// Get all images inside blog posts and add click event to open modal
	document.querySelectorAll(".post-content img").forEach((img) => {
		img.onclick = function () {
			modal.style.display = "block";
			const largestImageUrl = img.hasAttribute("srcset")
				? getLargestImageUrl(img.getAttribute("srcset"))
				: img.src;
			modalImg.src = largestImageUrl;
			captionText.innerHTML = img.alt;
		};
	});

	// Get the element that closes the modal
	var span = document.getElementsByClassName("close-modal")[0];

	// When the close button is clicked, close the modal
	span.onclick = function () {
		modal.style.display = "none";
	};

	// Close the modal when clicking outside of the image
	window.onclick = function (event) {
		if (event.target == modal || event.target == modalWrapper) {
			modal.style.display = "none";
		}
	};
}

///////////////////////////////////////////////////////////////
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
