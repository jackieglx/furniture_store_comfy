import {useLoaderData, useLocation, useNavigate} from 'react-router-dom';
import ProductsGrid from './ProductsGrid';

const PaginationContainer = () => {
    const {meta} = useLoaderData();
    const {pageCount, page} = meta.pagination;
    // pages =[1,2,3]
    const pages = Array.from({length: pageCount}, (value, index) => {
        return index + 1;
    });
    // console.log('pages = ')
    // console.log(pages);
    const {search, pathname} = useLocation();
    const navigate = useNavigate();

    const handlePageChange = (pageNumber) => {
        const searchParams = new URLSearchParams(search);
        searchParams.set('page', pageNumber);
        navigate(`${pathname}?${searchParams.toString()}`)
    };

    if (pageCount <= 1) return null;

    return (
        <div className='mt-16 flex justify-end'>
            <div className='join'>
                <button
                    className='btn btn-xs sm:btn-md join-item'
                    onClick={() => {
                        let prevPage = page - 1;
                        if (prevPage === 0) prevPage = 1;

                        handlePageChange(prevPage);
                    }}
                >
                    Prev
                </button>
                {pages.map((pageNumber) => {
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={
                                `btn btn-xs sm:btn-md join-item 
                            ${pageNumber === page ? 'bg-base-300 border-base-300' : ''}`
                            }
                        >
                            {pageNumber}
                        </button>
                    );
                })}
                <button
                    className='btn btn-xs sm:btn-md join-item'
                    onClick={() => {
                        let nextPage = page + 1;
                        if (nextPage > pageCount) nextPage = pageCount;
                        handlePageChange(nextPage);
                    }}
                >
                    Next
                </button>
            </div>

        </div>
    )
}
export default PaginationContainer;
