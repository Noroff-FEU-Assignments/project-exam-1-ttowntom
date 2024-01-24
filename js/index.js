// This function dynamically imports the page based on the route
// Suggested by ChatGPT
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
			await loadPage("home");
			break;
		case "/blog/":
			await loadPage("blog");
			break;
		case "/blog/post/":
			await loadPage("blogPost");
			break;
		case "/about/":
			await loadPage("about");
			break;
		case "/contact/":
			await loadPage("contact");
			break;
		default:
			await loadPage("notFound"); // Assuming you have a notFound module
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
