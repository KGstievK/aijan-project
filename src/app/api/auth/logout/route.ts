import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Выход выполнен успешно' });
  
  // Удаляем cookie
  response.cookies.delete('accessToken');
  
  return response;
}