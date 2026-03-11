import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiService from '../../api/apiService';

const disputeSchema = z.object({
  bookingId: z.number({ required_error: 'Booking ID is required', invalid_type_error: 'Must be a number' }),
  type: z.enum(['PROPERTY_DAMAGE', 'PAYMENT_ISSUE', 'CLEANLINESS', 'HOST_CANCELLATION', 'GUEST_BEHAVIOR', 'OTHER']),
  description: z.string().min(1, 'Description is required'),
});

export default function DisputeForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(disputeSchema),
    defaultValues: { type: 'OTHER' }
  });

  const onSubmit = async (data) => {
    try {
      await apiService.createDispute(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create dispute', error);
      alert(error.response?.data?.message || 'Error creating dispute');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-red-50 p-6 rounded-lg border border-red-200">
      <h3 className="text-xl font-bold mb-4 text-red-800">File a Dispute</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-red-900">Booking ID</label>
          <input type="number" {...register('bookingId', { valueAsNumber: true })} className="mt-1 block w-full rounded border border-red-300 p-2" />
          {errors.bookingId && <p className="text-red-500 text-xs">{errors.bookingId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-red-900">Dispute Type</label>
          <select {...register('type')} className="mt-1 block w-full rounded border border-red-300 p-2 bg-white">
            <option value="PROPERTY_DAMAGE">Property Damage</option>
            <option value="PAYMENT_ISSUE">Payment Issue</option>
            <option value="CLEANLINESS">Cleanliness</option>
            <option value="HOST_CANCELLATION">Host Cancellation</option>
            <option value="GUEST_BEHAVIOR">Guest Behavior</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-red-900">Description</label>
          <textarea {...register('description')} rows="4" className="mt-1 block w-full rounded border border-red-300 p-2" placeholder="Provide details..."></textarea>
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-red-200 text-red-800 px-4 py-2 rounded text-sm hover:bg-red-300">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="bg-red-600 text-white px-4 py-2 rounded text-sm disabled:bg-red-400 hover:bg-red-700">
          {isSubmitting ? 'Filing...' : 'Submit Dispute'}
        </button>
      </div>
    </form>
  );
}
