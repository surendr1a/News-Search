const rapidApiKey = '50e74772cfmsh314b447c41f9109p15ecb9jsncf1c2be0c953'; // RapidAPI key
const rapidApiHost = 'latest-news-api1.p.rapidapi.com'; // RapidAPI host

// Function to format dates to a readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toDateString(); // Converts to a format like "Sun Apr 28 2024"
}

// Function to fetch news articles based on a query
async function fetchNews(query) {
    const options = {
        method: 'GET',
        url: `https://latest-news-api1.p.rapidapi.com/news/${encodeURIComponent(query)}`, // Correct URL with encoded query
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost,
        },
    };

    try {
        const response = await axios.request(options); // Make the GET request
        const articles = response.data; // Get the list of news articles

        if (Array.isArray(articles) && articles.length > 0) { // Ensure there are articles
            renderNews(articles); // Render the news articles
        } else {
            console.warn('No news articles found.');
            renderNews([]); // Clear previous results if no articles found
        }
    } catch (error) {
        console.error('Error fetching news:', error); // Log the error
        alert('An error occurred while fetching news. Please try again later.'); // Notify the user about the error
    }
}

// Function to render news articles with images
function renderNews(articles) {
    const newsContainer = document.getElementById('news-container'); // Get the news container
    newsContainer.innerHTML = ''; // Clear previous content

    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No matching news articles found.</p>'; // Display message if no articles found
        return;
    }

    articles.forEach((article) => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article'); // Apply the article styling class

        const formattedDate = article.published ? formatDate(article.published) : 'Unknown Date'; // Format the publication date

        // Add image if available
        const imageHTML = article.image
            ? `<img src="${article.image}" alt="${article.title}" style="max-width: 100%;">`
            : ''; // Leave blank if no image

        articleElement.innerHTML = `
            <h3><a href="${article.link}" target="_blank">${article.title}</a></h3> <!-- Title with link -->
            ${imageHTML} <!-- Insert image if provided -->
            <p><strong>Author:</strong> ${article.author}</p> <!-- Display the author -->
            <p><strong>Published:</strong> ${formattedDate}</p> <!-- Display the formatted publication date -->
        `;

        newsContainer.appendChild(articleElement); // Add to the news container
    });
}

// Function to handle category selection
function handleCategorySelection(event) {
    event.preventDefault(); // Prevent the default link behavior
    const category = event.target.getAttribute('data-category'); // Get the selected category
    fetchNews(category); // Fetch news based on the selected category
}

// Function to handle input for live search
function handleInput() {
    const searchBox = document.getElementById('search-box'); // Get the search box
    const query = searchBox.value.trim(); // Get the current input value

    if (query) {
        fetchNews(query); // Fetch news based on the live input
    } else {
        renderNews([]); // Clear results if the search box is empty
    }
}

// Add event listener to the search box for live search
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', handleInput); // Trigger live search on input change

// Add event listener for category button to toggle dropdown
const categoryButton = document.getElementById('category-button');
categoryButton.addEventListener('click', (event) => {
    const dropdown = event.target.parentElement; // Get the dropdown parent
    dropdown.classList.toggle('show'); // Toggle dropdown visibility
});

// Add event listeners to category links for category selection
const categoryLinks = document.querySelectorAll('.category'); // Get all category links
categoryLinks.forEach((link) => {
    link.addEventListener('click', handleCategorySelection); // Trigger category fetch on click
});

// Fetch news articles when the page loads with a default category
document.addEventListener('DOMContentLoaded', () => {
    fetchNews('technology'); // Default query for the news articles
});
