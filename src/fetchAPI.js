// Define the createElementWithText function
function createElementWithText(elementType, textContent) {
  var element = document.createElement(elementType);
  element.textContent = textContent;
  return element;
}

// Define the createAudioElement function
function createAudioElement(audioUrl) {
  var audio = document.createElement('audio');
  audio.setAttribute('controls', true);
  var source = document.createElement('source');
  source.setAttribute('src', audioUrl);
  audio.appendChild(source);
  return audio;
}

// Fetch data from the API
function fetchData(searchWord) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      .then((response) => response.json())
      .then((data) => {
          // Clear previous results
          const resultsContainer = document.getElementById("results");
          resultsContainer.innerHTML = "";

          if (data && data.length > 0) {
              const uniqueWords = new Set(); // Use a set to store unique words
              const uniqueSourceUrls = new Set(); // Use a set to store unique source URLs

              data.forEach((entry) => {
                  if (!uniqueWords.has(entry.word)) {
                      uniqueWords.add(entry.word);

                      // Display the word
                      resultsContainer.appendChild(createElementWithText('h2', `Word: ${entry.word}`));

                      if (entry.phonetics && entry.phonetics.length > 0) {
                          entry.phonetics.forEach((phonetic) => {
                              if (phonetic.text) {
                                  // Display phonetic
                                  resultsContainer.appendChild(createElementWithText('p', `Phonetic: ${phonetic.text}`));
                              }
                              if (phonetic.audio) {
                                  resultsContainer.appendChild(createAudioElement(phonetic.audio));
                              }
                          });
                      }

                      if (entry.meanings && entry.meanings.length > 0) {
                          entry.meanings.forEach((meaning) => {
                              if (meaning.partOfSpeech) {
                                  const partOfSpeech = meaning.partOfSpeech.toLowerCase();

                                  if (meaning.definitions && meaning.definitions.length > 0) {
                                      const definitionList = document.createElement('ul');
                                      meaning.definitions.forEach((definition, index) => {
                                          // Display definitions
                                          const listItem = document.createElement('li');
                                          listItem.appendChild(createElementWithText('p', `Definition ${index + 1}: ${definition.definition}`));
                                          definitionList.appendChild(listItem);
                                      });

                                      const meaningElement = document.createElement("div");
                                      meaningElement.classList.add("meaning");
                                      meaningElement.appendChild(createElementWithText('p', `Part of Speech: ${meaning.partOfSpeech}`));
                                      meaningElement.appendChild(definitionList);

                                      if (meaning.synonyms && meaning.synonyms.length > 0) {
                                          // Display synonyms
                                          meaningElement.appendChild(createElementWithText('p', `Synonyms: ${meaning.synonyms.join(', ')}`));
                                      }

                                      if (meaning.antonyms && meaning.antonyms.length > 0) {
                                          // Display antonyms
                                          meaningElement.appendChild(createElementWithText('p', `Antonyms: ${meaning.antonyms.join(', ')}`));
                                      }

                                      if (meaning.example) {
                                          // Display example
                                          meaningElement.appendChild(createElementWithText('p', `Example: ${meaning.example}`));
                                      }

                                      // Collect source URLs for the word entry (may contain duplicates)
                                      if (entry.sourceUrls && entry.sourceUrls.length > 0) {
                                          uniqueSourceUrls.add(...entry.sourceUrls);
                                      }

                                      // Append the entire word entry to the results container
                                      resultsContainer.appendChild(meaningElement);
                                  }
                              }
                          });
                      }
                  }
              });

              // Redirect to the search results page and pass the results as a JSON string
              window.location.href = `displaymeaning.html?word=${searchWord}&results=${JSON.stringify(data)}`;

          } else {
              // Display a message if no data found for the word
              resultsContainer.appendChild(createElementWithText('p', `No data found for "${searchWord}"`));
          }

          resultsContainer.style.display = "block";
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
          const resultsContainer = document.getElementById("results");
          resultsContainer.innerHTML = "No results found.";
          resultsContainer.style.display = "block";
      });
}

// Add an event listener to the search button
document.getElementById("searchButton").addEventListener("click", function () {
  const searchWord = document.getElementById("wordInput").value;
  fetchData(searchWord);
});
