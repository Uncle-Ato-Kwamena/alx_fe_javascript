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
    const notifications = document.getElementById('notifications');
  
    function populateCategories() {
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
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
        showNotification('Quote added successfully!');
        updateCategories(newQuoteCategory);
        syncWithServer(); // Sync with server after adding a new quote
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
        showNotification('Quotes imported successfully!');
        populateCategories();
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    function showNotification(message, isError = false) {
      const notification = document.createElement('div');
      notification.className = `notification${isError ? ' error' : ''}`;
      notification.textContent = message;
      notifications.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  
    async function syncWithServer() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();
  
        // Simulate server data structure
        const formattedServerQuotes = serverQuotes.map((quote, index) => ({
          text: quote.title,
          category: `Category ${index % 5}`
        }));
  
        const mergedQuotes = [...new Map([...formattedServerQuotes, ...quotes].map(item => [item.text, item])).values()];
        
        if (mergedQuotes.length !== quotes.length) {
          quotes = mergedQuotes;
          localStorage.setItem('quotes', JSON.stringify(quotes));
          showNotification('Data synced with server. Conflicts resolved.');
          populateCategories();
        }
      } catch (error) {
        showNotification('Failed to sync with server.', true);
        console.error('Sync error:', error);
      }
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    window.addQuote = addQuote;  // addQuote function to global scope
    window.exportToJsonFile = exportToJsonFile;  // exportToJsonFile function to global scope
    window.importFromJsonFile = importFromJsonFile;  // importFromJsonFile function to global scope
    window.filterQuotes = filterQuotes;  //  filterQuotes function to global scope
  
    // Populate categories and load the last viewed quote on page load
    populateCategories();
    loadLastViewedQuote();
  
    // Restore the last selected category filter
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
      filterQuotes();  // Apply the filter based on the last selected category
    }
  
    // Sync with server periodically
    setInterval(syncWithServer, 60000); // Sync every 60 seconds
  });