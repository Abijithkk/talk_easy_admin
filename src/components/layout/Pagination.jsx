import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { getPageNumbers } from '@/lib/utils';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';

export function DataTablePagination({ table }) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePageSizeChange = (value) => {
    table.setPageSize(Number(value));
  };

  const goToFirstPage = () => table.setPageIndex(0);
  const goToPreviousPage = () => table.previousPage();
  const goToPage = (pageNumber) => table.setPageIndex(pageNumber - 1);
  const goToNextPage = () => table.nextPage();
  const goToLastPage = () => table.setPageIndex(table.getPageCount() - 1);

  return (
    <div className="flex items-center justify-between">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-700">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 bg-[#FFFF]">  
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="edit"
            className="h-8 w-8 p-0"
            onClick={goToFirstPage}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="edit"
            className="h-8 w-8 p-0"
            onClick={goToPreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {pageNumbers.map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span key={index} className="px-2 text-sm">...</span>
            ) : (
              <Button
                key={index}
                variant={currentPage === pageNumber ? "default" : "edit"}
                className="h-8 w-8 p-0 text-sm"
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          ))}

          <Button
            variant="edit"
            className="h-8 w-8 p-0"
            onClick={goToNextPage}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="edit"
            className="h-8 w-8 p-0"
            onClick={goToLastPage}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}