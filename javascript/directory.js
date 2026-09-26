const titleButton = document.querySelector("#sort-title");
const yearButton = document.querySelector("#sort-year");

const titleDirectory = document.querySelector("#title-directory");
const yearDirectory = document.querySelector("#year-directory");

const movies = document.querySelectorAll(".directory-entry");
const movieList = Array.from(movies);

let yearDescending = true;

yearButton.addEventListener("click", function() {

    movieList.sort(function(a, b) {
        const yearA = Number(a.dataset.year);
        const yearB = Number(b.dataset.year);

        if (yearDescending) {
            return yearB - yearA;
        } else {
            return yearA - yearB;
        }
    });

    yearDirectory.innerHTML = "";

	let currentDecade = null;

	movieList.forEach(function(movie) {

		const year = Number(movie.dataset.year);
		const decade = Math.floor(year / 10) * 10;

		if (decade !== currentDecade) {

			const heading = document.createElement("h2");

			heading.textContent = decade + "s";
			heading.className = "year-decade";

			yearDirectory.appendChild(heading);

			currentDecade = decade;
		}

		const entry = document.createElement("a");

		entry.href = movie.href;
		entry.textContent = movie.dataset.title + " (" + movie.dataset.year + ")";

		entry.className = "year-entry";

		yearDirectory.appendChild(entry);
	});

    titleDirectory.hidden = true;
    yearDirectory.hidden = false;

    yearDescending = !yearDescending;
});

titleButton.addEventListener("click", function() {
    titleDirectory.hidden = false;
    yearDirectory.hidden = true;
});