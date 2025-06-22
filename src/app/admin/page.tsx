'use client';
import { useGetRequestsQuery, useDeleteRequestMutation } from '@/redux/api/requests';
import LayoutSide from '@/components/Layout/LayoutSide';
import { useGetMeQuery } from '@/redux/api/auth';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AdminPage() {
  const { data: user } = useGetMeQuery();
  const { data: requests, isLoading, refetch } = useGetRequestsQuery();
  const [deleteRequest] = useDeleteRequestMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(request => 
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  const handleDelete = async (id: number) => {
    try {
      await deleteRequest(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  const exportToCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) return;
    
    const headers = ['ID', 'Отдел', 'Дата', 'Статус', 'Пользователь', 'Email'];
    const csvRows = [
      headers.join(','),
      ...filteredRequests.map(request => 
        [
          request.id,
          `"${request.department}"`,
          format(new Date(request.date), 'dd.MM.yyyy HH:mm', { locale: ru }),
          request.status,
          `"${request.user?.firstName} ${request.user?.lastName}"`,
          request.user?.email || ''
        ].join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `заявки_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="p-6">Загрузка...</div>;

  return (
    <LayoutSide>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Управление заявками</h1>
            <p className="text-gray-600">Администратор: {user?.firstName} {user?.lastName}</p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Экспорт в CSV
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск по отделу, имени или статусу..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left text-black">ID</th>
                <th className="p-3 border text-left text-black">Отдел</th>
                <th className="p-3 border text-left text-black">Дата</th>
                <th className="p-3 border text-left text-black">Статус</th>
                <th className="p-3 border text-left text-black">Пользователь</th>
                <th className="p-3 border text-left text-black">Email</th>
                <th className="p-3 border text-left text-black">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests?.map((req) => (
                <tr key={req.id} className="hover:bg-blue-400">
                  <td className="p-3 border">{req.id}</td>
                  <td className="p-3 border">{req.department}</td>
                  <td className="p-3 border">
                    {format(new Date(req.date), 'dd.MM.yyyy HH:mm', { locale: ru })}
                  </td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.status === 'APPROVED' ? 'Одобрено' :
                       req.status === 'REJECTED' ? 'Отклонено' : 'В ожидании'}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {req.user?.firstName} {req.user?.lastName}
                  </td>
                  <td className="p-3 border">{req.user?.email}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests?.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              Нет заявок, соответствующих критериям поиска
            </div>
          )}
        </div>
      </div>
    </LayoutSide>
  );
}