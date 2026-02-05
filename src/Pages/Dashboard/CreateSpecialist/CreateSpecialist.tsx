import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../../Components/Button/Button';
import { Input } from '../../../Components/Input/Input';
import { useCreateSpecialistMutation } from '../../../redux/features/specialist/specialistApi';

interface SpecialistFormInputs {
      title: string;
      description: string;
      slug: string;
      base_price: number;
      platform_fee: number;
      final_price: number;
      duration_days: number;
      is_draft: boolean;
}

const CreateSpecialist = () => {
      const { register, handleSubmit, formState: { errors } } = useForm<SpecialistFormInputs>();
      const [createSpecialist, { isLoading }] = useCreateSpecialistMutation();
      const navigate = useNavigate();
      const [selectedFile, setSelectedFile] = useState<File | null>(null);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
            }
      };

      const onSubmit = async (data: SpecialistFormInputs) => {
            try {
                  const formData = new FormData();
                  Object.entries(data).forEach(([key, value]) => {
                        formData.append(key, value.toString());
                  });

                  // Default values
                  formData.append('verification_status', 'pending');
                  formData.append('is_verified', 'false');
                  formData.append('average_rating', '0');
                  formData.append('total_number_of_reviews', '0');

                  if (selectedFile) {
                        formData.append('media', selectedFile);
                  }

                  await createSpecialist(formData).unwrap();
                  toast.success('Specialist created successfully');
                  navigate('/specialists');
            } catch (error) {
                  toast.error('Failed to create specialist');
                  console.error(error);
            }
      };

      return (
            <section className="w-full mx-auto p-6 bg-bgSecondary rounded-lg shadow-sm border border-gray-100 max-w-2xl">
                  <h1 className="font-bold text-textHighlight text-lg mb-6">Create New Specialist Service</h1>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                              <label className="block text-sm font-medium text-textSecondary mb-1">Title</label>
                              <Input
                                    {...register('title', { required: 'Title is required' })}
                                    placeholder="Service Title"
                                    className="w-full"
                              />
                              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                              <label className="block text-sm font-medium text-textSecondary mb-1">Description</label>
                              <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    placeholder="Description"
                                    className="w-full min-h-[100px] p-2 bg-bgPrimary border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                              <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Slug</label>
                                    <Input
                                          {...register('slug', { required: 'Slug is required' })}
                                          placeholder="url-slug"
                                          className="w-full"
                                    />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Duration (Days)</label>
                                    <Input
                                          type="number"
                                          {...register('duration_days', { required: true, min: 1 })}
                                          className="w-full"
                                    />
                              </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                              <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Base Price</label>
                                    <Input
                                          type="number"
                                          {...register('base_price', { required: true, min: 0 })}
                                          className="w-full"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Platform Fee</label>
                                    <Input
                                          type="number"
                                          {...register('platform_fee', { required: true, min: 0 })}
                                          className="w-full"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Final Price</label>
                                    <Input
                                          type="number"
                                          {...register('final_price', { required: true, min: 0 })}
                                          className="w-full"
                                    />
                              </div>
                        </div>

                        <div>
                              <label className="block text-sm font-medium text-textSecondary mb-1">Media</label>
                              <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-textSecondary
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary/90"
                              />
                        </div>

                        <div className="flex items-center gap-2">
                              <input
                                    type="checkbox"
                                    {...register('is_draft')}
                                    id="is_draft"
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <label htmlFor="is_draft" className="text-sm text-textSecondary">Save as Draft</label>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                              <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/specialists')}
                                    className="border-gray-200"
                              >
                                    Cancel
                              </Button>
                              <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary text-white hover:bg-primary/90"
                              >
                                    {isLoading ? 'Creating...' : 'Create Specialist'}
                              </Button>
                        </div>
                  </form>
            </section>
      );
}

export default CreateSpecialist;