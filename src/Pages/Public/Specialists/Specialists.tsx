/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SpecialistCard } from "./components/SpecialistCard";
import { useGetPublishedSpecialistsQuery } from "../../../redux/features/specialist/specialistApi";
import {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
} from "../../../Components/Pagination/Pagination";
import { Home, Loader2 } from "lucide-react";

const Specialists = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const [search] = useState("");
      const [debouncedSearch, setDebouncedSearch] = useState("");
      const [priceRange] = useState<{ min?: number; max?: number }>({});
      const [sortBy, setSortBy] = useState(""); // e.g., "newest", "price_low", "price_high"
      const limit = 10; // items per page

      // Debounce search input
      useEffect(() => {
            const timer = setTimeout(() => setDebouncedSearch(search), 500);
            return () => clearTimeout(timer);
      }, [search]);

      const { data, isLoading, error } = useGetPublishedSpecialistsQuery({
            page: currentPage,
            limit,
            search: debouncedSearch,
            priceRange,
            sortBy,
      });

      const specialists = data?.data || [];
      const pagination = data?.pagination;

      const handlePageChange = (page: number) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
      };

      // const handlePriceRangeChange = (type: "min" | "max", value: string) => {
      //       const num = value ? Number(value) : undefined;
      //       setPriceRange((prev) => ({ ...prev, [type]: num }));
      //       setCurrentPage(1);
      // };

      const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
      };

      // const clearFilters = () => {
      //       setSearch("");
      //       setDebouncedSearch("");
      //       setPriceRange({});
      //       setSortBy("newest");
      //       setCurrentPage(1);
      // };

      // Generate pagination items with ellipsis
      const renderPaginationItems = () => {
            if (!pagination || pagination.pages <= 1) return null;

            const items = [];
            const totalPages = pagination.pages;
            const current = currentPage;

            // Previous button
            items.push(
                  <PaginationItem key="prev">
                        <PaginationPrevious
                              onClick={() => handlePageChange(current - 1)}
                              className={current === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                  </PaginationItem>
            );

            // Always show first page
            items.push(
                  <PaginationItem key={1}>
                        <PaginationLink onClick={() => handlePageChange(1)} isActive={current === 1}>
                              1
                        </PaginationLink>
                  </PaginationItem>
            );

            // Ellipsis after first if needed
            if (current > 3) {
                  items.push(
                        <PaginationItem key="ellipsis-1">
                              <PaginationEllipsis />
                        </PaginationItem>
                  );
            }

            // Pages around current
            for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
                  if (i === 1 || i === totalPages) continue;
                  items.push(
                        <PaginationItem key={i}>
                              <PaginationLink onClick={() => handlePageChange(i)} isActive={current === i}>
                                    {i}
                              </PaginationLink>
                        </PaginationItem>
                  );
            }

            // Ellipsis before last if needed
            if (current < totalPages - 2) {
                  items.push(
                        <PaginationItem key="ellipsis-2">
                              <PaginationEllipsis />
                        </PaginationItem>
                  );
            }

            // Last page if more than one
            if (totalPages > 1) {
                  items.push(
                        <PaginationItem key={totalPages}>
                              <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={current === totalPages}>
                                    {totalPages}
                              </PaginationLink>
                        </PaginationItem>
                  );
            }

            // Next button
            items.push(
                  <PaginationItem key="next">
                        <PaginationNext
                              onClick={() => handlePageChange(current + 1)}
                              className={current === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                  </PaginationItem>
            );

            return items;
      };

      return (
            <div className="min-h-screen">
                  {/* Main Content */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header */}
                        <div className="space-y-2">
                              {/* Breadcrumb Navigation */}
                              <div className="">
                                    <div className="">
                                          <nav className="flex items-center space-x-2 text-sm text-textSecondary">
                                                <Link to="/" className="hover:text-primary transition-colors">
                                                      <Home
                                                            size={16}
                                                            className="inline-block mr-1"
                                                      />
                                                </Link>
                                                <span>/</span>
                                                <Link to="/" className="hover:text-primary transition-colors">
                                                      Home
                                                </Link>
                                                <span>/</span>
                                                <span className="text-primary font-medium">Specialists</span>
                                          </nav>
                                    </div>
                              </div>
                              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Specialists</h1>
                              <p className="text-textSecondary mt-1 text-sm">Browse our trusted specialists and their services</p>
                        </div>

                        {/* Filters Bar */}
                        <div className="my-6">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Sort */}
                                    <div>
                                          <select
                                                value={sortBy}
                                                onChange={handleSortChange}
                                                className=" border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                                          >
                                                <option value="">Default</option>
                                                <option value="newest">Newest First</option>
                                                <option value="price_asc">Price: Low to High</option>
                                                <option value="price_desc">Price: High to Low</option>
                                          </select>
                                    </div>
                              </div>
                        </div>

                        {/* Specialists Grid */}
                        {isLoading ? (
                              <div className="flex justify-center items-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                              </div>
                        ) : error ? (
                              <div className="text-center py-20 text-red-500">
                                    Failed to load specialists. Please try again later.
                              </div>
                        ) : specialists.length === 0 ? (
                              <div className="text-center py-20 text-gray-500">
                                    No specialists found matching your criteria.
                              </div>
                        ) : (
                              <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                          {specialists.map((specialist: any) => (
                                                <SpecialistCard key={specialist.id} specialist={specialist} />
                                          ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.pages > 1 && (
                                          <div className="mt-8">
                                                <Pagination>
                                                      <PaginationContent>{renderPaginationItems()}</PaginationContent>
                                                </Pagination>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>
            </div>
      );
};

export default Specialists;