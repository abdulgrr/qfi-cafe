/**
 * Qfi Coffee - Client Interaction Script (Pinterest Style Menu & Live Search)
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryPills = document.querySelectorAll('.category-pill');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('menu-search-input');

  let activeCategory = 'all';
  let searchQuery = '';

  const filterProducts = () => {
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category-slug');
      const cardName = card.getAttribute('data-product-name') || '';
      const cardDesc = card.getAttribute('data-product-desc') || '';

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchQuery || cardName.includes(searchQuery) || cardDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Category Pill Click Event
  if (categoryPills.length > 0) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        activeCategory = pill.getAttribute('data-category');

        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        filterProducts();
      });
    });
  }

  // Live Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProducts();
    });
  }
});
