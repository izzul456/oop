const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});

document.addEventListener('DOMContentLoaded', () => {
  loadWordOfTheDay();
  setupSaveButton();
});

function loadWordOfTheDay() {
  // Define the API endpoint URL for the Word of the Day.
  const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/wordOfTheDay';

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract the word and meaning from the API response.
      const wordOfDay = data[0].word;
      const meaning = data[0].meanings[0].definition;

      // Update the HTML elements with the Word of the Day and its meaning.
      document.getElementById('wordOfDay').textContent = `Word of the Day: ${wordOfDay}`;
      document.getElementById('meaning').textContent = `Meaning: ${meaning}`;
    })
    .catch((error) => {
      console.error('Failed to fetch Word of the Day:', error);
    });
}

function setupSaveButton() {
  document.getElementById('saveWordButton').addEventListener('click', () => {
    const userWord = document.getElementById('userWordInput').value;
    if (userWord) {
      fetchMeaningAndSave(userWord);
    } else {
      alert('Please enter a word before saving.');
    }
  });
}

function fetchMeaningAndSave(word) {
  // Use the Dictionary API to fetch the meaning of the word.
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      const meaning = data[0].meanings[0].definition;
      const wordEntry = `${word}: ${meaning}`;

      // Call the exposed function through the context bridge to save the word.
      window.electron.send('saveWord', wordEntry);
    })
    .catch((error) => {
      console.error('Failed to fetch meaning:', error);
    });
}
