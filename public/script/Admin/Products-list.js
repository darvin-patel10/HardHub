// Simple JavaScript for the products page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Products page loaded');
            
            // Search functionality (basic)
            const searchInput = document.getElementById('search');
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    alert('Searching for: ' + searchInput.value);
                    // In a real app, you would filter products here
                }
            });
            
            // Filter functionality (basic)
            const categoryFilter = document.getElementById('category');
            const stockFilter = document.getElementById('stock');
            
            categoryFilter.addEventListener('change', applyFilters);
            stockFilter.addEventListener('change', applyFilters);
            
            function applyFilters() {
                console.log('Applying filters:');
                console.log('Category:', categoryFilter.value);
                console.log('Stock:', stockFilter.value);
                // In a real app, you would filter products here
            }
            
            // Delete product confirmation
            document.querySelectorAll('a.text-red-600').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to delete this product?')) {
                        alert('Product deleted (this is just a demo)');
                        // In a real app, you would delete the product here
                    }
                });
            });
        });