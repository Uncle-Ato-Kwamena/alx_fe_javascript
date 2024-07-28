document.addEventListener('DOMContentLoaded', () => {
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: 'Hands wash each other.', category: 'Inspiration' },
        { text: 'A person is a person because of other people.', category: 'Inspiration' },
        { text: 'A child who asks questions does not become a fool.', category: 'Success' },
        { text: 'If you are on the road to nowhere, find another road.', category: 'Motivation' },
        { text: 'Knowledge is like a baobab tree; no one can encompass it with their hands.', category: 'Knowledge' }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        localStorage.setItem('quotes', JSON.stringify(quotes));
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    function loadLastViewedQuote() {
      const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
      if (lastViewedQuote) {
        quoteDisplay.textContent = `${lastViewedQuote.text} - ${lastViewedQuote.category}`;
      }
    }
  
    function exportToJsonFile() {
      const dataStr = JSON.stringify(quotes);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'quotes.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  
    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        alert('Quotes imported successfully!');
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    window.addQuote = addQuote;  //  addQuote function to global scope
    window.exportToJsonFile = exportToJsonFile;  // Expose exportToJsonFile function 
    window.importFromJsonFile = importFromJsonFile;  // Expose importFromJsonFile function 
  
    // to load the last viewed quote on page 
    loadLastViewedQuote();
  });
  