import React from 'react'
import {ProductsGrid, SectionTitle} from "./index.js";

const FeaturedProducts = () => {
    return (
        <div className='pt-24 '>
            <SectionTitle text='featured products'/>
            <ProductsGrid/>
        </div>
    )
}
export default FeaturedProducts;
