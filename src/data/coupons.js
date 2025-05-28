export const coupons = {
    // Percentage discount coupons
    'SAVE10': {
        type: 'percentage',
        value: 10,
        description: '10% off on your order'
    },
    'SAVE20': {
        type: 'percentage',
        value: 20,
        description: '20% off on your order'
    },
    'SAVE30': {
        type: 'percentage',
        value: 30,
        description: '30% off on your order'
    },
    // Free shipping coupons
    'FREESHIP': {
        type: 'free_shipping',
        value: 5, // $5 shipping cost
        description: 'Free shipping on your order'
    },
    'SHIP50': {
        type: 'free_shipping',
        value: 5,
        description: 'Free shipping on your order'
    },
    // First purchase discount
    'FIRST10': {
        type: 'first_purchase',
        value: 10,
        description: '10% off on your first purchase'
    },
    'WELCOME20': {
        type: 'first_purchase',
        value: 20,
        description: '20% off on your first purchase'
    },
    // Fixed amount discount coupons
    'FLAT5': {
        type: 'fixed',
        value: 5,
        description: '$5 off on your order'
    },
    'FLAT10': {
        type: 'fixed',
        value: 10, 
        description: '$10 off on your order'
    },
    'FLAT25': {
        type: 'fixed',
        value: 25,
        description: '$25 off on your order'
    },
    // Category specific coupons
    'TECH15': {
        type: 'category',
        value: 15,
        category: 'electronics',
        description: '15% off on electronics'
    },
    'APPAREL20': {
        type: 'category',
        value: 20,
        category: 'clothing',
        description: '20% off on clothing items'
    },
    'HOME10': {
        type: 'category',
        value: 10,
        category: 'home',
        description: '10% off on home products'
    },
    // Seasonal promotions
    'SUMMER25': {
        type: 'seasonal',
        value: 25,
        expiry: '2023-08-31',
        description: '25% off summer sale'
    },
    'HOLIDAY15': {
        type: 'seasonal',
        value: 15,
        expiry: '2023-12-25',
        description: '15% off holiday special'
    },
    // Minimum purchase required coupons
    'SPEND50': {
        type: 'minimum_purchase',
        value: 10,
        min_amount: 50,
        description: '10% off on orders over $50'
    },
    'SPEND100': {
        type: 'minimum_purchase',
        value: 15,
        min_amount: 100,
        description: '15% off on orders over $100'
    }
};
