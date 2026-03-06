import imageUploadIcon from "../../../../assets/image_uploader.png";

interface ImageUploadSlotsProps {
    previews: (string | null)[];
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => void;
    removeImage: (slotIndex: number) => void;
}

export const ImageUploadSlots = ({
    previews,
    handleFileChange,
    removeImage,
}: ImageUploadSlotsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 h-auto sm:h-100">
            {/* Left large slot - index 0 */}
            <div className="col-span-1 sm:col-span-2 relative group h-48 sm:h-full overflow-hidden rounded-md">
                {previews[0] ? (
                    <img
                        src={previews[0]}
                        alt="Main"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border/40 rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors p-4 text-center">
                        <img src={imageUploadIcon} alt="Upload Icon" className="w-12 h-12 text-textSecondary mb-2" />
                        <span className="text-sm text-gray-500">
                            Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 0)}
                            className="hidden"
                        />
                    </label>
                )}
                {previews[0] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <label className="cursor-pointer text-white text-sm font-medium mr-2">
                            Change
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 0)}
                                className="hidden"
                            />
                        </label>
                        <button
                            onClick={() => removeImage(0)}
                            className="text-white text-sm font-medium hover:text-red-300"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {/* Right column - stacked */}
            <div className="col-span-1 grid grid-rows-2 gap-2 h-auto sm:h-full">
                {/* Top right slot - index 1 */}
                <div className="relative group h-48 sm:h-full overflow-hidden rounded-md">
                    {previews[1] ? (
                        <img
                            src={previews[1]}
                            alt="Secondary 1"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border/40 rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                            <img src={imageUploadIcon} alt="Upload Icon" className="w-12 h-12 text-textSecondary mb-2" />
                            <span className="text-xs text-gray-500">Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 1)}
                                className="hidden"
                            />
                        </label>
                    )}
                    {previews[1] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                            <label className="cursor-pointer text-white text-xs font-medium mr-2">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 1)}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={() => removeImage(1)}
                                className="text-white text-xs font-medium hover:text-red-300"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom right slot - index 2 */}
                <div className="relative group h-48 sm:h-full overflow-hidden rounded-md">
                    {previews[2] ? (
                        <img
                            src={previews[2]}
                            alt="Secondary 2"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border/40 rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                            <img src={imageUploadIcon} alt="Upload Icon" className="w-12 h-12 text-textSecondary mb-2" />
                            <span className="text-xs text-gray-500">Upload</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 2)}
                                className="hidden"
                            />
                        </label>
                    )}
                    {previews[2] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                            <label className="cursor-pointer text-white text-xs font-medium mr-2">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 2)}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={() => removeImage(2)}
                                className="text-white text-xs font-medium hover:text-red-300"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
