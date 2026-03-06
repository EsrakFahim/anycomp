import { Loader2 } from "lucide-react";
import { Button } from "../../../../Components/Button/Button";
import { formatNumber } from "../../../../lib/formatNumber";

interface PriceCardProps {
    basePrice: number;
    platformFee: number;
    finalPrice: number;
    isPlatformFeeLoading: boolean;
    isPublishEnabled: () => boolean;
    setIsDrawerOpen: (open: boolean) => void;
    handlePublishClick: () => void;
}

export const PriceCard = ({
    basePrice,
    platformFee,
    finalPrice,
    isPlatformFeeLoading,
    isPublishEnabled,
    setIsDrawerOpen,
    handlePublishClick,
}: PriceCardProps) => {
    return (
        <div className="md:col-span-1">
            <div className="flex gap-2 mb-5">
                <Button
                    type="button"
                    variant="outline"
                    className="bg-secondary text-white px-4 sm:px-10 py-3 sm:py-5 flex-1"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    Edit
                </Button>

                <Button
                    type="button"
                    className="bg-primary text-white px-4 sm:px-10 py-3 sm:py-5 flex-1"
                    onClick={handlePublishClick}
                    disabled={isPublishEnabled()}
                >
                    Publish
                </Button>
            </div>
            <div className="rounded-lg p-4 sm:p-8 shadow-2xl h-fit">
                <h3 className="text-3xl font-semibold">Professional Fee</h3>
                <p className="text-textSecondary text-xs">Set a rate for your service</p>
                <div className="text-3xl font-normal mb-4 flex items-center justify-center my-10">
                    <span className="border-b">RM {formatNumber(basePrice) || 0}</span>
                </div>
                <div className="text-sm space-y-2 border-b border-border/20 pb-4">
                    <div className="flex justify-between">
                        <span className="text-textPrimary">Base price</span>
                        <span className="font-semibold">RM {formatNumber(basePrice) || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-textPrimary">Service Processing Fee</span>
                        <span className="font-semibold">
                            {isPlatformFeeLoading ? (
                                <Loader2 className="inline w-4 h-4 animate-spin" />
                            ) : (
                                `RM ${formatNumber(platformFee) || 0}`
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-textPrimary">Total</span>
                        <span className="font-semibold">RM {formatNumber(finalPrice) || 0}</span>
                    </div>
                </div>
                <div className="flex justify-between text-sm mt-4">
                    <span className="text-textPrimary">Your Returns</span>
                    <span className="font-semibold">RM {formatNumber(basePrice) || 0}</span>
                </div>
            </div>
        </div>
    );
};
