async function updateCartIcon() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartadd?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch cart contents');

        const cart = await response.json();
        const totalItems = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    } catch (error) {
        console.error('Failed to update cart icon:', error);
    }
}

function toggleCartPopup() {
    const popup = document.getElementById('cart-popup');
    popup.classList.toggle('hidden');

    if (!popup.classList.contains('hidden')) {
        fetchCartContents();
    }
}

async function fetchCartContents() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
        const response = await fetch(`https://8ogmb8m09d.execute-api.us-east-1.amazonaws.com/Dev/Cartadd?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch cart contents');

        const cart = 
