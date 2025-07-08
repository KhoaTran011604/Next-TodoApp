import React, { useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

import Pagination from "rc-pagination";

const MyPagination = (props) => {
  const { filterPage, setFilterPage, totalRecords = 15 } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật state
    setFilterPage({ ...filterPage, page: page });
  };
  const handlePageSizeChange = (current, newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset về trang 1 khi đổi pageSize
  };
  useEffect(() => {
    setCurrentPage(filterPage.page);
    setPageSize(filterPage.pageSize);
  }, [filterPage]);
  return (
    <div className="flex justify-end">
      <div className="flex items-center justify-between gap-2 px-6 py-4 sm:justify-normal">
        <Pagination
          total={totalRecords} // Tổng số item
          pageSize={pageSize} // Số item mỗi trang
          locale={{
            items_per_page: "/ page",
            jump_to: "go to",
            jump_to_confirm: "Confirm",
            page: "Page",
            prev_page: "Prev",
            next_page: "Next",
          }}
          showQuickJumper // Bật ô nhập số trang nhảy nhanh
          showTitle={false}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger // ✅ Bật dropdown chọn pageSize
          pageSizeOptions={[5, 10, 15]} // ✅ Hiển thị các lựa chọn 5, 10, 15
          onShowSizeChange={(current, size) =>
            handlePageSizeChange(current, size)
          }
          className="flex gap-2 items-center dark:text-white  "
          itemRender={(page, type) => {
            if (type === "prev")
              return (
                <button className="dark:text-white cursor-pointer flex items-center justify-center  h-9 w-20  rounded-lg  hover:bg-brand-500 hover:text-blue-500 dark:hover:text-white">
                  <div className="rotate-180">
                    <FaLongArrowAltRight  />
                  </div>
                  {"Next"}
                </button>
              );
            if (type === "next")
              return (
                <button className="dark:text-white cursor-pointer flex items-center justify-center  h-9 w-20  rounded-lg  hover:bg-brand-500 hover:text-blue-500 dark:hover:text-white">
                  {"Prev"}
                  <FaLongArrowAltRight  />
                </button>
              );
            return (
              <div
                className={`dark:text-white cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg  hover:bg-brand-500 hover:text-blue-500 dark:hover:text-white ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : ""
                }`}
              >
                {page}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MyPagination;