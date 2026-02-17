/**
 * Love In Layers - Baking Calculator
 * A tool for calculating ingredient quantities and pricing for various serving sizes
 */

// State management
const state = {
    ingredients: [],
    baseServings: 12,
    targetServings: 12,
    laborCost: 0,
    overheadCost: 0,
    profitMargin: 30
};

// DOM Elements
const elements = {
    baseServings: document.getElementById('baseServings'),
    targetServings: document.getElementById('targetServings'),
    scaleFactor: document.getElementById('scaleFactor'),
    ingredientName: document.getElementById('ingredientName'),
    ingredientQuantity: document.getElementById('ingredientQuantity'),
    ingredientUnit: document.getElementById('ingredientUnit'),
    ingredientCost: document.getElementById('ingredientCost'),
    addIngredientBtn: document.getElementById('addIngredientBtn'),
    ingredientsList: document.getElementById('ingredientsList'),
    emptyState: document.getElementById('emptyState'),
    ingredientsTable: document.getElementById('ingredientsTable'),
    totalIngredientCost: document.getElementById('totalIngredientCost'),
    costPerServing: document.getElementById('costPerServing'),
    laborCost: document.getElementById('laborCost'),
    overheadCost: document.getElementById('overheadCost'),
    profitMargin: document.getElementById('profitMargin'),
    totalProductionCost: document.getElementById('totalProductionCost'),
    sellingPrice: document.getElementById('sellingPrice'),
    pricePerServing: document.getElementById('pricePerServing'),
    expectedProfit: document.getElementById('expectedProfit'),
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
        elements.ingredientQuantity,
        elements.ingredientCost
    ];
    ingredientInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddIngredient();
            }
        });
    });

    // Pricing inputs
    elements.laborCost.addEventListener('input', handlePricingChange);
    elements.overheadCost.addEventListener('input', handlePricingChange);
    elements.profitMargin.addEventListener('input', handlePricingChange);

    // Action buttons
    elements.clearAllBtn.addEventListener('click', handleClearAll);
    elements.loadSampleBtn.addEventListener('click', handleLoadSample);
    elements.exportBtn.addEventListener('click', handleExport);
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
    const quantity = parseFloat(elements.ingredientQuantity.value);
    const unit = elements.ingredientUnit.value;
    const costPerUnit = parseFloat(elements.ingredientCost.value) || 0;

    if (!name) {
        alert('Please enter an ingredient name.');
        elements.ingredientName.focus();
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        elements.ingredientQuantity.focus();
        return;
    }

    const ingredient = {
        id: Date.now(),
        name,
        quantity,
        unit,
        costPerUnit
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
    elements.ingredientQuantity.value = '';
    elements.ingredientCost.value = '';
}

/**
 * Handle editing an ingredient
 */
