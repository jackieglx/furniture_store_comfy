import {Filters, PaginationContainer, ProductsContainer} from '../components';
import {customFetch} from '../utils';

const url = '/products';

const allProductsQuery = (queryParams) =>{
    const { search, category, company, sort, price, shipping, page } = queryParams;
    return {
        queryKey: ['products', search ?? '', category ?? 'all', company ?? 'all',
            sort ?? 'a-z', price ?? 100000, shipping ?? false, page ?? 1,],
        queryFn: () =>{
            return customFetch(url, {
                params:queryParams,
            })
        }
    }
}
export const loader =(queryClient)=> async ({request}) => {
    // 获取所有query parameters的key value pairs
    // params的格式是{search:'', category:'', ...}
    const params = Object.fromEntries(
        [...new URL(request.url).searchParams.entries()]
    );

    // Axios automatically converts the params object into a query string and appends it to the URL.
    const response = await queryClient.ensureQueryData(allProductsQuery(params));

    // products是[{}, {}, {}]
    const products = response.data.data;
    // meta是{categories:[], pagination:{}, companies:[]}
    const meta = response.data.meta;
    return {products, meta, params};
}

const Products = () => {
    return (
        <>
            <Filters/>
            <ProductsContainer/>
            <PaginationContainer/>
        </>
    )
}
export default Products
