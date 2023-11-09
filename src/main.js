// Add an event listener to the "Search" button
document.getElementById("searchButton").addEventListener("click", function () {
  // Get the user's input and perform the search
  const searchWord = document.getElementById("wordInput").value;

  // Handle the case when no search word is provided
  if (searchWord) {
    // Fetch data from the API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Redirect to the search results page and pass the results as a JSON string
          window.location.href = `displaymeaning.html?word=${searchWord}&results=${encodeURIComponent(JSON.stringify(data))}`;
        } else {
          // Display an error message to the user
          alert("No data found for the word.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Error fetching data.");
      });
  } else {
    // Display an error message to the user
    alert("Please enter a word to search.");
  }
});
