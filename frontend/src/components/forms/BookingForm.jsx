import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiService from '../../api/apiService';

const bookingSchema = z.object({
  propertyId: z.number({ required_error: 'Property ID is required', invalid_type_error: 'Must be a number' }),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  guestsCount: z.number().min(1, 'At least 1 guest required'),
});

export default function BookingForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { guestsCount: 1 }
  });

  const onSubmit = async (data) => {
    try {
      await apiService.createBooking(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create booking', error);
      alert(error.response?.data?.message || 'Error creating booking');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Create New Booking</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium">Property ID</label>
          <input type="number" {...register('propertyId', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.propertyId && <p className="text-red-500 text-xs">{errors.propertyId.message}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium">Number of Guests</label>
          <input type="number" {...register('guestsCount', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.guestsCount && <p className="text-red-500 text-xs">{errors.guestsCount.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Check-in Date</label>
          <input type="date" {...register('checkInDate')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.checkInDate && <p className="text-red-500 text-xs">{errors.checkInDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Check-out Date</label>
          <input type="date" {...register('checkOutDate')} className="mt-1 block w-full rounded border p-2 bg-white" />
          {errors.checkOutDate && <p className="text-red-500 text-xs">{errors.checkOutDate.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded text-sm">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm disabled:bg-indigo-400">
          {isSubmitting ? 'Booking...' : 'Book Property'}
        </button>
      </div>
    </form>
  );
}
