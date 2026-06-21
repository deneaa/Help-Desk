import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TicketTableSection from "../features/tickets/TicketTableSection";
import { useTicketsCategory } from "../hooks/useTicketsCategory";
import type { Category } from "../types";

const TicketsCategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const raw = searchParams.get("page");
    const parsed = Number(raw);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [searchParams]);

  const size = 10;

  const normalizedCategory = useMemo(() => {
    return (category?.toUpperCase() as Category) ?? "";
  }, [category]);

  const { stats, totalPages, loading, error } = useTicketsCategory(
    normalizedCategory,
    page,
    size,
  );

  const pagesArray = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i);
  }, [totalPages]);

  const handlePageChange = (i: number) => {
    setSearchParams({ page: String(i) });
  };

  if (!category) return <p>Category not found</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <TicketTableSection title={`${category} tickets`} tickets={stats} />

      <div className="flex gap-2 mt-6 justify-center">
        {pagesArray.map((i) => {
          const isActive = page === i;

          return (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                border shadow-sm
                ${
                  isActive
                    ? "bg-violet-600 text-white border-violet-600 shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TicketsCategoryPage;
