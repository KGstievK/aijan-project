import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

const updateRequestSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен не найден' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = updateRequestSchema.parse(body);
    const requestId = parseInt(params.id);

    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { status },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Update request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка обновления заявки' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен не найден' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const requestId = parseInt(params.id);

    await prisma.request.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: 'Заявка удалена' });
  } catch (error) {
    console.error('Delete request error:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления заявки' },
      { status: 500 }
    );
  }
}
