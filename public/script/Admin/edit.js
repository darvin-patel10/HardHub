// Additional JavaScript for edit page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form with product data
    loadProductData();
    
    // Setup image upload preview
    setupImageUpload();
});

function loadProductData() {
    // Populate key features
    const keyFeaturesContainer = document.getElementById('keyFeaturesContainer');
    keyFeaturesContainer.innerHTML = '';
    
    if (productData.key_features && productData.key_features.length > 0) {
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
    } else {
        // Add at least one empty key feature
        addKeyFeature();
    }
    
    // Populate size variations
    const sizesContainer = document.getElementById('sizesContainer');
    sizesContainer.innerHTML = '';
    
    if (productData.sizes && productData.sizes.length > 0) {
        productData.sizes.forEach((size, index) => {
            const div = document.createElement('div');
            div.classList.add('size-input-group', 'grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-4');
            
            div.innerHTML = `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Size*</label>
                    <input type="number" name="sizes[${index}][size]" step="0.01" required
                        placeholder="e.g., 6 (inches)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value="${size.size}">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                    <input type="number" name="sizes[${index}][stock]" min="0" required
                        placeholder="Quantity"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value="${size.stock}">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
                    <input type="number" name="sizes[${index}][price]" step="0.01" min="0" required
                        placeholder="Price for this size"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value="${size.price}">
                </div>
                
                <div class="flex items-end">
                    <button type="button" onclick="removeSize(this)" class="px-2 text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;
            
            sizesContainer.appendChild(div);
        });
    } else {
        // Add at least one empty size variation
        addSize();
    }
    
    // Populate additional specifications
    const specsContainer = document.getElementById('specsContainer');
    specsContainer.innerHTML = '';
    
    // Check if specs exist and is an object
    if (existingSpecs && typeof existingSpecs === 'object' && Object.keys(existingSpecs).length > 0) {
        let specIndex = 0;
        for (const [key, value] of Object.entries(existingSpecs)) {
            const div = document.createElement('div');
            div.classList.add('flex', 'space-x-2');
            
            div.innerHTML = `
                <input type="text" name="specs[key${specIndex}]" placeholder="Specification name" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="${key}">
                <input type="text" name="specs[value${specIndex}]" placeholder="Value" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value="${value}">
                <button type="button" onclick="removeSpec(this)" class="px-2 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            
            specsContainer.appendChild(div);
            specIndex++;
        }
    } else {
        // Add at least one empty specification
        addSpec();
    }
    
    // Populate current images
    const currentImagesContainer = document.getElementById('currentImages');
    currentImagesContainer.innerHTML = '';
    
    if (productData.image && productData.image.length > 0) {
        productData.image.forEach((img, index) => {
            const div = document.createElement('div');
            div.classList.add('image-preview', 'relative', 'w-20', 'h-20', 'rounded-md', 'overflow-hidden', 'border', 'border-gray-200');
            
            div.innerHTML = `
                <img src="${img.url}" alt="Product Image ${index + 1}" class="w-full h-full object-cover">
                <button type="button" onclick="removeExistingImage(this, '${img.public_id}')" 
                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                <input type="hidden" name="existing_images[]" value="${img.public_id}">
            `;
            
            currentImagesContainer.appendChild(div);
        });
    }
}

function setupImageUpload() {
    const imageInput = document.getElementById('productImages');
    const previewsContainer = document.getElementById('imagePreviews');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            Array.from(e.target.files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview relative w-20 h-20 rounded-md overflow-hidden border border-gray-200';
                    preview.innerHTML = `
                        <img src="${event.target.result}" class="w-full h-full object-cover">
                        <button type="button" onclick="removeNewImage(this)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    `;
                    previewsContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

function removeNewImage(button) {
    button.parentElement.remove();
}

function removeExistingImage(button, imageId) {
    if (confirm('Are you sure you want to remove this image?')) {
        // Create a hidden input to mark this image for deletion
        const deleteInput = document.createElement('input');
        deleteInput.type = 'hidden';
        deleteInput.name = 'deleted_images[]';
        deleteInput.value = imageId;
        
        // Add it to the form
        document.getElementById('productForm').appendChild(deleteInput);
        
        // Remove the image preview
        button.parentElement.remove();
    }
}

// Add a new key feature input field
function addKeyFeature() {
    const container = document.getElementById("keyFeaturesContainer");

    const div = document.createElement("div");
    div.classList.add("flex", "space-x-2");

    div.innerHTML = `
        <input type="text" name="key_features[]" placeholder="Key feature" required
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    `;

    container.appendChild(div);
}

// Remove a key feature input field
function removeKeyFeature(button) {
    if (document.getElementById('keyFeaturesContainer').children.length > 1) {
        button.parentElement.remove();
    } else {
        alert("At least one key feature is required");
    }
}

// Size Management
let sizeCount = productData.sizes ? productData.sizes.length : 0;

function addSize() {
    sizeCount++;
    const container = document.getElementById("sizesContainer");
    
    const div = document.createElement("div");
    div.classList.add("size-input-group", "grid", "grid-cols-1", "md:grid-cols-4", "gap-4");
    
    div.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Size*</label>
            <input type="number" name="sizes[${sizeCount}][size]" step="0.01" required
                placeholder="e.g., 6 (inches)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
            <input type="number" name="sizes[${sizeCount}][stock]" min="0" required
                placeholder="Quantity"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
            <input type="number" name="sizes[${sizeCount}][price]" step="0.01" min="0" required
                placeholder="Price for this size"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div class="flex items-end">
            <button type="button" onclick="removeSize(this)" class="px-2 text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(div);
}

function removeSize(button) {
    if (document.getElementById('sizesContainer').children.length > 1) {
        button.parentElement.parentElement.remove();
    } else {
        alert("At least one size variation is required");
    }
}

// Specifications management
let specCount = Object.keys(existingSpecs).length;

function addSpec() {
    specCount++;
    const container = document.getElementById('specsContainer');
    const newSpec = document.createElement('div');
    newSpec.className = 'flex space-x-2';
    newSpec.innerHTML = `
        <input type="text" name="specs[key${specCount}]" placeholder="Specification name" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input type="text" name="specs[value${specCount}]" placeholder="Value" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button type="button" onclick="removeSpec(this)" class="px-2 text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    `;
    container.appendChild(newSpec);
}

function removeSpec(button) {
    if (document.getElementById('specsContainer').children.length > 1) {
        button.parentElement.remove();
    } else {
        alert("At least one specification is required");
    }
}

function deleteProduct() {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        const productId = document.getElementById('productId').value;
        
        fetch(`/seller/product/delete/${productId}`, {
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

function resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
        // Reload the page to get original data
        window.location.reload();
    }
}

// Form validation
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
        'productName','category','smallDescription',
        'fullDescription','brand','modelNumber',
        'modelType','material','weight'
    ];
    
    for (const fieldId of requiredFields) {
        const input = document.getElementById(fieldId);
        if (!input || !input.value.trim()) {
            const label = document.querySelector(`label[for="${fieldId}"]`);
            const fieldName = label ? label.textContent.replace('*', '').trim() : fieldId;
            alert(`Please fill in ${fieldName}`);
            input?.focus();
            return false;
        }
    }
    
    // Validate at least one key feature
    const keyFeatures = document.querySelectorAll('input[name="key_features[]"]');
    let hasKeyFeature = false;
    keyFeatures.forEach(feature => {
        if (feature.value.trim()) {
            hasKeyFeature = true;
        }
    });
    
    if (!hasKeyFeature) {
        alert('Please add at least one key feature');
        return false;
    }
    
    // Validate at least one size variation
    const sizeSizeInputs = document.querySelectorAll('input[name^="sizes["][name$="[size]"]');
    let hasSizeData = false;
    sizeSizeInputs.forEach(input => {
        if (input.value.trim()) {
            hasSizeData = true;
        }
    });
    
    if (!hasSizeData) {
        alert('Please add at least one size variation');
        return false;
    }
    
    // Validate at least one image (existing or new)
    const existingImages = document.querySelectorAll('input[name="existing_images[]"]');
    const newImagesInput = document.getElementById('productImages');
    
    if (existingImages.length === 0 && (!newImagesInput.files || newImagesInput.files.length === 0)) {
        alert('Please upload at least one product image or keep existing images');
        return false;
    }
    
    // Validate new image count (max 5 total including existing)
    if (newImagesInput.files) {
        const totalImages = existingImages.length + newImagesInput.files.length;
        if (totalImages > 5) {
            alert('Maximum 5 images allowed in total (existing + new)');
            return false;
        }
    }
    
    // If all validations pass, submit the form
    this.submit();
});