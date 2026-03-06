/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../../Components/Button/Button";
import { Input } from "../../../Components/Input/Input";
import {
      useCreateSpecialistMutation,
      useGetServicesOfferedQuery,
      useGetSingleSpecialistQuery,
      useUpdateSpecialistMutation,
      useLazyGetPlatformFeeOnPriceQuery,
} from "../../../redux/features/specialist/specialistApi";
import clsx from "clsx";
import imageUploadIcon from "../../../assets/image_uploader.png";
import { Info, X, Loader2 } from "lucide-react";
import { formatNumber } from "../../../Components/Utils/formatNumber";

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

interface SpecialistFormInputs {
      title: string;
      description: string;
      slug: string;
      base_price: number;
      platform_fee: number;
      final_price: number;
      duration_days: number;
      is_draft: boolean;
      additional_offerings: string[];
}

const SpecialistForm = () => {
      const { id } = useParams<{ id: string }>();
      const isEditMode = !!id;
      const navigate = useNavigate();

      // Fetch all available service offerings
      const { data: servicesOffered, isLoading: isLoadingServices } = useGetServicesOfferedQuery({});
      // Fetch specialist data if in edit mode
      const { data: specialist, isLoading: isLoadingSpecialist } = useGetSingleSpecialistQuery(id, {
            skip: !isEditMode,
      });

      const [getPlatformFee, { isLoading: isPlatformFeeLoading }] = useLazyGetPlatformFeeOnPriceQuery();

      const [createSpecialist, { isLoading: isCreating }] = useCreateSpecialistMutation();
      const [updateSpecialist, { isLoading: isUpdating }] = useUpdateSpecialistMutation();

      const isLoadingSubmit = isCreating || isUpdating;

      const { register, handleSubmit, watch, setValue, reset, formState } = useForm<SpecialistFormInputs>({
            defaultValues: {
                  title: "The Title goes here",
                  description: "The Description goes here.",
                  additional_offerings: [],
                  slug: "the-title-goes-here",
                  duration_days: 1,
                  base_price: 0,
                  platform_fee: 0,
                  final_price: 0,
                  is_draft: false,
            },
      });

      const { isDirty } = formState; // Track if form has unsaved changes for edit mode

      const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
      const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
      const [keepMediaIds, setKeepMediaIds] = useState<string[]>([]);

      const [isDrawerOpen, setIsDrawerOpen] = useState(false);
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [showPublishModal, setShowPublishModal] = useState(false);

      const watchValues = watch();
      const basePrice = watchValues.base_price;

      // Debounce base price to avoid excessive API calls
      const [debouncedBasePrice, setDebouncedBasePrice] = useState(basePrice);

      useEffect(() => {
            const timer = setTimeout(() => {
                  setDebouncedBasePrice(basePrice);
            }, 500);
            return () => clearTimeout(timer);
      }, [basePrice]);

      // Fetch platform fee when debounced base price changes
      useEffect(() => {
            const fetchPlatformFee = async () => {
                  if (!debouncedBasePrice || Number(debouncedBasePrice) <= 0) {
                        setValue("platform_fee", 0);
                        setValue("final_price", 0);
                        return;
                  }

                  try {
                        const response = await getPlatformFee({ price: debouncedBasePrice }).unwrap();
                        // response.data contains platform_fee_percentage
                        if (response?.data?.platform_fee_percentage) {
                              const feePercentage = Number(response.data.platform_fee_percentage);
                              const fee = (Number(debouncedBasePrice) * feePercentage) / 100;
                              setValue("platform_fee", fee);
                        } else {
                              setValue("platform_fee", 0);
                        }
                  } catch (error) {
                        console.error("Failed to fetch platform fee", error);
                        toast.error("Failed to calculate platform fee");
                        setValue("platform_fee", 0);
                  }
            };

            fetchPlatformFee();
      }, [debouncedBasePrice, getPlatformFee, setValue]);

      // Auto‑calculate final price whenever base_price or platform_fee changes
      useEffect(() => {
            const base = Number(watchValues.base_price) || 0;
            const fee = Number(watchValues.platform_fee) || 0;
            setValue("final_price", base + fee);
      }, [watchValues.base_price, watchValues.platform_fee, setValue]);

      // Load existing data into form when edit mode and data is available
      useEffect(() => {
            if (isEditMode && specialist && servicesOffered) {
                  // Map service offerings to their IDs (UUIDs) from the nested serviceOffering object
                  const offeringIds = specialist.serviceOfferings
                        ?.map((so: any) => so.serviceOffering?.id)
                        .filter(Boolean) || [];

                  reset({
                        title: specialist.title,
                        description: specialist.description || "",
                        slug: specialist.slug,
                        base_price: Number(specialist.base_price),
                        platform_fee: Number(specialist.platform_fee),
                        final_price: Number(specialist.final_price),
                        duration_days: specialist.duration_days,
                        is_draft: specialist.is_draft,
                        additional_offerings: offeringIds,
                  });

                  // Handle media – use the full URL from file_name
                  if (specialist.media?.length) {
                        const sorted = [...specialist.media].sort((a, b) => a.display_order - b.display_order);
                        const mediaIds: string[] = [];
                        sorted.slice(0, 3).forEach((media, idx) => {
                              mediaIds.push(media.id);
                              setPreviews((prev) => {
                                    const newPreviews = [...prev];
                                    newPreviews[idx] = media.file_name; // full Cloudinary URL
                                    return newPreviews;
                              });
                        });
                        setKeepMediaIds(mediaIds);
                  }
            }
      }, [isEditMode, specialist, servicesOffered, reset]);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
            if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setImageFiles((prev) => {
                        const newFiles = [...prev];
                        newFiles[slotIndex] = file;
                        return newFiles;
                  });
                  if (previews[slotIndex]) URL.revokeObjectURL(previews[slotIndex]!);
                  setPreviews((prev) => {
                        const newPreviews = [...prev];
                        newPreviews[slotIndex] = URL.createObjectURL(file);
                        return newPreviews;
                  });
                  if (keepMediaIds[slotIndex]) {
                        setKeepMediaIds((prev) => prev.filter((_, idx) => idx !== slotIndex));
                  }
            }
      };

      const removeImage = (slotIndex: number) => {
            setImageFiles((prev) => {
                  const newFiles = [...prev];
                  newFiles[slotIndex] = null;
                  return newFiles;
            });
            setPreviews((prev) => {
                  const newPreviews = [...prev];
                  if (newPreviews[slotIndex]) {
                        URL.revokeObjectURL(newPreviews[slotIndex]!);
                        newPreviews[slotIndex] = null;
                  }
                  return newPreviews;
            });
            if (keepMediaIds[slotIndex]) {
                  setKeepMediaIds((prev) => prev.filter((_, idx) => idx !== slotIndex));
            }
      };

      useEffect(() => {
            return () => {
                  previews.forEach((preview) => {
                        if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
                  });
            };
      }, [previews]);

      const toggleOption = (id: string) => {
            const current = watchValues.additional_offerings || [];
            const newSelection = current.includes(id)
                  ? current.filter((item) => item !== id)
                  : [...current, id];
            setValue("additional_offerings", newSelection);
      };

      const hasAtLeastOneImage = (): boolean => {
            return keepMediaIds.length > 0 || imageFiles.some((file) => file !== null);
      };

      const onSubmit = async (data: SpecialistFormInputs, draftStatus: boolean) => {
            if (!hasAtLeastOneImage()) {
                  toast.error("At least one image is required");
                  return;
            }

            try {
                  const formData = new FormData();

                  data.is_draft = draftStatus;

                  Object.entries(data).forEach(([key, value]) => {
                        if (key === "additional_offerings") {
                              formData.append(key, JSON.stringify(value));
                        } else {
                              formData.append(key, String(value));
                        }
                  });

                  if (!isEditMode) {
                        formData.append("verification_status", "pending");
                        formData.append("is_verified", "false");
                        formData.append("average_rating", "0");
                        formData.append("total_number_of_reviews", "0");
                  }

                  imageFiles.forEach((file) => {
                        if (file) formData.append("media", file);
                  });
                  if (isEditMode && keepMediaIds.length > 0) {
                        formData.append("existing_media", JSON.stringify(keepMediaIds));
                  }

                  if (isEditMode) {
                        await updateSpecialist({ id, formData }).unwrap();
                        toast.success(draftStatus ? "Specialist saved as draft" : "Specialist published successfully");
                  } else {
                        await createSpecialist(formData).unwrap();
                        toast.success(draftStatus ? "Specialist saved as draft" : "Specialist published successfully");
                  }
                  navigate("/specialists");
            } catch (err) {
                  toast.error(draftStatus ? "Failed to save draft" : "Failed to publish specialist");
                  console.error(err);
            }
      };

      const handleSaveAsDraft = handleSubmit((data) => onSubmit(data, true));
      const handlePublish = handleSubmit((data) => onSubmit(data, false));

      const handlePublishClick = () => {
            if (!hasAtLeastOneImage()) {
                  toast.error("At least one image is required before publishing");
                  return;
            }
            if (isEditMode && !specialist?.is_draft && !isDirty) {
                  return;
            }
            setShowPublishModal(true);
      };

      const confirmPublish = () => {
            setShowPublishModal(false);
            handlePublish();
      };

      const isPublishEnabled = (): boolean => {
            if (isLoadingSubmit) return false;
            if (!hasAtLeastOneImage()) return false;
            if (!isEditMode) return true;
            return specialist?.is_draft ? isDirty : true;
      };

      const isSaveEnabled = (): boolean => {
            if (isLoadingSubmit) return false;
            return hasAtLeastOneImage();
      };

      if (isEditMode && (isLoadingSpecialist || isLoadingServices)) {
            return (
                  <div className="flex justify-center items-center h-96">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
            );
      }

      return (
            <section className="relative w-full px-4 sm:px-6">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold">
                              {watchValues.title || (isEditMode ? "Edit Specialist" : "Create Specialist")}
                        </h1>
                  </div>

                  {/* MAIN GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* LEFT SIDE */}
                        <div className="md:col-span-2 space-y-4">
                              {/* 3-IMAGE UPLOAD GRID */}
                              <div className="">
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

                                    {!hasAtLeastOneImage() && (
                                          <p className="text-xs text-error mt-2">At least one image is required</p>
                                    )}
                              </div>

                              {/* DESCRIPTION PREVIEW */}
                              <div className="border-b border-border/20 py-10">
                                    <h2 className="font-semibold mb-2">Description</h2>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                          {watchValues.description ||
                                                "A Company Secretary Represents a Key Role in Any Business. This is Why"}
                                    </p>
                              </div>

                              {/* ADDITIONAL OFFERINGS PREVIEW */}
                              <div className="border-b border-border/20 py-10">
                                    <h2 className="font-semibold mb-2">Additional Offerings</h2>
                                    {watchValues.additional_offerings && watchValues.additional_offerings.length > 0 ? (
                                          <ul className="flex flex-wrap items-center gap-3 text-gray-600 mt-5">
                                                {watchValues.additional_offerings.map((id) => {
                                                      const offering = servicesOffered?.find((o: any) => o.id === id);
                                                      return offering ? (
                                                            <li
                                                                  key={id}
                                                                  className="bg-gray-100 px-3 py-2 rounded-md text-xs whitespace-nowrap flex items-center gap-1"
                                                            >
                                                                  <strong>{offering.title}</strong>
                                                                  <X
                                                                        onClick={() => toggleOption(id)}
                                                                        className="cursor-pointer text-gray-400 hover:text-gray-600"
                                                                        size={14}
                                                                  />
                                                            </li>
                                                      ) : null;
                                                })}
                                          </ul>
                                    ) : (
                                          <p className="text-sm text-gray-600">No additional offerings selected.</p>
                                    )}
                              </div>
                        </div>

                        {/* RIGHT SIDE PRICE CARD */}
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
                                          <span className="border-b">RM {formatNumber(watchValues.base_price) || 0}</span>
                                    </div>
                                    <div className="text-sm space-y-2 border-b border-border/20 pb-4">
                                          <div className="flex justify-between">
                                                <span className="text-textPrimary">Base price</span>
                                                <span className="font-semibold">RM {formatNumber(watchValues.base_price) || 0}</span>
                                          </div>
                                          <div className="flex justify-between">
                                                <span className="text-textPrimary">Service Processing Fee</span>
                                                <span className="font-semibold">
                                                      {isPlatformFeeLoading ? (
                                                            <Loader2 className="inline w-4 h-4 animate-spin" />
                                                      ) : (
                                                            `RM ${formatNumber(watchValues.platform_fee) || 0}`
                                                      )}
                                                </span>
                                          </div>
                                          <div className="flex justify-between">
                                                <span className="text-textPrimary">Total</span>
                                                <span className="font-semibold">RM {formatNumber(watchValues.final_price) || 0}</span>
                                          </div>
                                    </div>
                                    <div className="flex justify-between text-sm mt-4">
                                          <span className="text-textPrimary">Your Returns</span>
                                          <span className="font-semibold">RM {formatNumber(watchValues.base_price) || 0}</span>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* RIGHT DRAWER */}
                  <div
                        className={clsx(
                              "fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl p-6 transition-transform duration-300 z-50",
                              isDrawerOpen ? "translate-x-0" : "translate-x-full"
                        )}
                  >
                        <div className="flex justify-between items-center mb-6">
                              <h2 className="font-semibold">Edit Details</h2>
                              <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                    ✕
                              </button>
                        </div>

                        <div className="space-y-4 overflow-y-auto h-full pr-2">
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
                                                {watchValues.additional_offerings.map((id) => {
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
                                          onClick={handleSaveAsDraft}
                                          className="w-full bg-primary text-white px-10 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          disabled={isLoadingSubmit || !isSaveEnabled()}
                                    >
                                          {isLoadingSubmit ? (isEditMode ? "Updating..." : "Saving...") : "Save"}
                                    </button>
                                    <button
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

                  {/* Publish Confirmation Modal */}
                  {showPublishModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                              <div
                                    className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
                                    onClick={() => setShowPublishModal(false)}
                              />
                              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl p-6 mx-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                          <Info /> Publish Changes
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6 whitespace-nowrap">
                                          Do you want to publish these changes? It will appear in the marketplace listing.
                                    </p>
                                    <div className="flex justify-end gap-3">
                                          <Button
                                                variant="outline"
                                                onClick={() => setShowPublishModal(false)}
                                                className="bg-secondary text-white px-10 py-5"
                                          >
                                                Continue Editing
                                          </Button>
                                          <Button
                                                onClick={confirmPublish}
                                                className="bg-primary text-white hover:bg-primary/90 px-10 py-5"
                                                disabled={isLoadingSubmit}
                                          >
                                                Publish
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  )}

                  {isDrawerOpen && (
                        <div
                              onClick={() => setIsDrawerOpen(false)}
                              className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-40"
                        />
                  )}
            </section>
      );
};

export default SpecialistForm;