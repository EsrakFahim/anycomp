/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { MoreVerticalIcon } from "lucide-react";
import { Badge } from "../../../../Components/Badge/Badge";
import { Checkbox } from "../../../../Components/Checkbox/Checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../Components/Table/Table";
import { Button } from "../../../../Components/Button/Button";
import { formatNumber } from "../../../../lib/formatNumber";

const getApprovalStatusConfig = (status: string) => {
    switch (status) {
        case "verified":
            return { bg: "bg-success/20", text: "text-success", label: "Verified" };
        case "pending":
            return { bg: "bg-pending/30", text: "text-primary", label: "Pending" };
        case "rejected":
            return { bg: "bg-error/20", text: "text-error", label: "Rejected" };
        default:
            return { bg: "bg-gray-100", text: "text-textPrimary", label: status };
    }
};

const getPublishStatusConfig = (isDraft: boolean) => {
    if (!isDraft) {
        return { bg: "bg-primary", text: "text-white", label: "Published" };
    }
    return { bg: "bg-textSecondary/20", text: "text-textSecondary", label: "Draft" };
};

interface SpecialistsTableProps {
    specialists: any[];
    openMenuId: string | null;
    setOpenMenuId: (id: string | null) => void;
    openDeleteModal: (id: string) => void;
}

export const SpecialistsTable = ({ specialists, openMenuId, setOpenMenuId, openDeleteModal }: SpecialistsTableProps) => {
    const navigate = useNavigate();

    return (
        <div className="border border-gray-200 rounded-lg">
            <div className="overflow-x-auto overflow-y-visible">
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
                            const approvalConfig = getApprovalStatusConfig(service.verification_status);
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
                                        <div className="max-w-[150px] sm:max-w-[200px] truncate" title={service.title}>
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
                                                <div
                                                    className="fixed inset-0 z-[9998]"
                                                    onClick={() => setOpenMenuId(null)}
                                                />
                                                <div
                                                    className="absolute right-0 bottom-0 w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-200"
                                                    style={{
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
    );
};
