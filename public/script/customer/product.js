//Navbar

function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            
            navLinks.classList.toggle('active');
        }

// Simple product filtering
        function filterProducts(category) {
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                if (category === 'all') {
                    product.style.display = 'block';
                } else {
                    if (product.dataset.category === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });
        }

        // Add to cart functionality
        document.querySelectorAll('.product-card button').forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.parentElement.querySelector('.product-name').textContent;
                const price = this.parentElement.querySelector('.price').textContent;
                alert(`Added to cart: ${productName} - ${price}`);
                // In real implementation, you would update cart count here
            });
        });