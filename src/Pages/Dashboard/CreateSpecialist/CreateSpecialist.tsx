/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
      useCreateSpecialistMutation,
      useGetServicesOfferedQuery,
      useGetSingleSpecialistQuery,
      useUpdateSpecialistMutation,
      useLazyGetPlatformFeeOnPriceQuery,
} from "../../../redux/features/specialist/specialistApi";
import { X } from "lucide-react";
import { ImageUploadSlots } from "./components/ImageUploadSlots";
import { PriceCard } from "./components/PriceCard";
import { EditSpecialistDrawer } from "./components/EditSpecialistDrawer";
import { PublishConfirmModal } from "./components/PublishConfirmModal";

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
                                    <ImageUploadSlots
                                          previews={previews}
                                          handleFileChange={handleFileChange}
                                          removeImage={removeImage}
                                    />
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
                        <PriceCard
                              basePrice={watchValues.base_price}
                              platformFee={watchValues.platform_fee}
                              finalPrice={watchValues.final_price}
                              isPlatformFeeLoading={isPlatformFeeLoading}
                              isPublishEnabled={isPublishEnabled}
                              setIsDrawerOpen={setIsDrawerOpen}
                              handlePublishClick={handlePublishClick}
                        />
                  </div>

                  {/* RIGHT DRAWER */}
                  <EditSpecialistDrawer
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                        register={register}
                        watchValues={watchValues}
                        isPlatformFeeLoading={isPlatformFeeLoading}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        servicesOffered={servicesOffered}
                        toggleOption={toggleOption}
                        handleSaveAsDraft={handleSaveAsDraft}
                        isLoadingSubmit={isLoadingSubmit}
                        isSaveEnabled={isSaveEnabled}
                        isEditMode={isEditMode}
                        hasAtLeastOneImage={hasAtLeastOneImage}
                  />

                  {/* Publish Confirmation Modal */}
                  <PublishConfirmModal
                        showPublishModal={showPublishModal}
                        setShowPublishModal={setShowPublishModal}
                        confirmPublish={confirmPublish}
                        isLoadingSubmit={isLoadingSubmit}
                  />
            </section>
      );
};

export default SpecialistForm;