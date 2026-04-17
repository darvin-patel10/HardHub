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

    // Attach event listeners to all size selectors
    function attachSizeSelectorListeners() {
        const sizeSelectors = document.querySelectorAll('.size-selector');
        sizeSelectors.forEach(selector => {
            // Remove existing listener to avoid duplicates
            selector.removeEventListener('change', updateProductDetails);
            // Add new listener
            selector.addEventListener('change', updateProductDetails);
        });
    }

    // Define updateProductDetails as a named function (not inside another function)
    window.updateProductDetails = function(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const row = selectElement.closest('tr');
        
        // Get price and stock from selected option
        const price = selectedOption.getAttribute('data-price');
        const stock = parseInt(selectedOption.getAttribute('data-stock'));
        
        // Update price display
        const priceDisplay = row.querySelector('.price-display');
        if (priceDisplay) {
            priceDisplay.innerHTML = `₹${price}`;
        }
        
        // Update stock display
        const stockDisplay = row.querySelector('.stock-display');
        if (stockDisplay) {
            if (stock < 5 && stock > 0) {
                stockDisplay.innerHTML = `<span class="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-700">${stock} Low stock</span>`;
            } else if (stock === 0) {
                stockDisplay.innerHTML = `<span class="px-2 py-1 rounded text-sm bg-red-100 text-red-700">Out of stock</span>`;
            } else if (stock > 0) {
                stockDisplay.innerHTML = `<span class="px-2 py-1 rounded text-sm bg-green-100 text-green-700">${stock} In stock</span>`;
            } else {
                stockDisplay.innerHTML = `<span class="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">No stock</span>`;
            }
        }

        // Also update the product-row dataset for filtering
        if (row) {
            row.dataset.stock = stock;
        }
    };

    // Also make filterProductsBySize available globally
    window.filterProductsBySize = function() {
        const sizeFilter = document.getElementById('sizeFilter');
        if (!sizeFilter) return;
        
        const selectedSize = sizeFilter.value;
        const rows = document.querySelectorAll('.product-row');
        
        rows.forEach(row => {
            const sizeSelect = row.querySelector('.size-selector');
            if (sizeSelect) {
                const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
                const currentSize = selectedOption.textContent.trim();
                
                if (selectedSize === 'all' || currentSize.includes(selectedSize)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    };

    // Initial attachment of listeners
    attachSizeSelectorListeners();

    // If you're dynamically loading products via AJAX, call this function after loading
    // For MutationObserver to handle dynamically added products
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                attachSizeSelectorListeners();
            }
        });
    });

    // Start observing the tbody for changes
    const tbody = document.querySelector('tbody');
    if (tbody) {
        observer.observe(tbody, { childList: true, subtree: true });
    }
});