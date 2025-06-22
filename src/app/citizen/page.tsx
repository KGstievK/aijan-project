'use client';
import { useForm } from 'react-hook-form';
import LayoutSide from '@/components/Layout/LayoutSide';
import { useGetMeQuery } from '@/redux/api/auth';
import { useCreateRequestMutation } from '@/redux/api/requests';

// Тип для данных формы
type RequestFormData = {
  department: string;
  date: string;
  description?: string;
};

export default function CitizenPage() {
  const { data: user } = useGetMeQuery();
  const { register, handleSubmit, reset } = useForm<RequestFormData>();
  const [createRequest] = useCreateRequestMutation();

  const onSubmit = async (data: RequestFormData) => {
    try {
      await createRequest({
        department: data.department,
        date: new Date(data.date).toISOString(),
        description: data.description
      }).unwrap();
      console.log('Заявка отправлена:', data);
      reset();
      alert('Заявка успешно отправлена!');
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Ошибка при отправке заявки');
    }
  };

  return (
    <LayoutSide>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Новая заявка</h1>
        <p className="mb-4">Добро пожаловать, {user?.firstName}!</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2">Выберите отдел</label>
            <select
              {...register('department', { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="">Выберите отдел</option>
              <option value="hr">HR</option>
              <option value="finance">Финансы</option>
              <option value="it">IT</option>
              <option value="legal">Юридический</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Дата</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Описание (опционально)</label>
            <textarea
              {...register('description')}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Опишите вашу заявку..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </LayoutSide>
  );
}