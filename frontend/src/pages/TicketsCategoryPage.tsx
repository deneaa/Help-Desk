import { useParams, useSearchParams } from "react-router-dom";
import TicketTableSection from "../features/tickets/TicketTableSection";
import { useTicketsCategory } from "../hooks/useTicketsCategory";
import type { Category } from "../types/types";

const TicketsCategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 0);
  const size = 10;

  const normalizedCategory = (category?.toUpperCase() as Category) ?? "";

  const { stats, totalPages, loading, error } = useTicketsCategory(
    normalizedCategory,
    page,
    size,
  );

  if (!category) return <p>Category not found</p>;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <TicketTableSection title={`${category} tickets`} tickets={stats} />

      <div className="flex gap-2 mt-6 justify-center">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isActive = page === i;

          return (
            <button
              key={i}
              onClick={() => setSearchParams({ page: String(i) })}
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
