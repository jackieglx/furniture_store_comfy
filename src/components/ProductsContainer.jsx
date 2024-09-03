import ProductsList from './ProductsList';
import ProductsGrid from "./ProductsGrid.jsx";
import {useLoaderData} from "react-router-dom";
import {useState} from "react";
import {BsFillGridFill, BsList} from "react-icons/bs";

const ProductsContainer = () => {
    // meta是{categories:[], pagination:{}, companies:[]}
    const {meta} = useLoaderData();
    // console.log('meta = ');
    // console.log(meta)
    const totalProducts = meta.pagination.total;
    const [layout, setLayout] = useState('grid');
    // 下面这个setActiveStyles决定button亮不亮（也就是当前用户选中的是哪个button）
    const setActiveStyles = (pattern) => {
        return `text-xl btn btn-circle btn-sm 
        ${pattern === layout ? 'btn-primary text-primary-content' : 'btn-ghost text-base-content'}`;
    };

    return (
        <>
            <div className='flex justify-between items-center mt-8 border-b border-base-300 pb-5'>
                <h4 className='font-medium text-md'>
                    {totalProducts} product{totalProducts > 1 && 's'}
                </h4>
                <div className='flex gap-x-2'>
                    <button
                        onClick={() => setLayout('grid')}
                        className={setActiveStyles('grid')}
                    >
                        <BsFillGridFill/>
                    </button>
                    <button
                        onClick={() => setLayout('list')}
                        className={setActiveStyles('list')}
                    >
                        <BsList/>
                    </button>
                </div>
            </div>

            {/* Products */}
            <div>
                {
                    totalProducts === 0 ? (
                        <h5 className='text-2xl mt-16'>
                            Sorry, no products matched your search...
                        </h5>
                    ) : layout === 'grid' ? (
                        <ProductsGrid/>
                    ) : (
                        <ProductsList/>
                    )
                }
            </div>
        </>
    )
}
export default ProductsContainer;
