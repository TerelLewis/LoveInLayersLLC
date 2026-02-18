/**
 * Love In Layers - Baking Calculator
 * A tool for calculating ingredient quantities and pricing for various serving sizes
 */

// Ingredient ID counter for unique IDs
let ingredientIdCounter = 1;

// State management
const state = {
    ingredients: [],
    baseServings: 12,
    targetServings: 12,
    hoursWorked: 0,
    hourlyRate: 15,
    overheadCost: 0,
    profitMargin: 30
};

// DOM Elements
const elements = {
    baseServings: document.getElementById('baseServings'),
    targetServings: document.getElementById('targetServings'),
    scaleFactor: document.getElementById('scaleFactor'),
    ingredientName: document.getElementById('ingredientName'),
    ingredientAmount: document.getElementById('ingredientAmount'),
    ingredientUnit: document.getElementById('ingredientUnit'),
    packageSize: document.getElementById('packageSize'),
    packageUnit: document.getElementById('packageUnit'),
    packageCost: document.getElementById('packageCost'),
    addIngredientBtn: document.getElementById('addIngredientBtn'),
    ingredientsList: document.getElementById('ingredientsList'),
    emptyState: document.getElementById('emptyState'),
    ingredientsTable: document.getElementById('ingredientsTable'),
    totalIngredientCost: document.getElementById('totalIngredientCost'),
    costPerServing: document.getElementById('costPerServing'),
    hoursWorked: document.getElementById('hoursWorked'),
    hourlyRate: document.getElementById('hourlyRate'),
    totalLaborCost: document.getElementById('totalLaborCost'),
    overheadCost: document.getElementById('overheadCost'),
    laborCostDisplay: document.getElementById('laborCostDisplay'),
    overheadCostDisplay: document.getElementById('overheadCostDisplay'),
    totalProductionCost: document.getElementById('totalProductionCost'),
    profitMargin: document.getElementById('profitMargin'),
    marginPercent: document.getElementById('marginPercent'),
    totalCostDisplay: document.getElementById('totalCostDisplay'),
    costPerServingDisplay: document.getElementById('costPerServingDisplay'),
    sellingPrice: document.getElementById('sellingPrice'),
    profitPerServing: document.getElementById('profitPerServing'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    loadSampleBtn: document.getElementById('loadSampleBtn'),
    exportBtn: document.getElementById('exportBtn')
};

/**
 * Initialize the application
 */
function init() {
    loadFromLocalStorage();
    attachEventListeners();
    updateUI();
}

/**
 * Generate a unique ingredient ID
 */
function generateIngredientId() {
    return ingredientIdCounter++;
}

/**
 * Initialize the ID counter based on existing ingredients
 */
function initializeIdCounter() {
    if (state.ingredients.length > 0) {
        const maxId = Math.max(...state.ingredients.map(ing => ing.id));
        ingredientIdCounter = maxId + 1;
    }
}

/**
 * Attach event listeners to DOM elements
 */
function attachEventListeners() {
    // Serving size changes
    elements.baseServings.addEventListener('input', handleServingsChange);
    elements.targetServings.addEventListener('input', handleServingsChange);

    // Add ingredient
    elements.addIngredientBtn.addEventListener('click', handleAddIngredient);

    // Allow Enter key to add ingredient
    const ingredientInputs = [
        elements.ingredientName,
        elements.ingredientAmount,
        elements.packageSize,
        elements.packageCost
    ];
    ingredientInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddIngredient();
            }
        });
    });

    // Labor inputs
    elements.hoursWorked.addEventListener('input', handleLaborChange);
    elements.hourlyRate.addEventListener('input', handleLaborChange);
    elements.overheadCost.addEventListener('input', handlePricingChange);
    elements.profitMargin.addEventListener('input', handlePricingChange);

    // Action buttons
    elements.clearAllBtn.addEventListener('click', handleClearAll);
    elements.loadSampleBtn.addEventListener('click', handleLoadSample);
    elements.exportBtn.addEventListener('click', handleExport);

    // Event delegation for dynamically created ingredient elements
    // Handle remove button clicks
    elements.ingredientsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-danger')) {
            const id = parseInt(e.target.dataset.ingredientId);
            handleRemoveIngredient(id);
        }
    });

    // Handle editable input changes
    elements.ingredientsList.addEventListener('change', (e) => {
        if (e.target.classList.contains('editable-input')) {
            const id = parseInt(e.target.dataset.ingredientId);
            const field = e.target.dataset.field;
            handleEditIngredient(id, field, e.target.value);
        }
    });
}

/**
 * Handle serving size changes
 */
function handleServingsChange() {
    state.baseServings = Math.max(1, parseFloat(elements.baseServings.value) || 1);
    state.targetServings = Math.max(1, parseFloat(elements.targetServings.value) || 1);
    updateUI();
    saveToLocalStorage();
}

