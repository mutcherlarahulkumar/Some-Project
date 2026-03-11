import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import apiService from '../../api/apiService';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CABIN']),
  addressLine1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  bedrooms: z.number().min(0, 'Must be at least 0'),
  bathrooms: z.number().min(0, 'Must be at least 0'),
  capacity: z.number().min(1, 'Must be at least 1'),
  basePrice: z.number().min(0.01, 'Base price must be > 0'),
});

export default function PropertyForm({ onSuccess, onCancel, initialData, isEdit }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: { propertyType: 'APARTMENT', bedrooms: 1, bathrooms: 1, capacity: 1, basePrice: 100 }
  });

  useEffect(() => {
    if (initialData && isEdit) {
       reset(initialData);
    }
  }, [initialData, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit && initialData?.id) {
         await apiService.updateProperty(initialData.id, data);
      } else {
         await apiService.createProperty(data);
      }
      onSuccess();
    } catch (error) {
      console.error(isEdit ? 'Failed to update property' : 'Failed to create property', error);
      alert(isEdit ? 'Error updating property' : 'Error creating property');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Property' : 'Add New Property'}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input {...register('title')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select {...register('propertyType')} className="mt-1 block w-full rounded border p-2 bg-white">
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="VILLA">Villa</option>
            <option value="CABIN">Cabin</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium">Address Line 1</label>
          <input {...register('addressLine1')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <input {...register('city')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">State</label>
          <input {...register('state')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Pincode</label>
          <input {...register('pincode')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Base Price (INR)</label>
          <input type="number" step="0.01" {...register('basePrice', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:bg-indigo-400">
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update Property' : 'Save Property')}
        </button>
      </div>
    </form>
  );
}
