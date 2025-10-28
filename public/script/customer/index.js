//nev
function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            const authButtons = document.querySelector('.auth-buttons');
            
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
        }


// Simple JavaScript for cart count (you can expand this later)
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                if(this.textContent === 'Add to Cart') {
                    onclick=window.location.assign('/auth/signin');
                    // alert('Product added to cart!');
                    // In a real site, you would update the cart count here
                }
            });
        });