import {createSlice} from '@reduxjs/toolkit';
import {toast} from 'react-toastify';

const defaultState = {
    cartItems: [],
    numItemsInCart: 0,
    cartTotal: 0,
    shipping: 500,
    tax: 0,
    orderTotal: 0,
};

const getCartFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('cart')) || defaultState;
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: getCartFromLocalStorage(),
    reducers: {
        addItem: (state, action) => {
            const {product} = action.payload;
            const addedItem = state.cartItems.find((item) => item.cartID === product.cartID);
            if (addedItem) {
                addedItem.amount += product.amount;
            } else {
                state.cartItems.push(product);
            }
            state.numItemsInCart += product.amount;
            state.cartTotal += product.amount * product.price;

            cartSlice.caseReducers.calculateTotals(state);

            toast.success('Item added to cart');
        },
        clearCart: (state) => {
            localStorage.setItem('cart', JSON.stringify(defaultState));
            return defaultState;
        },
        removeItem: (state, action) => {
            const {cartID} = action.payload;
            const originalItem = state.cartItems.find((item) => item.cartID === cartID);
            state.cartItems = state.cartItems.filter((item)=>item.cartID !== cartID);
            state.numItemsInCart -= originalItem.amount;
            state.cartTotal -= originalItem.amount * originalItem.price;
            cartSlice.caseReducers.calculateTotals(state);
            toast.error('Item removed to cart');
        },
        editItem: (state, action) => {
            const {cartID, amount} = action.payload;
            const originalItem = state.cartItems.find((item) => item.cartID === cartID);
            // amount代表新的数量，editedItem.amount代表旧的数量
            // 新的数量和旧的数量差几个，购物车的总数就增加多少
            state.numItemsInCart += amount - originalItem.amount;
            // 类似于补差价
            state.cartTotal += originalItem.price * (amount - originalItem.amount);
            originalItem.amount = amount;
            cartSlice.caseReducers.calculateTotals(state);
            toast.success('Cart updated');
        },
        calculateTotals: (state) => {
            state.tax = 0.1 * state.cartTotal;
            state.orderTotal = state.cartTotal + state.shipping + state.tax;
            localStorage.setItem('cart', JSON.stringify(state));
        },
    }
});

export const {
    addItem,
    removeItem,
    editItem,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;