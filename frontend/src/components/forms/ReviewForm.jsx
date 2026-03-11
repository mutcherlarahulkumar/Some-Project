import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiService from '../../api/apiService';

const reviewSchema = z.object({
  bookingId: z.number({ required_error: 'Booking ID is required', invalid_type_error: 'Must be a number' }),
  revieweeId: z.number({ required_error: 'Reviewee ID is required', invalid_type_error: 'Must be a number' }),
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  ruleCompliance: z.number().min(1).max(5).optional(),
  comment: z.string().min(10, 'Must be at least 10 characters').max(1000, 'Max 1000 characters')
});

export default function ReviewForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, cleanliness: 5, communication: 5, accuracy: 5, value: 5, ruleCompliance: 5 }
  });

  const onSubmit = async (data) => {
    try {
      await apiService.createReview(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to submit review', error);
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Add Review</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Booking ID</label>
          <input type="number" {...register('bookingId', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.bookingId && <p className="text-red-500 text-xs">{errors.bookingId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Reviewee ID</label>
          <input type="number" {...register('revieweeId', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.revieweeId && <p className="text-red-500 text-xs">{errors.revieweeId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Overall Rating (1-5)</label>
          <input type="number" step="0.1" {...register('rating', { valueAsNumber: true })} className="mt-1 block w-full rounded border p-2" />
          {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium">Comment</label>
          <textarea {...register('comment')} rows="4" className="mt-1 block w-full rounded border p-2"></textarea>
          {errors.comment && <p className="text-red-500 text-xs">{errors.comment.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-400">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:bg-indigo-400">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
