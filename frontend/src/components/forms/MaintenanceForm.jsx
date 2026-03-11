import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiService from '../../api/apiService';

const maintenanceSchema = z.object({
  propertyId: z.number({ required_error: 'Property ID is required', invalid_type_error: 'Must be a number' }),
  bookingId: z.number().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export default function MaintenanceForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(maintenanceSchema)
  });

  const onSubmit = async (data) => {
    try {
      if (!data.bookingId) delete data.bookingId;
      await apiService.requestMaintenance(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to report maintenance issue', error);
      alert(error.response?.data?.message || 'Error reporting issue');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
      <h3 className="text-xl font-bold mb-4 text-yellow-800">Report Maintenance Issue</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-yellow-900">Property ID</label>
          <input type="number" {...register('propertyId', { valueAsNumber: true })} className="mt-1 block w-full rounded border border-yellow-300 p-2" />
          {errors.propertyId && <p className="text-red-500 text-xs">{errors.propertyId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-900">Booking ID (Optional)</label>
          <input type="number" {...register('bookingId', { setValueAs: v => v ? parseInt(v) : null })} className="mt-1 block w-full rounded border border-yellow-300 p-2" />
          {errors.bookingId && <p className="text-red-500 text-xs">{errors.bookingId.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-yellow-900">Issue Title</label>
          <input type="text" {...register('title')} className="mt-1 block w-full rounded border border-yellow-300 p-2" placeholder="e.g. Broken AC" />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-yellow-900">Description</label>
          <textarea {...register('description')} rows="3" className="mt-1 block w-full rounded border border-yellow-300 p-2"></textarea>
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm hover:bg-yellow-300">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="bg-yellow-600 text-white px-4 py-2 rounded text-sm disabled:bg-yellow-400 hover:bg-yellow-700">
          {isSubmitting ? 'Submitting...' : 'Submit Issue'}
        </button>
      </div>
    </form>
  );
}
