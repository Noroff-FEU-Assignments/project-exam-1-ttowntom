// This function dynamically imports the page based on the route
// (Modified from suggestion by ChatGPT)
async function loadPage(page) {
	try {
		const module = await import(`./pages/${page}.js`);
		module.default();
	} catch (error) {
		console.error("Error loading the page:", error);
		// Might want to redirect to 404 page here
	}
}

async function route(path) {
	switch (path.toLowerCase()) {
		case "/":
		case "/index.html":
			await loadPage("home");
			break;
		case "/blog/":
		case "/blog/index.html":
			await loadPage("blog");
			break;
		case "/blog/post/":
		case "/blog/post/index.html":
			await loadPage("blogPost");
			break;
		case "/about/":
		case "/about/index.html":
			await loadPage("about");
			break;
		case "/contact/":
		case "/contact/index.html":
			await loadPage("contact");
			break;
		default:
			await loadPage("notFound"); // ADD NOT FOUND PAGE!!
	}
}

// Listen to navigation events
window.onpopstate = () => route(location.pathname);

// Initial routing
route(location.pathname);

// Load main menu
async function loadMenu() {
	const response = await fetch("/components/mainMenu.html");
	const menuHtml = await response.text();
	document.getElementById("header").innerHTML = menuHtml;
}

// Load footer
async function loadFooter() {
	const response = await fetch("/components/footer.html");
	const footerHtml = await response.text();
	document.getElementById("footer").innerHTML = footerHtml;
}

// Render global components
window.onload = () => {
	loadMenu();
	loadFooter();
};
