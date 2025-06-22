import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

const createRequestSchema = z.object({
  department: z.string().min(1, 'Отдел обязателен'),
  date: z.string().datetime('Некорректная дата'),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен не найден' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    let requests;
    
    if (decoded.role === 'ADMIN') {
      // Админ видит все заявки
      requests = await prisma.request.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Пользователь видит только свои заявки
      requests = await prisma.request.findMany({
        where: { userId: decoded.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { error: 'Ошибка получения заявок' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен не найден' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const body = await request.json();
    const { department, date, description } = createRequestSchema.parse(body);

    const newRequest = await prisma.request.create({
      data: {
        department,
        date: new Date(date),
        description: description || null,
        userId: decoded.id,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Create request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка создания заявки' },
      { status: 500 }
    );
  }
}