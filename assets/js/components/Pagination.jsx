import React from 'react'

//  <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} onPageChanged={handlePageChange} />

 const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {

    const pageCount = length / itemsPerPage;
    const pagesForPagination = Math.ceil(pageCount); 
    const pages = [];
    for(let i=1; i<=pagesForPagination; i++){
        pages.push(i);
    }

     return ( 
        <div>
        <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && " disabled")}>
            <button className="page-link" onClick={() => onPageChanged(currentPage-1)}>&laquo;</button>
            </li>
            {pages.map( page => 
               <a className={"page-item" + (currentPage===page && " active")} key={page}>
                <button className="page-link" onClick={() => onPageChanged(page)}>{page}</button>
                </a> 
            )}
            
            <li className={"page-item" + (currentPage === pagesForPagination  && " disabled")}>
            <button className="page-link" onClick={()=> onPageChanged(currentPage+1)}>&raquo;</button>
            </li>
        </ul>
        </div>
      );
 }

 Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start+itemsPerPage);
 };
  
 export default Pagination;