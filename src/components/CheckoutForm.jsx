import {Form, redirect} from "react-router-dom";
import FormInput from './FormInput';
import SubmitBtn from './SubmitBtn';
import {customFetch, formatPrice} from "../utils/index.jsx";
import {clearCart} from "../features/cart/cartSlice.js";
import {toast} from "react-toastify";

export const action = (store, queryClient)=>async ({request})=>{
    const formData = await request.formData();
    const {name, address} = Object.fromEntries(formData);
    const user = store.getState().userState.user;
    const {cartItems, orderTotal, numItemsInCart} = store.getState().cartState;
    const info = {
        name,
        address,
        numItemsInCart,
        chargeTotal: orderTotal,
        orderTotal:formatPrice(orderTotal),
        cartItems,
    };

    try {
        const response = await customFetch.post('/orders', {data: info}, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
        // remove query
        queryClient.removeQueries(['orders']);

        store.dispatch(clearCart());
        toast.success('Order placed successfully');
        return redirect('/orders');
    } catch (e) {
        const errorMessage = e?.response?.data?.error?.message || 'there was an error placing your order';
        toast.error(errorMessage);
        // the following code is to prevent the expired token
        if (e?.response?.status === 401 || 403) return redirect('/login');
        return null;
    }
}

const CheckoutForm = () => {
    return (
        <Form method='POST' className='flex flex-col gap-y-4'>
            <h4 className='font-medium text-xl'>Shipping Information</h4>
            <FormInput label='first name' name='name' type='text'/>
            <FormInput label='address' name='address' type='text'/>
            <div className='mt-4'>
                <SubmitBtn text='Place Your Order'/>
            </div>
        </Form>
    )
}
export default CheckoutForm;
