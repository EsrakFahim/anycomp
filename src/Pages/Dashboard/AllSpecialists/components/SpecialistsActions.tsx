import { DownloadIcon, PlusIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../Components/Button/Button";
import { Input } from "../../../../Components/Input/Input";

interface SpecialistsActionsProps {
    handleExport: () => void;
    isExporting: boolean;
}

export const SpecialistsActions = ({ handleExport, isExporting }: SpecialistsActionsProps) => {
    return (
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
    );
};
