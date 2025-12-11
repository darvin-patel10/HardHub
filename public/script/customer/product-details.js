// Change product image when thumbnail is clicked
        function changeImage(src) {
            document.getElementById('main-image').src = src;
        }

        function copyQuantity(form) {
            const quantityInput = document.getElementById('quantity');
            const hiddenQuantity = form.querySelector('input[name="quantity"]');
            hiddenQuantity.value = quantityInput.value;
            return true;
        }

        // Add to cart functionality
        // document.querySelector('.add-to-cart').addEventListener('click', function() {
        //     const productName = document.querySelector('.product-title').textContent;
        //     const price = document.querySelector('.product-price').textContent.split(' ')[0];
        //     const quantity = document.getElementById('quantity').value;
            
        //     alert(`Added to cart: ${quantity} x ${productName}\nTotal: ₹${(parseInt(price.replace(/[^0-9]/g,'')) * quantity)}`);
        // });

        // Buy now functionality
        document.querySelector('.buy-now').addEventListener('click', function() {
            alert('Redirecting to checkout page...');
            // In real implementation, this would redirect to checkout
        });