/**
 * Handle adding a new ingredient
 */
function handleAddIngredient() {
    const name = elements.ingredientName.value.trim();
    const amount = parseFloat(elements.ingredientAmount.value);
    const unit = elements.ingredientUnit.value;
    const packageSize = parseFloat(elements.packageSize.value);
    const packageUnit = elements.packageUnit.value;
    const packageCost = parseFloat(elements.packageCost.value) || 0;

    if (!name) {
        alert('Please enter an ingredient name.');
        elements.ingredientName.focus();
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        elements.ingredientAmount.focus();
        return;
    }

    if (isNaN(packageSize) || packageSize <= 0) {
        alert('Please enter a valid package size.');
        elements.packageSize.focus();
        return;
    }

    const ingredient = {
        id: generateIngredientId(),
        name,
        amount,
        unit,
        packageSize,
        packageUnit,
        packageCost
    };

    state.ingredients.push(ingredient);
    clearIngredientInputs();
    updateUI();
    saveToLocalStorage();
    elements.ingredientName.focus();
}

/**
 * Clear ingredient input fields
 */
function clearIngredientInputs() {
    elements.ingredientName.value = '';
    elements.ingredientAmount.value = '';
    elements.packageSize.value = '';
    elements.packageCost.value = '';
}

/**
 * Handle editing an ingredient
 */
function handleEditIngredient(id, field, value) {
    const ingredient = state.ingredients.find(ing => ing.id === id);
    if (ingredient) {
        if (field === 'amount' || field === 'packageSize' || field === 'packageCost') {
            ingredient[field] = parseFloat(value) || 0;
        } else {
            ingredient[field] = value;
        }
        updateUI();
        saveToLocalStorage();
    }
}

/**
 * Handle removing an ingredient
 */
function handleRemoveIngredient(id) {
    state.ingredients = state.ingredients.filter(ing => ing.id !== id);
    updateUI();
    saveToLocalStorage();
}

/**
 * Handle labor input changes
 */
function handleLaborChange() {
    state.hoursWorked = parseFloat(elements.hoursWorked.value) || 0;
    state.hourlyRate = parseFloat(elements.hourlyRate.value) || 0;
    updateUI();
    saveToLocalStorage();
}

/**
 * Handle pricing input changes
 */
function handlePricingChange() {
    state.overheadCost = parseFloat(elements.overheadCost.value) || 0;
    state.profitMargin = parseFloat(elements.profitMargin.value) || 0;
    
    // Validate profit margin
    if (state.profitMargin < 0) {
        showNotification('Warning: Negative profit margin detected. You will lose money on each sale.', 'warning');
    } else if (state.profitMargin < 10) {
        showNotification('Warning: Very low profit margin. Consider increasing to ensure sustainability.', 'warning');
    } else if (state.profitMargin > 200) {
        showNotification('Warning: Very high profit margin. This may make your products difficult to sell.', 'warning');
    }
    
    updateUI();
    saveToLocalStorage();
}

/**
 * Handle clearing all ingredients
 */
function handleClearAll() {
    if (state.ingredients.length === 0) {
        return;
    }
    if (confirm('Are you sure you want to clear all ingredients?')) {
        state.ingredients = [];
        updateUI();
        saveToLocalStorage();
    }
}

/**
 * Handle loading sample recipe
 */
function handleLoadSample() {
    const sampleIngredients = [
        { id: generateIngredientId(), name: 'All-Purpose Flour', amount: 2.5, unit: 'cups', packageSize: 20, packageUnit: 'cups', packageCost: 4.99 },
        { id: generateIngredientId(), name: 'Granulated Sugar', amount: 1.5, unit: 'cups', packageSize: 10, packageUnit: 'cups', packageCost: 3.49 },
        { id: generateIngredientId(), name: 'Butter (unsalted)', amount: 1, unit: 'cups', packageSize: 2, packageUnit: 'cups', packageCost: 5.99 },
        { id: generateIngredientId(), name: 'Eggs', amount: 3, unit: 'each', packageSize: 12, packageUnit: 'each', packageCost: 4.29 },
        { id: generateIngredientId(), name: 'Vanilla Extract', amount: 2, unit: 'tsp', packageSize: 24, packageUnit: 'tsp', packageCost: 8.99 },
        { id: generateIngredientId(), name: 'Baking Powder', amount: 2, unit: 'tsp', packageSize: 60, packageUnit: 'tsp', packageCost: 3.49 },
        { id: generateIngredientId(), name: 'Milk', amount: 1, unit: 'cups', packageSize: 4, packageUnit: 'cups', packageCost: 2.49 },
        { id: generateIngredientId(), name: 'Salt', amount: 0.5, unit: 'tsp', packageSize: 156, packageUnit: 'tsp', packageCost: 1.29 }
    ];

    state.ingredients = sampleIngredients;
    state.baseServings = 12;
    state.targetServings = 12;
    state.hoursWorked = 1;
    state.hourlyRate = 15;
    state.overheadCost = 5;
    state.profitMargin = 35;

    elements.baseServings.value = state.baseServings;
    elements.targetServings.value = state.targetServings;
    elements.hoursWorked.value = state.hoursWorked;
    elements.hourlyRate.value = state.hourlyRate;
    elements.overheadCost.value = state.overheadCost;
    elements.profitMargin.value = state.profitMargin;

    updateUI();
    saveToLocalStorage();
}

