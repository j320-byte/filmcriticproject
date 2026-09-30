const searchInput = document.querySelector("#review-search");
const searchResults = document.querySelector("#search-results");

searchInput.addEventListener("input", function() {
    const query = searchInput.value.trim().toLowerCase();

    searchResults.innerHTML = "";

    if (query === "") {
        searchResults.hidden = true;
        return;
    }

    const matches = searchReviews
        .filter(function(review) {
            return review.title.toLowerCase().includes(query);
        })
        .slice(0, 10);

    if (matches.length === 0) {
        searchResults.hidden = true;
        return;
    }

    matches.forEach(function(review) {
        const result = document.createElement("a");

        let reviewPath = "reviews/";

		if (
			window.location.pathname.includes("/directory/") ||
			window.location.pathname.includes("/reviews/")
		) {
			reviewPath = "../reviews/";
		}

		result.href = reviewPath + review.filename + ".html";
        result.textContent = review.title + " (" + review.year + ")";
        result.className = "search-result";

        searchResults.appendChild(result);
    });

    searchResults.hidden = false;
});