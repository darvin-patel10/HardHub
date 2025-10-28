// Additional JavaScript for edit page
        document.addEventListener('DOMContentLoaded', function() {
            // This would normally be populated from your backend
            // For demo purposes, we'll simulate loading product data
            loadProductData();
        });

        function loadProductData() {
            // In a real application, you would fetch this data from your backend API
            // For now, we'll use placeholder data
            const productData = {
                id: "12345",
                name: "Premium Door Handle",
                category: "Main Door Handle",
                brand: "JOY Hardware",
                smallDescription: "High-quality door handle with modern design",
                key_features: ["Stainless steel construction", "Ergonomic design", "Easy installation"],
                fullDescription: "This premium door handle is made from high-quality stainless steel with a modern, ergonomic design. It features a smooth operation mechanism and comes with all necessary hardware for easy installation. Suitable for both residential and commercial applications.",
                price: 1299.99,
                stock: 45,
                techSpecs: {
                    modelNumber: "DH-2023-PRO",
                    modelType: "Lever Handle",
                    material: "Stainless Steel 304",
                    size: 4.5,
                    weight: 350
                },
                image: { url: "/images/products/door-handle-1.jpg", public_id: "prod_123_img1" }
            };

            // Populate form fields
            document.getElementById('productId').value = productData.id;
            document.getElementById('productName').value = productData.name;
            document.getElementById('category').value = productData.category;
            document.getElementById('brand').value = productData.brand;
            document.getElementById('smallDescription').value = productData.smallDescription;
            document.getElementById('fullDescription').value = productData.fullDescription;
            document.getElementById('price').value = productData.price;
            document.getElementById('stock').value = productData.stock;
            
            // Technical specs
            document.getElementById('modelNumber').value = productData.techSpecs.modelNumber;
            document.getElementById('modelType').value = productData.techSpecs.modelType;
            document.getElementById('material').value = productData.techSpecs.material;
            document.getElementById('size').value = productData.techSpecs.size;
            document.getElementById('weight').value = productData.techSpecs.weight;

            // Key features
            const keyFeaturesContainer = document.getElementById('keyFeaturesContainer');
            keyFeaturesContainer.innerHTML = ''; // Clear the default one
            
            productData.key_features.forEach((feature, index) => {
                const div = document.createElement('div');
                div.classList.add('flex', 'space-x-2');
                
                div.innerHTML = `
                    <input type="text" name="key_features[]" placeholder="Key feature" required
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value="${feature}">
                    <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                `;
                
                keyFeaturesContainer.appendChild(div);
            });

            // Current image
            const currentImagesContainer = document.getElementById('currentImages');
            currentImagesContainer.innerHTML = ''; // Clear container
            
            const div = document.createElement('div');
            div.classList.add('image-preview', 'relative', 'w-20', 'h-20', 'rounded-md', 'overflow-hidden', 'border', 'border-gray-200');
            
            div.innerHTML = `
                <img src="${productData.image.url}" class="w-full h-full object-cover">
                <button type="button" onclick="removeExistingImage(this, '${productData.image.public_id}')" 
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                <input type="hidden" name="existing_image" value="${productData.image.public_id}">
            `;
            
            currentImagesContainer.appendChild(div);
        }

        function removeExistingImage(button, imageId) {
            if (confirm('Are you sure you want to remove this image?')) {
                // Create a hidden input to mark this image for deletion
                const deleteInput = document.createElement('input');
                deleteInput.type = 'hidden';
                deleteInput.name = 'deleted_image';
                deleteInput.value = imageId;
                
                // Add it to the form
                document.getElementById('productForm').appendChild(deleteInput);
                
                // Remove the image preview
                button.parentElement.remove();
            }
        }

        function deleteProduct() {
            if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                // In a real application, you would submit a delete request to your backend
                fetch(`/seller/product/${document.getElementById('productId').value}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/seller/products';
                    } else {
                        alert('Failed to delete product');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the product');
                });
            }
        }