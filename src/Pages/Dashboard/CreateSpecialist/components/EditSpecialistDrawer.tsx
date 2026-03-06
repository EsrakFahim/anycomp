import { Loader2, X } from "lucide-react";
import { Input } from "../../../../Components/Input/Input";
import clsx from "clsx";

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

interface EditSpecialistDrawerProps {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
    register: any;
    watchValues: any;
    isPlatformFeeLoading: boolean;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (open: boolean) => void;
    servicesOffered: any;
    toggleOption: (id: string) => void;
    handleSaveAsDraft: () => void;
    isLoadingSubmit: boolean;
    isSaveEnabled: () => boolean;
    isEditMode: boolean;
    hasAtLeastOneImage: () => boolean;
}

export const EditSpecialistDrawer = ({
    isDrawerOpen,
    setIsDrawerOpen,
    register,
    watchValues,
    isPlatformFeeLoading,
    isDropdownOpen,
    setIsDropdownOpen,
    servicesOffered,
    toggleOption,
    handleSaveAsDraft,
    isLoadingSubmit,
    isSaveEnabled,
    isEditMode,
    hasAtLeastOneImage,
}: EditSpecialistDrawerProps) => {
    return (
        <>
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl p-6 transition-transform duration-300 z-50",
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold">Edit Details</h2>
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto h-full pr-2 pb-20">
                    {/* Title */}
                    <div>
                        <label className="text-sm">Title</label>
                        <Input {...register("title", { required: true })} />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm">Description</label>
                        <textarea
                            {...register("description", { required: true })}
                            className="w-full border rounded-md p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            rows={4}
                        />
                        <span className="text-xs text-gray-500 flex items-center justify-end mt-0">
                            (500 words)
                        </span>
                    </div>

                    {/* Duration dropdown */}
                    <div>
                        <label className="text-sm">Duration (Days)</label>
                        <select
                            {...register("duration_days", { valueAsNumber: true })}
                            className="w-full border border-border/60 rounded-md p-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {DURATION_OPTIONS.map((days) => (
                                <option key={days} value={days}>
                                    {days} {days === 1 ? "day" : "days"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Base Price */}
                    <div>
                        <label className="text-sm">Base Price (RM)</label>
                        <div className="flex items-center border border-border/60 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                            <span className="px-3 py-2 bg-gray-50 text-sm flex items-center justify-center">
                                🇲🇾 MYR
                            </span>
                            <Input
                                type="number"
                                step="0.01"
                                {...register("base_price")}
                                className="border-none focus:ring-0 flex-1"
                            />
                        </div>
                    </div>

                    {/* Platform Fee - read-only with loader */}
                    <div>
                        <label className="text-sm">Platform Fee (RM)</label>
                        <div className="flex items-center border border-border/60 rounded-md overflow-hidden bg-gray-50">
                            <span className="px-3 py-2 bg-gray-50 text-sm flex items-center justify-center">
                                🇲🇾 MYR
                            </span>
                            <div className="flex-1 px-3 py-2 text-sm text-gray-700 flex items-center">
                                {isPlatformFeeLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                ) : (
                                    watchValues.platform_fee?.toFixed(2) || "0.00"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Offerings Dropdown */}
                    <div className="relative">
                        <label className="text-sm block mb-2">Additional Offerings</label>

                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full border border-border/60 rounded-md p-2 text-left bg-white flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                            <span>
                                {watchValues.additional_offerings?.length
                                    ? `${watchValues.additional_offerings.length} selected`
                                    : "Select options"}
                            </span>
                            <span className="text-gray-400">▼</span>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="absolute z-20 mt-1 w-full bg-white border border-border/60 rounded-md shadow-xl max-h-60 overflow-auto">
                                    {servicesOffered?.map((opt: any) => {
                                        const selected = watchValues.additional_offerings?.includes(opt.id);
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => toggleOption(opt.id)}
                                                className={clsx(
                                                    "flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                                                    selected && "bg-gray-100"
                                                )}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">{opt.title}</p>
                                                    <p className="text-xs text-gray-500">{opt.description}</p>
                                                </div>
                                                {selected && <span className="text-green-600 font-semibold">✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                            </>
                        )}

                        {watchValues.additional_offerings && watchValues.additional_offerings.length > 0 && (
                            <ul className="flex flex-wrap items-center gap-2 mt-3">
                                {watchValues.additional_offerings.map((id: string) => {
                                    const offering = servicesOffered?.find((o: any) => o.id === id);
                                    return offering ? (
                                        <li
                                            key={id}
                                            className="bg-gray-100 px-3 py-1.5 rounded-md text-xs flex items-center gap-1"
                                        >
                                            <span>{offering.title}</span>
                                            <X
                                                onClick={() => toggleOption(id)}
                                                className="cursor-pointer text-gray-400 hover:text-gray-600"
                                                size={14}
                                            />
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Drawer action buttons */}
                    <div className="flex items-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleSaveAsDraft}
                            className="w-full bg-primary text-white px-10 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoadingSubmit || !isSaveEnabled()}
                        >
                            {isLoadingSubmit ? (isEditMode ? "Updating..." : "Saving...") : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="w-full bg-gray-300 text-gray-700 px-10 py-3 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoadingSubmit}
                        >
                            Cancel
                        </button>
                    </div>

                    {!hasAtLeastOneImage() && (
                        <p className="text-xs text-error text-center mt-2">
                            At least one image is required before saving
                        </p>
                    )}
                </div>
            </div>

            {isDrawerOpen && (
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-40"
                />
            )}
        </>
    );
};
