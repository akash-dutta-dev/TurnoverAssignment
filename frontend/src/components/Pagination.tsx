export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const generatePageButtons = () => {
    const buttons = [];

    if (currentPage !== 1) {
      // First button
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          {"<<"}&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
      );

      // Previous button
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}&nbsp;&nbsp;
        </button>
      );
    }

    // First page button
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "font-bold" : ""}
      >
        &nbsp;&nbsp;{1}&nbsp;&nbsp;
      </button>
    );

    // Ellipsis for skipping pages
    if (currentPage > 4) {
      buttons.push(<span key="ellipsis1">...</span>);
    }

    // Generate buttons for pages around the current page
    for (
      let i = Math.max(currentPage - 2, 2);
      i <= Math.min(currentPage + 2, totalPages - 1);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "font-bold" : ""}
        >
          &nbsp;&nbsp;
          {i}&nbsp;&nbsp;
        </button>
      );
    }

    // Ellipsis for skipping pages
    if (currentPage < totalPages - 3) {
      buttons.push(<span key="ellipsis2">...</span>);
    }

    // Last page button
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? "font-bold" : ""}
        >
          &nbsp;&nbsp;{totalPages}&nbsp;&nbsp;
        </button>
      );
    }

    if (currentPage !== totalPages) {
      // Next button
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &nbsp;&nbsp;
          {">"}
        </button>
      );

      // Last button
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;
          {">>"}
        </button>
      );
    }

    return buttons;
  };

  return <div className="pagination-container">{generatePageButtons()}</div>;
};

export default Pagination;