function handleEditIngredient(id, field, value) {
    const ingredient = state.ingredients.find(ing => ing.id === id);
    if (ingredient) {
        if (field === 'quantity' || field === 'costPerUnit') {
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
 * Handle pricing input changes
 */
function handlePricingChange() {
    state.laborCost = parseFloat(elements.laborCost.value) || 0;
    state.overheadCost = parseFloat(elements.overheadCost.value) || 0;
    state.profitMargin = parseFloat(elements.profitMargin.value) || 0;
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
        { id: Date.now(), name: 'All-Purpose Flour', quantity: 2.5, unit: 'cups', costPerUnit: 0.50 },
        { id: Date.now() + 1, name: 'Granulated Sugar', quantity: 1.5, unit: 'cups', costPerUnit: 0.75 },
        { id: Date.now() + 2, name: 'Butter (unsalted)', quantity: 1, unit: 'cups', costPerUnit: 4.00 },
        { id: Date.now() + 3, name: 'Eggs', quantity: 3, unit: 'each', costPerUnit: 0.35 },
        { id: Date.now() + 4, name: 'Vanilla Extract', quantity: 2, unit: 'tsp', costPerUnit: 0.75 },
        { id: Date.now() + 5, name: 'Baking Powder', quantity: 2, unit: 'tsp', costPerUnit: 0.15 },
        { id: Date.now() + 6, name: 'Milk', quantity: 1, unit: 'cups', costPerUnit: 0.50 },
        { id: Date.now() + 7, name: 'Salt', quantity: 0.5, unit: 'tsp', costPerUnit: 0.05 }
    ];

    state.ingredients = sampleIngredients;
    state.baseServings = 12;
    state.targetServings = 12;
    state.laborCost = 15;
    state.overheadCost = 5;
    state.profitMargin = 35;

    elements.baseServings.value = state.baseServings;
    elements.targetServings.value = state.targetServings;
    elements.laborCost.value = state.laborCost;
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
        const scaledQty = (ing.quantity * scaleFactor).toFixed(2);
        const totalCost = (ing.quantity * scaleFactor * ing.costPerUnit).toFixed(2);
        exportText += `${ing.name}: ${scaledQty} ${ing.unit} - $${totalCost}\n`;
    });

    exportText += `\nCOST SUMMARY\n`;
    exportText += `${'-'.repeat(40)}\n`;
    exportText += `Total Ingredient Cost: $${calculations.totalIngredientCost.toFixed(2)}\n`;
    exportText += `Labor Cost: $${state.laborCost.toFixed(2)}\n`;
    exportText += `Overhead Cost: $${state.overheadCost.toFixed(2)}\n`;
    exportText += `Total Production Cost: $${calculations.totalProductionCost.toFixed(2)}\n`;
    exportText += `Cost per Serving: $${calculations.costPerServing.toFixed(2)}\n\n`;

    exportText += `PRICING\n`;
    exportText += `${'-'.repeat(40)}\n`;
    exportText += `Profit Margin: ${state.profitMargin}%\n`;
    exportText += `Suggested Selling Price: $${calculations.sellingPrice.toFixed(2)}\n`;
    exportText += `Price per Serving: $${calculations.pricePerServing.toFixed(2)}\n`;
    exportText += `Expected Profit: $${calculations.expectedProfit.toFixed(2)}\n`;

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

    // Calculate total ingredient cost
    const totalIngredientCost = state.ingredients.reduce((sum, ing) => {
        return sum + (ing.quantity * scaleFactor * ing.costPerUnit);
    }, 0);

    // Calculate total production cost
    const totalProductionCost = totalIngredientCost + state.laborCost + state.overheadCost;

    // Calculate cost per serving
    const costPerServing = state.targetServings > 0 ? totalProductionCost / state.targetServings : 0;

    // Calculate selling price with profit margin
    const sellingPrice = totalProductionCost * (1 + state.profitMargin / 100);

    // Calculate price per serving
    const pricePerServing = state.targetServings > 0 ? sellingPrice / state.targetServings : 0;

    // Calculate expected profit
    const expectedProfit = sellingPrice - totalProductionCost;

    return {
        totalIngredientCost,
        totalProductionCost,
        costPerServing,
        sellingPrice,
        pricePerServing,
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
        const scaledQty = (ing.quantity * scaleFactor).toFixed(2);
        const totalCost = (ing.quantity * scaleFactor * ing.costPerUnit).toFixed(2);

        return `
            <tr data-id="${ing.id}">
                <td>${escapeHtml(ing.name)}</td>
                <td>
                    <input type="number" 
                           class="editable-input" 
                           value="${ing.quantity}" 
                           min="0" 
                           step="0.01"
                           onchange="handleEditIngredient(${ing.id}, 'quantity', this.value)"
                           aria-label="Base quantity for ${escapeHtml(ing.name)}">
                </td>
                <td>${escapeHtml(ing.unit)}</td>
                <td><strong>${scaledQty}</strong></td>
                <td>
                    <input type="number" 
                           class="editable-input" 
                           value="${ing.costPerUnit.toFixed(2)}" 
                           min="0" 
                           step="0.01"
                           onchange="handleEditIngredient(${ing.id}, 'costPerUnit', this.value)"
                           aria-label="Cost per unit for ${escapeHtml(ing.name)}">
                </td>
                <td>$${totalCost}</td>
                <td>
                    <button class="btn btn-danger" onclick="handleRemoveIngredient(${ing.id})" aria-label="Remove ${escapeHtml(ing.name)}">
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

    elements.totalIngredientCost.textContent = `$${calculations.totalIngredientCost.toFixed(2)}`;
    elements.costPerServing.textContent = `$${calculations.costPerServing.toFixed(2)}`;
    elements.totalProductionCost.textContent = `$${calculations.totalProductionCost.toFixed(2)}`;
    elements.sellingPrice.textContent = `$${calculations.sellingPrice.toFixed(2)}`;
    elements.pricePerServing.textContent = `$${calculations.pricePerServing.toFixed(2)}`;
    elements.expectedProfit.textContent = `$${calculations.expectedProfit.toFixed(2)}`;
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
 * Save state to local storage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('bakingCalculator', JSON.stringify(state));
    } catch (e) {
        console.warn('Unable to save to local storage:', e);
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
            elements.laborCost.value = state.laborCost;
            elements.overheadCost.value = state.overheadCost;
            elements.profitMargin.value = state.profitMargin;
        }
    } catch (e) {
        console.warn('Unable to load from local storage:', e);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
