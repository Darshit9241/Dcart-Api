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
    }
};
