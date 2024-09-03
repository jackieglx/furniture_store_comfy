import {redirect, useLoaderData} from 'react-router-dom';
import {toast} from 'react-toastify';
import {customFetch} from '../utils';
import {OrdersList, ComplexPaginationContainer, SectionTitle} from '../components';

export const ordersQuery = (params, user) => {
    return {
        queryKey: [
            'orders',
            user.username,
            params.page ? parseInt(params.page) : 1,
        ],
        queryFn: () =>
            customFetch.get('/orders', {
                params,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }),
    };
};



export const loader = (store, queryClient) => async ({request}) => {
    const user = store.getState().userState.user;
    if (!user){
        toast.warn('You must logged in to view orders');
        return redirect('/login');
    }
    const params = Object.fromEntries(
        [...new URL(request.url).searchParams.entries()]
    );
    try {
        // const response = await customFetch.get('/orders', {
        //     params,
        //     headers: {
        //         Authorization: `Bearer ${user.token}`
        //     }
        // })
        const response = await queryClient.ensureQueryData(ordersQuery(params, user));
        return {orders: response.data.data, meta: response.data.meta};
    } catch (e) {
        const errorMessage = e?.response?.data?.error?.message || 'there was an error';
        toast.error(errorMessage);
        // the following code is to prevent the expired token
        if (e?.response?.status === 401 || 403) return redirect('/login');
        return null;
    }
};

const Orders = () => {
    const { meta } = useLoaderData();
    if (meta.pagination.total === 0) {
        return <SectionTitle text='Please make an order' />;
    }
    return (
        <>
            <SectionTitle text='Your Orders' />
            <OrdersList />
            <ComplexPaginationContainer />
        </>
    )
}
export default Orders
