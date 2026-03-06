/* eslint-disable @typescript-eslint/no-explicit-any */
import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
} from "../../../Components/Tabs/Tabs";
import {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
} from "../../../Components/Pagination/Pagination";
import {
      useGetSpecialistsQuery,
      useExportSpecialistsMutation,
      useDeleteSpecialistMutation,
} from "../../../redux/features/specialist/specialistApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SpecialistsHeader } from "./components/SpecialistsHeader";
import { SpecialistsActions } from "./components/SpecialistsActions";
import { SpecialistsTable } from "./components/SpecialistsTable";
import { DeleteSpecialistModal } from "./components/DeleteSpecialistModal";

export const AllSpecialists = () => {
      const [currentPage, setCurrentPage] = useState(1);
      const [activeTab, setActiveTab] = useState("all");
      const itemsPerPage = 10;

      const { data: specialistsData, isLoading, error, refetch } = useGetSpecialistsQuery({
            page: currentPage,
            limit: itemsPerPage,
            is_draft: activeTab === "all" ? undefined : activeTab === "drafts" ? true : false,
      });

      const [exportSpecialists, { isLoading: isExporting }] = useExportSpecialistsMutation();
      const [deleteSpecialist] = useDeleteSpecialistMutation();

      const [openMenuId, setOpenMenuId] = useState<string | null>(null);
      const [deleteModalOpen, setDeleteModalOpen] = useState(false);
      const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

      const handleExport = async () => {
            try {
                  const blob = await exportSpecialists().unwrap();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "specialists.xlsx");
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode?.removeChild(link);
                  toast.success("Specialists exported successfully");
            } catch (err) {
                  toast.error("Failed to export specialists");
                  console.error(err);
            }
      };

      const openDeleteModal = (id: string) => {
            setSelectedDeleteId(id);
            setDeleteModalOpen(true);
            setOpenMenuId(null);
      };

      const handleDeleteConfirm = async () => {
            if (!selectedDeleteId) return;
            try {
                  await deleteSpecialist(selectedDeleteId).unwrap();
                  toast.success("Specialist deleted successfully");
                  setDeleteModalOpen(false);
                  setSelectedDeleteId(null);
                  refetch();
            } catch (err) {
                  toast.error("Failed to delete specialist");
                  console.error(err);
            }
      };

      const handleDeleteCancel = () => {
            setDeleteModalOpen(false);
            setSelectedDeleteId(null);
      };

      const handleTabChange = (value: string) => {
            setActiveTab(value);
            setCurrentPage(1);
      };

      const handlePageChange = (page: number) => {
            setCurrentPage(page);
      };

      const totalPages = specialistsData?.pagination?.pages || 1;
      const specialists = specialistsData?.data || [];

      if (isLoading) {
            return (
                  <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
            );
      }

      if (error) {
            return (
                  <div className="flex justify-center items-center h-96 text-error">
                        Failed to load specialists
                  </div>
            );
      }

      return (
            <section className="w-full mx-auto p-4 sm:p-6 bg-bgSecondary rounded-lg shadow-sm border border-gray-100">
                  <div className="space-y-6">
                        <SpecialistsHeader />

                        {/* Tabs Section */}
                        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
                              <div className="flex items-center justify-between mb-4">
                                    {/* Scrollable tabs on mobile */}
                                    <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-auto p-0 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide">
                                          <TabsTrigger
                                                value="all"
                                                className="font-medium text-xs sm:text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 sm:px-4 pb-3 transition-colors"
                                          >
                                                All
                                          </TabsTrigger>
                                          <TabsTrigger
                                                value="drafts"
                                                className="font-medium text-xs sm:text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 sm:px-4 pb-3 transition-colors"
                                          >
                                                Drafts
                                          </TabsTrigger>
                                          <TabsTrigger
                                                value="published"
                                                className="font-medium text-xs sm:text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 sm:px-4 pb-3 transition-colors"
                                          >
                                                Published
                                          </TabsTrigger>
                                    </TabsList>
                              </div>

                              <SpecialistsActions handleExport={handleExport} isExporting={isExporting} />

                              {/* Table Content */}
                              <TabsContent value={activeTab} className="mt-0 space-y-4">
                                    <SpecialistsTable
                                          specialists={specialists}
                                          openMenuId={openMenuId}
                                          setOpenMenuId={setOpenMenuId}
                                          openDeleteModal={openDeleteModal}
                                    />

                                    {/* Pagination - Responsive */}
                                    {totalPages > 1 && (
                                          <div className="flex justify-center pt-4">
                                                <Pagination>
                                                      <PaginationContent>
                                                            <PaginationItem>
                                                                  <PaginationPrevious
                                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                                        className={
                                                                              currentPage === 1
                                                                                    ? "pointer-events-none opacity-50"
                                                                                    : "cursor-pointer"
                                                                        }
                                                                  />
                                                            </PaginationItem>

                                                            {/* Desktop page numbers */}
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                                  <PaginationItem key={page} className="hidden sm:inline-block">
                                                                        <PaginationLink
                                                                              onClick={() => handlePageChange(page)}
                                                                              isActive={currentPage === page}
                                                                        >
                                                                              {page}
                                                                        </PaginationLink>
                                                                  </PaginationItem>
                                                            ))}

                                                            {/* Mobile compact view */}
                                                            <PaginationItem className="sm:hidden">
                                                                  <PaginationLink isActive>{currentPage}</PaginationLink>
                                                            </PaginationItem>
                                                            {currentPage < totalPages && (
                                                                  <PaginationItem className="sm:hidden">
                                                                        <PaginationEllipsis />
                                                                  </PaginationItem>
                                                            )}
                                                            {currentPage < totalPages && (
                                                                  <PaginationItem className="sm:hidden">
                                                                        <PaginationLink onClick={() => handlePageChange(totalPages)}>
                                                                              {totalPages}
                                                                        </PaginationLink>
                                                                  </PaginationItem>
                                                            )}

                                                            <PaginationItem>
                                                                  <PaginationNext
                                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                                        className={
                                                                              currentPage === totalPages
                                                                                    ? "pointer-events-none opacity-50"
                                                                                    : "cursor-pointer"
                                                                        }
                                                                  />
                                                            </PaginationItem>
                                                      </PaginationContent>
                                                </Pagination>
                                          </div>
                                    )}
                              </TabsContent>
                        </Tabs>
                  </div>

                  <DeleteSpecialistModal
                        isOpen={deleteModalOpen}
                        onCancel={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                  />
            </section>
      );
};