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
    const categoryFilter = document.getElementById('categoryFilter');
  
    function populateCategories() {
      const categories = [...new Set(quotes.map(quote => quote.category))];
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }
  
    function showRandomQuote() {
      const selectedCategory = categoryFilter.value;
      const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
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
        updateCategories(newQuoteCategory);
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    function updateCategories(newCategory) {
      if (![...categoryFilter.options].some(option => option.value === newCategory)) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categoryFilter.appendChild(option);
      }
    }
  
    function loadLastViewedQuote() {
      const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
      if (lastViewedQuote) {
        quoteDisplay.textContent = `${lastViewedQuote.text} - ${lastViewedQuote.category}`;
      }
    }
  
    function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      localStorage.setItem('selectedCategory', selectedCategory);
      showRandomQuote();
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
        populateCategories();
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    window.addQuote = addQuote;  // Expose addQuote function to global scope
    window.exportToJsonFile = exportToJsonFile;  // Expose exportToJsonFile function to global scope
    window.importFromJsonFile = importFromJsonFile;  // Expose importFromJsonFile function to global scope
    window.filterQuotes = filterQuotes;  // Expose filterQuotes function to global scope
  
    // Populate categories and load the last viewed quote on page load
    populateCategories();
    loadLastViewedQuote();
  
    // Restore the last selected category filter
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
      filterQuotes();  // Apply the filter based on the last selected category
    }
  });
  