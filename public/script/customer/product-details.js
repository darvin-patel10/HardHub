
        // Global variables
        let selectedSize = null;
        let selectedPrice = null;
        let selectedSizeId = null;
        let selectedStock = 0;

        // Change product image when thumbnail is clicked
        function changeImage(src) {
            document.getElementById('main-image').src = src;
        }

        // Select a size option
        function selectSize(element) {
            // Check if size is in stock
            const stock = parseInt(element.getAttribute('data-stock'));
            if (stock <= 0) return;
            
            // Remove selected class from all sizes
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected-size');
            });
            
            // Add selected class to clicked size
            element.classList.add('selected-size');
            
            // Update selected size info
            selectedSize = element.getAttribute('data-size');
            selectedPrice = element.getAttribute('data-price');
            selectedStock = stock;
            selectedSizeId = Array.from(document.querySelectorAll('.size-option')).indexOf(element);
            
            // Update display
            document.getElementById('selected-size-text').textContent = selectedSize + '"';
            document.getElementById('selected-price-text').textContent = '₹' + selectedPrice;
            document.getElementById('stock-info').textContent = selectedStock + ' units available';
            document.getElementById('selected-size-info').classList.remove('hidden');
            
            // Update price display
            document.getElementById('price-display').innerHTML = `
                <div class="text-3xl font-bold text-green-600">₹${selectedPrice}</div>
                <div class="text-sm text-gray-500">Size: ${selectedSize}"</div>
            `;
            
            // Update form hidden inputs
            document.getElementById('selected-size-input').value = selectedSize;
            document.getElementById('selected-price-input').value = selectedPrice;
            document.getElementById('selected-size-id').value = selectedSizeId;
            document.getElementById('buy-selected-size-input').value = selectedSize;
            document.getElementById('buy-selected-price-input').value = selectedPrice;
            document.getElementById('buy-selected-size-id').value = selectedSizeId;
            
            // Enable buttons
            document.getElementById('add-to-cart-btn').disabled = false;
            document.getElementById('buy-now-btn').disabled = false;
            
            // Update max quantity based on stock
            const quantityInput = document.getElementById('quantity');
            const maxQuantity = Math.min(10, selectedStock);
            quantityInput.max = maxQuantity;
            
            if (parseInt(quantityInput.value) > maxQuantity) {
                quantityInput.value = maxQuantity;
                updateQuantity();
            }
        }

        // Quantity management
        function increaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            let currentValue = parseInt(quantityInput.value);
            const maxValue = selectedStock > 0 ? Math.min(10, selectedStock) : 10;
            
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
                updateQuantity();
            }
        }

        function decreaseQuantity() {
            const quantityInput = document.getElementById('quantity');
            let currentValue = parseInt(quantityInput.value);
            
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateQuantity();
            }
        }

        function updateQuantity() {
            const quantity = document.getElementById('quantity').value;
            document.getElementById('cart-quantity').value = quantity;
            document.getElementById('buy-quantity').value = quantity;
        }

        // Form submission validation
        document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
            if (!selectedSize) {
                e.preventDefault();
                alert('Please select a size before adding to cart');
                document.getElementById('size-options').scrollIntoView({ behavior: 'smooth' });
            } else if (selectedStock <= 0) {
                e.preventDefault();
                alert('Selected size is out of stock');
            } else {
                updateQuantity();
            }
        });

        document.getElementById('buy-now-form').addEventListener('submit', function(e) {
            if (!selectedSize) {
                e.preventDefault();
                alert('Please select a size before buying');
                document.getElementById('size-options').scrollIntoView({ behavior: 'smooth' });
            } else if (selectedStock <= 0) {
                e.preventDefault();
                alert('Selected size is out of stock');
            } else {
                updateQuantity();
            }
        });

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Update quantity inputs
            updateQuantity();
            
            // If product has sizes, disable buttons initially
            if(product.sizes && product.sizes.length > 0) {
                document.getElementById('add-to-cart-btn').disabled = true;
                document.getElementById('buy-now-btn').disabled = true;
                
                // Check if there's a default size in stock
                const firstSize = document.querySelector('.size-option:not(.out-of-stock)');
                if (firstSize) {
                    selectSize(firstSize);
                }
            }
            
            // Quantity input change listener
            document.getElementById('quantity').addEventListener('change', function() {
                let value = parseInt(this.value);
                const maxValue = selectedStock > 0 ? Math.min(10, selectedStock) : 10;
                
                if (value < 1) {
                    this.value = 1;
                } else if (value > maxValue) {
                    this.value = maxValue;
                    alert(`Maximum ${maxValue} units available for selected size`);
                }
                
                updateQuantity();
            });
            
            // Quantity input keyup listener
            document.getElementById('quantity').addEventListener('keyup', updateQuantity);
        });