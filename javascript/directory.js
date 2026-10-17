const titleButton = document.querySelector("#sort-title");
const yearButton = document.querySelector("#sort-year");
const genreButton = document.querySelector("#sort-genre");

const titleDirectory = document.querySelector("#title-directory");
const yearDirectory = document.querySelector("#year-directory");

const genrePanel = document.querySelector("#genre-panel");
const genreOptions = document.querySelector("#genre-options");

const movies = document.querySelectorAll(".directory-entry");
const movieList = Array.from(movies);

let yearDescending = true;

// Collect all genres dynamically from the directory entries.
const genres = new Set();

movieList.forEach(function(movie) {
    movie.dataset.genre
        .split(",")
        .map(function(genre) {
            return genre.trim();
        })
        .filter(Boolean)
        .forEach(function(genre) {
            genres.add(genre);
        });
});

// Create one button for each genre, in alphabetical order.
Array.from(genres)
    .sort(function(a, b) {
        return a.localeCompare(b);
    })
    .forEach(function(genre) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = genre;
        button.className = "genre-option";

        button.addEventListener("click", function() {
            showGenre(genre);
        });

        genreOptions.appendChild(button);
    });

function resetTitleDirectory() {
    movieList.forEach(function(movie) {
        movie.hidden = false;
    });

    titleDirectory.querySelectorAll(".directory-letter")
        .forEach(function(heading) {
            heading.hidden = false;
        });
}

function showGenre(genre) {
    titleDirectory.hidden = false;
    yearDirectory.hidden = true;

    resetTitleDirectory();

    movieList.forEach(function(movie) {
        const movieGenres = movie.dataset.genre
            .split(",")
            .map(function(item) {
                return item.trim();
            });

        movie.hidden = !movieGenres.includes(genre);
    });

    // Hide alphabetical headings that have no matching films.
    titleDirectory.querySelectorAll(".directory-column")
        .forEach(function(column) {
            let currentHeading = null;
            let headingHasMovies = false;

            Array.from(column.children).forEach(function(element) {
                if (element.classList.contains("directory-letter")) {
                    if (currentHeading) {
                        currentHeading.hidden = !headingHasMovies;
                    }

                    currentHeading = element;
                    headingHasMovies = false;
                } else if (
                    element.classList.contains("directory-entry")
                    && !element.hidden
                ) {
                    headingHasMovies = true;
                }
            });

            if (currentHeading) {
                currentHeading.hidden = !headingHasMovies;
            }
        });

    genreOptions.querySelectorAll("button").forEach(function(button) {
        const selected = button.textContent === genre;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

// Expand or collapse the genre selector.
genreButton.addEventListener("click", function() {
    const isExpanded = genreButton.getAttribute("aria-expanded") === "true";

    genreButton.setAttribute("aria-expanded", String(!isExpanded));
    genrePanel.hidden = isExpanded;
});

// Restore the full alphabetical directory.
titleButton.addEventListener("click", function() {
    resetTitleDirectory();

    titleDirectory.hidden = false;
    yearDirectory.hidden = true;

    genrePanel.hidden = true;
    genreButton.setAttribute("aria-expanded", "false");

    genreOptions.querySelectorAll("button").forEach(function(button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });
});

// Display the directory by year, retaining the existing alternating sort.
yearButton.addEventListener("click", function() {
    const sortedMovies = [...movieList];

    sortedMovies.sort(function(a, b) {
        const yearA = Number(a.dataset.year);
        const yearB = Number(b.dataset.year);

        if (yearA !== yearB) {
            return yearDescending ? yearB - yearA : yearA - yearB;
        }

        return a.dataset.title.localeCompare(b.dataset.title);
    });

    yearDirectory.innerHTML = "";

    let currentDecade = null;

    sortedMovies.forEach(function(movie) {
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
        entry.textContent =
            movie.dataset.title + " (" + movie.dataset.year + ")";
        entry.className = "year-entry";

        yearDirectory.appendChild(entry);
    });

    resetTitleDirectory();

    titleDirectory.hidden = true;
    yearDirectory.hidden = false;

    genrePanel.hidden = true;
    genreButton.setAttribute("aria-expanded", "false");

    genreOptions.querySelectorAll("button").forEach(function(button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });

    yearDescending = !yearDescending;
});