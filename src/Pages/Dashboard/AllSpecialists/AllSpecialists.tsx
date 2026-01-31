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

const servicesData = [
      {
            id: 1,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "20",
            duration: "3 Days",
            approvalStatus: "Approved",
            publishStatus: "Published",
      },
      {
            id: 2,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "0",
            duration: "1 Day",
            approvalStatus: "Under-Review",
            publishStatus: "Published",
      },
      {
            id: 3,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "431",
            duration: "14 Days",
            approvalStatus: "Approved",
            publishStatus: "Not Published",
      },
      {
            id: 4,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "0",
            duration: "7 Days",
            approvalStatus: "Under-Review",
            publishStatus: "Published",
      },
      {
            id: 5,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "1283",
            duration: "4 Days",
            approvalStatus: "Rejected",
            publishStatus: "Not Published",
      },
      {
            id: 6,
            service: "Incorporation of a new company",
            price: "RM 2,000",
            purchases: "9,180",
            duration: "5 Days",
            approvalStatus: "Rejected",
            publishStatus: "Not Published",
      },
];

const getApprovalStatusConfig = (status: string) => {
      switch (status) {
            case "Approved":
                  return {
                        bg: "bg-success/20",
                        text: "text-success",
                        label: status,
                  };
            case "Under-Review":
                  return {
                        bg: "bg-pending/30",
                        text: "text-primary",
                        label: status,
                  };
            case "Rejected":
                  return {
                        bg: "bg-error/20",
                        text: "text-error",
                        label: status,
                  };
            default:
                  return {
                        bg: "bg-gray-100",
                        text: "text-textPrimary",
                        label: status,
                  };
      }
};

const getPublishStatusConfig = (status: string) => {
      if (status === "Published") {
            return {
                  bg: "bg-primary",
                  text: "text-white",
                  label: status,
            };
      }
      return {
            bg: "bg-textSecondary/20",
            text: "text-textSecondary",
            label: status,
      };
};

const formatNumber = (num: string) => {
      const number = parseInt(num.replace(/,/g, ""), 10);
      if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}k`;
      }
      return num;
};

export const AllSpecialists = () => {
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
                                          <Button className="h-10 bg-primary hover:bg-primary/90 rounded-md px-4 gap-2 transition-colors">
                                                <PlusIcon className="w-4 h-4" />
                                                <span className="font-medium text-white text-sm">
                                                      Create Service
                                                </span>
                                          </Button>
                                          <Button
                                                variant="outline"
                                                className="h-10 border-primary text-primary hover:bg-primary/5 rounded-md px-4 gap-2 transition-colors"
                                          >
                                                <DownloadIcon className="w-4 h-4" />
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
                                                      {servicesData.map((service) => {
                                                            const approvalConfig = getApprovalStatusConfig(
                                                                  service.approvalStatus
                                                            );
                                                            const publishConfig = getPublishStatusConfig(
                                                                  service.publishStatus
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
                                                                              <div className="max-w-[200px] truncate" title={service.service}>
                                                                                    {service.service}
                                                                              </div>
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              {service.price}
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              <span className="font-medium">
                                                                                    {formatNumber(service.purchases)}
                                                                              </span>
                                                                        </TableCell>
                                                                        <TableCell className="font-normal text-textPrimary text-sm py-3">
                                                                              {service.duration}
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

                                    {/* Pagination */}
                                    <div className="flex justify-center pt-4">
                                          <Pagination>
                                                <PaginationContent>
                                                      <PaginationItem>
                                                            <PaginationPrevious
                                                                  href="#"
                                                                  className="font-normal text-textPrimary text-sm hover:bg-bgPrimary"
                                                            />
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  className="font-medium text-textPrimary text-sm hover:bg-bgPrimary"
                                                            >
                                                                  1
                                                            </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  isActive
                                                                  className="font-medium text-white text-sm bg-primary hover:bg-primary/90 rounded-md w-9 h-9 flex items-center justify-center"
                                                            >
                                                                  2
                                                            </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  className="font-medium text-textPrimary text-sm hover:bg-bgPrimary"
                                                            >
                                                                  3
                                                      </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  className="font-medium text-textPrimary text-sm hover:bg-bgPrimary"
                                                            >
                                                                  4
                                                            </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  className="font-medium text-textPrimary text-sm hover:bg-bgPrimary"
                                                            >
                                                                  5
                                                            </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationEllipsis className="font-medium text-textPrimary" />
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationLink
                                                                  href="#"
                                                                  className="font-medium text-textPrimary text-sm hover:bg-bgPrimary"
                                                            >
                                                                  10
                                                            </PaginationLink>
                                                      </PaginationItem>
                                                      <PaginationItem>
                                                            <PaginationNext
                                                                  href="#"
                                                                  className="font-normal text-textPrimary text-sm hover:bg-bgPrimary"
                                                            />
                                                      </PaginationItem>
                                                </PaginationContent>
                                          </Pagination>
                                    </div>
                              </TabsContent>

                              {/* Drafts Tab Content */}
                              <TabsContent value="drafts" className="mt-0">
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
                                                      <TableRow>
                                                            <TableCell
                                                                  colSpan={8}
                                                                  className="text-center py-12 font-normal text-textSecondary text-sm"
                                                            >
                                                                  <div className="flex flex-col items-center gap-2">
                                                                        <div className="text-lg">No drafts available</div>
                                                                        <p className="text-sm text-textSecondary">
                                                                              Create your first service draft to get started
                                                                        </p>
                                                                  </div>
                                                            </TableCell>
                                                      </TableRow>
                                                </TableBody>
                                          </Table>
                                    </div>
                              </TabsContent>

                              {/* Published Tab Content */}
                              <TabsContent value="published" className="mt-0">
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
                                                      <TableRow>
                                                            <TableCell
                                                                  colSpan={8}
                                                                  className="text-center py-12 font-normal text-textSecondary text-sm"
                                                            >
                                                                  <div className="flex flex-col items-center gap-2">
                                                                        <div className="text-lg">No published services available</div>
                                                                        <p className="text-sm text-textSecondary">
                                                                              Publish a service to make it available to clients
                                                                        </p>
                                                                  </div>
                                                            </TableCell>
                                                      </TableRow>
                                                </TableBody>
                                          </Table>
                                    </div>
                              </TabsContent>
                        </Tabs>
                  </div>
            </section>
      );
};