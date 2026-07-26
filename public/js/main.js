/**
 * Qfi Coffee - Client Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Category Pill Filter Logic on QR Menu page
  const categoryPills = document.querySelectorAll('.category-pill');
  const productCards = document.querySelectorAll('.product-card');

  if (categoryPills.length > 0) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const targetCategory = pill.getAttribute('data-category');

        // Update active tab styling
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Filter products
        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category-slug');
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
