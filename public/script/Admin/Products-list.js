document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category');
    const stockFilter = document.getElementById('stock');
    const products = document.querySelectorAll('.product-row');

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    stockFilter.addEventListener('change', applyFilters);

    function applyFilters() {
        const searchValue = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStock = stockFilter.value;

        products.forEach(product => {
            const textMatch = product.textContent.toLowerCase().includes(searchValue);

            const categoryMatch =
                selectedCategory === 'all' ||
                product.dataset.category === selectedCategory;

            let stockMatch = true;
            const stock = parseInt(product.dataset.stock);

            if (selectedStock === 'low'){ 
                stockMatch = stock < 5;
                product.style.display =  'table-row';
            }
            else if (selectedStock === 'out') stockMatch = stock === 0;
            else if (selectedStock === 'in') stockMatch = stock > 0;

            if (textMatch && categoryMatch && stockMatch) {
                product.style.display = 'table-row';
            } else {
                product.style.display = 'none';
            }
        });
    }
});
