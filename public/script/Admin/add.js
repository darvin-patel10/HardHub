// Image preview functionality
document.getElementById('productImages').addEventListener('change', function(e) {
    const previewsContainer = document.getElementById('imagePreviews');
    previewsContainer.innerHTML = '';
    
    Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.createElement('div');
            preview.className = 'image-preview relative w-20 h-20 rounded-md overflow-hidden border border-gray-200';
            preview.innerHTML = `
                <img src="${event.target.result}" class="w-full h-full object-cover">
                <button type="button" onclick="removeImage(this)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
            `;
            previewsContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
});

function removeImage(button) {
    button.parentElement.remove();
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 
                    00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
let sizeCount = 0;

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
let specCount = 1;
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
    const sizeInputs = document.querySelectorAll('input[name^="sizes["]');
    let hasSizeData = false;
    sizeInputs.forEach(input => {
        if (input.value.trim()) {
            hasSizeData = true;
        }
    });
    
    if (!hasSizeData) {
        alert('Please add at least one size variation');
        return false;
    }
    
    // Validate images
    const imageInput = document.getElementById('productImages');
    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please upload at least one product image');
        return false;
    }
    
    // Validate image count (max 5)
    if (imageInput.files.length > 5) {
        alert('Maximum 5 images allowed');
        return false;
    }
    
    // If all validations pass, submit the form
    this.submit();
});

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
        document.getElementById('productForm').reset();
        document.getElementById('imagePreviews').innerHTML = '';
        
        // Reset key features to one field
        document.getElementById('keyFeaturesContainer').innerHTML = `
            <div class="flex space-x-2">
                <input type="text" name="key_features[]" placeholder="Key feature" required
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" onclick="removeKeyFeature(this)" class="px-2 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        
        // Reset sizes to one field
        document.getElementById('sizesContainer').innerHTML = `
            <div class="size-input-group grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Size*</label>
                    <input type="number" name="sizes[0][size]" step="0.01" required
                        placeholder="e.g., 6 (inches)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                    <input type="number" name="sizes[0][stock]" min="0" required
                        placeholder="Quantity"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
                    <input type="number" name="sizes[0][price]" step="0.01" min="0" required
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
            </div>
        `;
        
        // Reset specs to one field
        document.getElementById('specsContainer').innerHTML = `
            <div class="flex space-x-2">
                <input type="text" name="specs[key1]" placeholder="Specification name" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input type="text" name="specs[value1]" placeholder="Value" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" onclick="removeSpec(this)" class="px-2 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        
        sizeCount = 0;
        specCount = 1;
    }
}