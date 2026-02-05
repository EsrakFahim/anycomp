import { DownloadIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
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
import { useGetSpecialistsQuery, useExportSpecialistsMutation } from "../../../redux/features/specialist/specialistApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      const { data: specialists, isLoading, error } = useGetSpecialistsQuery(undefined);
      const [exportSpecialists, { isLoading: isExporting }] = useExportSpecialistsMutation();

      const handleExport = async () => {
            try {
                  const blob = await exportSpecialists().unwrap();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'specialists.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode?.removeChild(link);
                  toast.success("Specialists exported successfully");
            } catch (err) {
                  toast.error("Failed to export specialists");
                  console.error(err);
            }
      };

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
            <section className="w-full mx-auto p-6 bg-bgSecondary rounded-lg shadow-sm border border-gray-100">
                  <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-2">
                              <h1 className="font-bold text-textHighlight text-lg tracking-tight">
                                    Specialists
                              </h1>
                              <p className="font-normal text-textSecondary text-sm">
                                    Create and publish your services for Client&apos;s &amp; Companies
                              </p>
                        </div>

                        {/* Tabs Section */}
                        <Tabs defaultValue="all" className="w-full">
                              <div className="flex items-center justify-between mb-4">
                                    <TabsList className="bg-transparent border-b border-gray-200 rounded-none h-auto p-0">
                                          <TabsTrigger
                                                value="all"
                                                className="font-medium text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 pb-3 transition-colors"
                                          >
                                                All
                                          </TabsTrigger>
                                          <TabsTrigger
                                                value="drafts"
                                                className="font-medium text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 pb-3 transition-colors"
                                          >
                                                Drafts
                                          </TabsTrigger>
                                          <TabsTrigger
                                                value="published"
                                                className="font-medium text-sm text-textSecondary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 pb-3 transition-colors"
                                          >
                                                Published
                                          </TabsTrigger>
                                    </TabsList>
                              </div>

                              {/* Actions Bar */}
                              <div className="flex items-center justify-between gap-4 mb-6">
                                    <Input
                                          placeholder="Search services..."
                                          className="max-w-xs h-10 bg-bgPrimary border-gray-200 font-normal text-sm text-textPrimary rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    />
                                    <div className="flex gap-2">
                                          <Link
                                                to="/specialists/create"
                                                className="h-10 bg-primary hover:bg-primary/90 rounded-md px-4 gap-2 transition-colors flex items-center text-white">
                                                <PlusIcon className="w-4 h-4" />
                                                <span className="font-medium text-white text-sm">
                                                      Create Service
                                                </span>
                                          </Link>
                                          <Button
                                                variant="outline"
                                                className="h-10 border-primary text-primary hover:bg-primary/5 rounded-md px-4 gap-2 transition-colors"
                                                onClick={handleExport}
                                                disabled={isExporting}
                                          >
                                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadIcon className="w-4 h-4" />}
                                                <span className="font-medium text-sm">Export</span>
                                          </Button>
                                    </div>
                              </div>

                              {/* All Tab Content */}
                              <TabsContent value="all" className="mt-0 space-y-4">
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                          <Table>
                                                <TableHeader>
                                                      <TableRow className="border-b border-gray-200 bg-bgPrimary">
                                                            <TableHead className="w-12 py-3">
                                                                  <Checkbox className="w-4 h-4 bg-bgPrimary border-gray-300" />
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  SERVICE
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  PRICE
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  PURCHASES
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  DURATION
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  APPROVAL STATUS
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  PUBLISH STATUS
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-textSecondary text-sm py-3">
                                                                  ACTIONS
                                                            </TableHead>
                                                      </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                      {specialists?.map((service: any) => {
                                                            const approvalConfig = getApprovalStatusConfig(
                                                                  service.verification_status
                                                            );
                                                            const publishConfig = getPublishStatusConfig(
                                                                  service.is_draft
                                                            );

                                                            return (
                                                                  <TableRow
                                                                        key={service.id}
                                                                        className="border-b border-gray-100 hover:bg-bgPrimary/50 transition-colors"
                                                                  >
                                                                        <TableCell className="py-3">
                                                                              <Checkbox className="w-4 h-4 bg-bgPrimary border-gray-300" />
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              <div className="max-w-[200px] truncate" title={service.title}>
                                                                                    {service.title}
                                                                              </div>
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              RM {service.final_price}
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              <span className="font-medium">
                                                                                    {formatNumber(service.total_number_of_reviews || 0)}
                                                                              </span>
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              {service.duration_days} Days
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                              <Badge
                                                                                    className={`${approvalConfig.bg} ${approvalConfig.text} font-medium text-xs rounded-full px-3 py-1 border-0 capitalize`}
                                                                              >
                                                                                    {approvalConfig.label}
                                                                              </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                              <Badge
                                                                                    className={`${publishConfig.bg} ${publishConfig.text} font-medium text-xs rounded-full px-3 py-1 border-0 capitalize`}
                                                                              >
                                                                                    {publishConfig.label}
                                                                              </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="py-3">
                                                                              <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 hover:bg-gray-100"
                                                                              >
                                                                                    <MoreVerticalIcon className="h-4 w-4 text-textSecondary" />
                                                                              </Button>
                                                                        </TableCell>
                                                                  </TableRow>
                                                            );
                                                      })}
                                                </TableBody>
                                          </Table>
                                    </div>
                                    {/* Pagination (Keeping it static for now as simple implementation doesn't support pagination yet) */}
                                    <div className="flex justify-center pt-4">
                                          <Pagination>
                                                <PaginationContent>
                                                      <PaginationItem>
                                                            <PaginationPrevious href="#" className="font-normal text-textPrimary text-sm hover:bg-bgPrimary" />
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink href="#" className="font-medium text-textPrimary text-sm hover:bg-bgPrimary">1</PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationNext href="#" className="font-normal text-textPrimary text-sm hover:bg-bgPrimary" />
                                                      </PaginationItem>
                                                </PaginationContent>
                                          </Pagination>
                                    </div>
                              </TabsContent>

                              {/* Placeholder for other tabs */}
                              <TabsContent value="drafts"><div>Drafts filter not implemented yet</div></TabsContent>
                              <TabsContent value="published"><div>Published filter not implemented yet</div></TabsContent>
                        </Tabs>
                  </div>
            </section>
      );
};