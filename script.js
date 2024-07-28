document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
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
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
      } else {
        alert('Please enter both a quote and a category.');
      }
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    window.addQuote = addQuote;  // Expose addQuote function to global scope
  });
  