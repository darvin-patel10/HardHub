function searchProduct() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        window.location.href = `/product?search=${encodeURIComponent(searchTerm)}`;
    } else {
        alert('Please enter a search term');
    }
}

// Allow Enter key to trigger search
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProduct();
    }
});

// Animate digits on load
document.addEventListener('DOMContentLoaded', function() {
    const digits = document.querySelectorAll('.digit');
    digits.forEach((digit, index) => {
        setTimeout(() => {
            digit.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                digit.style.animation = '';
            }, 500);
        }, index * 200);
    });
});