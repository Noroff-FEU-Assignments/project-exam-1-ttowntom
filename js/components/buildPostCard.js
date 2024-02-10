///////////////////////////////////////////////////////////////
// Build blog post card HTML
export async function postCard(post) {
	// Create card wrapper
	const article = document.createElement("article");
	article.classList.add("post-card");
	// Create card link wrapper
	const card = document.createElement("a");
	// card.classList.add("post-card");
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
		headerImg.alt = post._embedded["wp:featuredmedia"][0].alt_text;
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

	// Append card to article
	article.appendChild(card);

	// Return card
	return article;
}
