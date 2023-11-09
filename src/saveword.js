// Import the 'fs' module for file operations
const fs = require('fs');

// Add an event listener to the "Save" button
document.getElementById("btnSave").addEventListener("click", function () {
  const wordToSave = document.getElementById("wordInput").value;

  if (wordToSave) {
    saveWordToFile(wordToSave);
  } else {
    alert("Please enter a word to save.");
  }
});

// Function to save a word to a text file
function saveWordToFile(word) {
  const textToSave = word + '\n'; // Append a newline character
  const filePath = 'src/words/userWords.txt';

  fs.appendFile(filePath, textToSave, (err) => {
    if (err) {
      console.error("Error saving word:", err);
      alert("Error saving word.");
    } else {
      alert("Word saved!");
    }
  });
}