/**
 * Handle exporting recipe
 */
function handleExport() {
    const scaleFactor = getScaleFactor();
    const calculations = calculatePricing();

    let exportText = `Love In Layers - Recipe Export\n`;
    exportText += `${'='.repeat(40)}\n\n`;
    exportText += `Base Servings: ${state.baseServings}\n`;
    exportText += `Target Servings: ${state.targetServings}\n`;
    exportText += `Scale Factor: ${scaleFactor.toFixed(2)}x\n\n`;

    exportText += `INGREDIENTS (Scaled)\n`;
    exportText += `${'-'.repeat(40)}\n`;
    state.ingredients.forEach(ing => {
        const scaledQty = (ing.amount * scaleFactor).toFixed(2);
        const costPerUnit = ing.packageSize > 0 ? ing.packageCost / ing.packageSize : 0;
        const totalCost = (ing.amount * scaleFactor * costPerUnit).toFixed(2);
        exportText += `${ing.name}: ${scaledQty} ${ing.unit} (Pkg: ${ing.packageSize} ${ing.packageUnit} @ $${ing.packageCost.toFixed(2)}) - $${totalCost}\n`;
    });

    exportText += `\nLABOR\n`;
    exportText += `${'-'.repeat(40)}\n`;
    exportText += `Hours Worked: ${state.hoursWorked}\n`;
    exportText += `Hourly Rate: $${state.hourlyRate.toFixed(2)}\n`;
    exportText += `Total Labor Cost: $${calculations.laborCost.toFixed(2)}\n`;

    exportText += `\nCOST SUMMARY\n`;
    exportText += `${'-'.repeat(40)}\n`;
    exportText += `Total Ingredient Cost: $${calculations.totalIngredientCost.toFixed(2)}\n`;
    exportText += `Labor Cost: $${calculations.laborCost.toFixed(2)}\n`;
    exportText += `Overhead/Packaging Cost: $${state.overheadCost.toFixed(2)}\n`;
    exportText += `Total Production Cost: $${calculations.totalProductionCost.toFixed(2)}\n`;
    exportText += `Cost per Serving: $${calculations.costPerServing.toFixed(2)}\n\n`;

    exportText += `PROFIT MARGINS\n`;
    exportText += `${'-'.repeat(40)}\n`;
    exportText += `Profit Margin: ${state.profitMargin}%\n`;
    exportText += `Total Cost: $${calculations.totalProductionCost.toFixed(2)}\n`;
    exportText += `Cost per Serving: $${calculations.costPerServing.toFixed(2)}\n`;
    exportText += `Sell At (${state.profitMargin}% margin): $${calculations.sellingPrice.toFixed(2)}\n`;
    exportText += `Profit per Serving: $${calculations.profitPerServing.toFixed(2)}\n`;

    // Create download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Calculate the scale factor
 */
function getScaleFactor() {
    return state.targetServings / state.baseServings;
}

/**
 * Calculate pricing information
 */
function calculatePricing() {
    const scaleFactor = getScaleFactor();

    // Calculate total ingredient cost based on package pricing
    const totalIngredientCost = state.ingredients.reduce((sum, ing) => {
        const costPerUnit = ing.packageSize > 0 ? ing.packageCost / ing.packageSize : 0;
        return sum + (ing.amount * scaleFactor * costPerUnit);
    }, 0);

    // Calculate labor cost
    const laborCost = state.hoursWorked * state.hourlyRate;

    // Calculate total production cost
    const totalProductionCost = totalIngredientCost + laborCost + state.overheadCost;

    // Calculate cost per serving
    const costPerServing = state.targetServings > 0 ? totalProductionCost / state.targetServings : 0;

    // Calculate selling price with profit margin
    const sellingPrice = totalProductionCost * (1 + state.profitMargin / 100);

    // Calculate price per serving
    const pricePerServing = state.targetServings > 0 ? sellingPrice / state.targetServings : 0;

    // Calculate profit per serving
    const profitPerServing = pricePerServing - costPerServing;

    // Calculate expected total profit
    const expectedProfit = sellingPrice - totalProductionCost;

    return {
        totalIngredientCost,
        laborCost,
        totalProductionCost,
        costPerServing,
        sellingPrice,
        pricePerServing,
        profitPerServing,
        expectedProfit
    };
}

/**
 * Update the entire UI
 */
function updateUI() {
    updateScaleFactor();
    updateIngredientsTable();
    updatePricingDisplay();
}

/**
 * Update the scale factor display
 */
function updateScaleFactor() {
    const scaleFactor = getScaleFactor();
    elements.scaleFactor.textContent = `${scaleFactor.toFixed(2)}x`;
}

/**
 * Update the ingredients table
 */
function updateIngredientsTable() {
    const scaleFactor = getScaleFactor();

    if (state.ingredients.length === 0) {
        elements.emptyState.style.display = 'block';
        elements.ingredientsTable.style.display = 'none';
        return;
    }

    elements.emptyState.style.display = 'none';
    elements.ingredientsTable.style.display = 'table';

    elements.ingredientsList.innerHTML = state.ingredients.map(ing => {
        const scaledQty = (ing.amount * scaleFactor).toFixed(2);
        const costPerUnit = ing.packageSize > 0 ? ing.packageCost / ing.packageSize : 0;
        const totalCost = (ing.amount * scaleFactor * costPerUnit).toFixed(2);

        return `
            <tr data-id="${ing.id}">
                <td>${escapeHtml(ing.name)}</td>
                <td>
                    <input type="number" 
                           class="editable-input" 
                           value="${ing.amount}" 
                           min="0" 
                           step="0.01"
                           data-ingredient-id="${ing.id}"
                           data-field="amount"
                           aria-label="Amount for ${escapeHtml(ing.name)}">
                </td>
                <td>${escapeHtml(ing.unit)}</td>
                <td>
                    <input type="number" 
                           class="editable-input" 
                           value="${ing.packageSize}" 
                           min="0" 
                           step="0.01"
                           data-ingredient-id="${ing.id}"
                           data-field="packageSize"
                           aria-label="Package size for ${escapeHtml(ing.name)}">
                </td>
                <td>${escapeHtml(ing.packageUnit)}</td>
                <td>
                    <input type="number" 
                           class="editable-input" 
                           value="${ing.packageCost.toFixed(2)}" 
                           min="0" 
                           step="0.01"
                           data-ingredient-id="${ing.id}"
                           data-field="packageCost"
                           aria-label="Package cost for ${escapeHtml(ing.name)}">
                </td>
                <td><strong>${scaledQty}</strong></td>
                <td>$${totalCost}</td>
                <td>
                    <button class="btn btn-danger" data-ingredient-id="${ing.id}" aria-label="Remove ${escapeHtml(ing.name)}">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update the pricing display
 */
function updatePricingDisplay() {
    const calculations = calculatePricing();

    // Update labor display
    elements.totalLaborCost.textContent = `$${calculations.laborCost.toFixed(2)}`;

    // Update cost summary section
    elements.totalIngredientCost.textContent = `$${calculations.totalIngredientCost.toFixed(2)}`;
    elements.laborCostDisplay.textContent = `$${calculations.laborCost.toFixed(2)}`;
    elements.overheadCostDisplay.textContent = `$${state.overheadCost.toFixed(2)}`;
    elements.totalProductionCost.textContent = `$${calculations.totalProductionCost.toFixed(2)}`;
    elements.costPerServing.textContent = `$${calculations.costPerServing.toFixed(2)}`;

    // Update profit margins section
    elements.marginPercent.textContent = state.profitMargin;
    elements.totalCostDisplay.textContent = `$${calculations.totalProductionCost.toFixed(2)}`;
    elements.costPerServingDisplay.textContent = `$${calculations.costPerServing.toFixed(2)}`;
    elements.sellingPrice.textContent = `$${calculations.sellingPrice.toFixed(2)}`;
    elements.profitPerServing.textContent = `$${calculations.profitPerServing.toFixed(2)}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show a notification message to the user
 */
function showNotification(message, type = 'warning') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = '⚠️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✗';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

/**
 * Save state to local storage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('bakingCalculator', JSON.stringify(state));
    } catch (e) {
        console.warn('Unable to save to local storage:', e);
        showNotification('Unable to save your data. Your changes may not be preserved when you close the browser.', 'error');
    }
}

/**
 * Load state from local storage
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('bakingCalculator');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);

            // Update input values from loaded state
            elements.baseServings.value = state.baseServings;
            elements.targetServings.value = state.targetServings;
            elements.hoursWorked.value = state.hoursWorked;
            elements.hourlyRate.value = state.hourlyRate;
            elements.overheadCost.value = state.overheadCost;
            elements.profitMargin.value = state.profitMargin;
            
            // Initialize ID counter based on loaded ingredients
            initializeIdCounter();
        }
    } catch (e) {
        console.warn('Unable to load from local storage:', e);
        showNotification('Unable to load your saved data. Starting with a fresh calculator.', 'warning');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
