/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../Components/Badge/Badge";
import { Checkbox } from "../../../Components/Checkbox/Checkbox";
import { Input } from "../../../Components/Input/Input";
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from "../../../Components/Tabale/Table";
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
import { Button } from "../../../Components/Button/Button";
import { Link } from "react-router-dom";
import {
      useGetSpecialistsQuery,
      useExportSpecialistsMutation,
      useDeleteSpecialistMutation,
} from "../../../redux/features/specialist/specialistApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const getApprovalStatusConfig = (status: string) => {
      switch (status) {
            case "verified":
                  return {
                        bg: "bg-success/20",
                        text: "text-success",
                        label: "Verified",
                  };
            case "pending":
                  return {
                        bg: "bg-pending/30",
                        text: "text-primary",
                        label: "Pending",
                  };
            case "rejected":
                  return {
                        bg: "bg-error/20",
                        text: "text-error",
                        label: "Rejected",
                  };
            default:
                  return {
                        bg: "bg-gray-100",
                        text: "text-textPrimary",
                        label: status,
                  };
      }
};

const getPublishStatusConfig = (isDraft: boolean) => {
      if (!isDraft) {
            return {
                  bg: "bg-primary",
                  text: "text-white",
                  label: "Published",
            };
      }
      return {
            bg: "bg-textSecondary/20",
            text: "text-textSecondary",
            label: "Draft",
      };
};

const formatNumber = (num: number) => {
      if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
      }
      return num;
};

export const AllSpecialists = () => {
      const navigate = useNavigate();
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
                        {/* Header */}
                        <div className="space-y-2">
                              <h1 className="font-bold text-textHighlight text-base sm:text-lg tracking-tight">
                                    Specialists
                              </h1>
                              <p className="font-normal text-textSecondary text-xs sm:text-sm">
                                    Create and publish your services for Client&apos;s &amp; Companies
                              </p>
                        </div>

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

                              {/* Actions Bar - Stack on mobile */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                                    <Input
                                          placeholder="Search services..."
                                          className="w-full sm:max-w-xs h-10 bg-bgPrimary border-gray-200 font-normal text-sm text-textPrimary rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                    <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
                                          <Link
                                                to="/specialists/create"
                                                className="flex justify-center items-center h-10 bg-primary hover:bg-primary/90 rounded-md px-4 gap-2 transition-colors text-white flex-1 sm:flex-initial"
                                          >
                                                <PlusIcon className="w-4 h-4" />
                                                <span className="font-medium text-white text-sm">Create Service</span>
                                          </Link>
                                          <Button
                                                variant="outline"
                                                className="h-10 border-primary text-primary hover:bg-primary/5 rounded-md px-4 gap-2 transition-colors flex-1 sm:flex-initial"
                                                onClick={handleExport}
                                                disabled={isExporting}
                                          >
                                                {isExporting ? (
                                                      <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                      <DownloadIcon className="w-4 h-4" />
                                                )}
                                                <span className="font-medium text-sm">Export</span>
                                          </Button>
                                    </div>
                              </div>

                              {/* Table Content */}
                              <TabsContent value={activeTab} className="mt-0 space-y-4">
                                    <div className="border border-gray-200 rounded-lg">
                                          {/* Horizontal scroll on small screens */}
                                          <div className="overflow-x-auto">
                                                <Table>
                                                      <TableHeader>
                                                            <TableRow className="border-b border-gray-200 bg-bgPrimary">
                                                                  <TableHead className="w-12 py-3">
                                                                        <Checkbox className="w-4 h-4 bg-bgPrimary border-gray-300" />
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap">
                                                                        SERVICE
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap">
                                                                        PRICE
                                                                  </TableHead>
                                                                  {/* Hide on small screens */}
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap hidden sm:table-cell">
                                                                        PURCHASES
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap hidden md:table-cell">
                                                                        DURATION
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap">
                                                                        APPROVAL STATUS
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap hidden lg:table-cell">
                                                                        PUBLISH STATUS
                                                                  </TableHead>
                                                                  <TableHead className="font-semibold text-textSecondary text-sm py-3 whitespace-nowrap">
                                                                        ACTIONS
                                                                  </TableHead>
                                                            </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                            {specialists.map((service: any) => {
                                                                  const approvalConfig = getApprovalStatusConfig(
                                                                        service.verification_status
                                                                  );
                                                                  const publishConfig = getPublishStatusConfig(service.is_draft);

                                                                  return (
                                                                        <TableRow
                                                                              key={service.id}
                                                                              className="relative border-b border-gray-100 hover:bg-bgPrimary/50 transition-colors"
                                                                        >
                                                                              <TableCell className="py-3">
                                                                                    <Checkbox className="w-4 h-4 bg-bgPrimary border-gray-300" />
                                                                              </TableCell>
                                                                              <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                                    <div
                                                                                          className="max-w-[150px] sm:max-w-[200px] truncate"
                                                                                          title={service.title}
                                                                                    >
                                                                                          {service.title}
                                                                                    </div>
                                                                              </TableCell>
                                                                              <TableCell className="font-normal text-textPrimary text-sm py-3 whitespace-nowrap">
                                                                                    RM {service.final_price}
                                                                              </TableCell>
                                                                              <TableCell className="font-normal text-textPrimary text-sm py-3 hidden sm:table-cell whitespace-nowrap">
                                                                                    <span className="font-medium">
                                                                                          {formatNumber(service.total_number_of_reviews || 0)}
                                                                                    </span>
                                                                              </TableCell>
                                                                              <TableCell className="font-normal text-textPrimary text-sm py-3 hidden md:table-cell whitespace-nowrap">
                                                                                    {service.duration_days} Days
                                                                              </TableCell>
                                                                              <TableCell className="py-3 whitespace-nowrap">
                                                                                    <Badge
                                                                                          className={`${approvalConfig.bg} ${approvalConfig.text} font-medium text-xs rounded-full px-3 py-1 border-0 capitalize`}
                                                                                    >
                                                                                          {approvalConfig.label}
                                                                                    </Badge>
                                                                              </TableCell>
                                                                              <TableCell className="py-3 hidden lg:table-cell whitespace-nowrap">
                                                                                    <Badge
                                                                                          className={`${publishConfig.bg} ${publishConfig.text} font-medium text-xs rounded-full px-3 py-1 border-0 capitalize`}
                                                                                    >
                                                                                          {publishConfig.label}
                                                                                    </Badge>
                                                                              </TableCell>
                                                                              <TableCell className="py-3 relative">
                                                                                    {/* Larger touch target on mobile */}
                                                                                    <Button
                                                                                          variant="ghost"
                                                                                          size="icon"
                                                                                          className="h-10 w-10 sm:h-8 sm:w-8 hover:bg-gray-100 touch-manipulation"
                                                                                          onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                setOpenMenuId(openMenuId === service.id ? null : service.id);
                                                                                          }}
                                                                                    >
                                                                                          <MoreVerticalIcon className="h-5 w-5 sm:h-4 sm:w-4 text-textSecondary" />
                                                                                    </Button>

                                                                                    {openMenuId === service.id && (
                                                                                          <>
                                                                                                {/* Full-screen overlay to close menu when tapping outside */}
                                                                                                <div
                                                                                                      className="fixed inset-0 z-[9998]"
                                                                                                      onClick={() => setOpenMenuId(null)}
                                                                                                />
                                                                                                {/* Dropdown menu - positioned with viewport awareness */}
                                                                                                <div
                                                                                                      className="absolute right-0 sm:right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-200 max-w-[90vw] sm:max-w-none"
                                                                                                      style={{
                                                                                                            // Ensure menu doesn't go off-screen on mobile
                                                                                                            left: window.innerWidth < 640 ? 'auto' : undefined,
                                                                                                            right: window.innerWidth < 640 ? '0' : undefined,
                                                                                                      }}
                                                                                                      onClick={(e) => e.stopPropagation()}
                                                                                                >
                                                                                                      <div className="py-1">
                                                                                                            <button
                                                                                                                  onClick={() => {
                                                                                                                        setOpenMenuId(null);
                                                                                                                        navigate(`/specialists/edit/${service.id}`);
                                                                                                                  }}
                                                                                                                  className="block w-full text-left px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                                                                                                            >
                                                                                                                  Edit
                                                                                                            </button>
                                                                                                            <button
                                                                                                                  onClick={() => openDeleteModal(service.id)}
                                                                                                                  className="block w-full text-left px-4 py-3 sm:py-2 text-sm text-red-600 hover:bg-gray-100 touch-manipulation"
                                                                                                            >
                                                                                                                  Delete
                                                                                                            </button>
                                                                                                      </div>
                                                                                                </div>
                                                                                          </>
                                                                                    )}
                                                                              </TableCell>
                                                                        </TableRow>
                                                                  );
                                                            })}
                                                            {specialists.length === 0 && (
                                                                  <TableRow>
                                                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                                              No specialists found.
                                                                        </TableCell>
                                                                  </TableRow>
                                                            )}
                                                      </TableBody>
                                                </Table>
                                          </div>
                                    </div>

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

                  {/* Delete Confirmation Modal - Responsive */}
                  {deleteModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                              <div className="absolute inset-0 bg-black/40" onClick={handleDeleteCancel} />
                              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 mx-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                          Are you sure you want to delete this specialist? This action cannot be undone.
                                    </p>
                                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                                          <Button
                                                variant="outline"
                                                onClick={handleDeleteCancel}
                                                className="px-4 py-2 w-full sm:w-auto"
                                          >
                                                Cancel
                                          </Button>
                                          <Button
                                                onClick={handleDeleteConfirm}
                                                className="bg-error text-white hover:bg-error/90 px-4 py-2 w-full sm:w-auto"
                                          >
                                                Delete
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  )}
            </section>
      );
};