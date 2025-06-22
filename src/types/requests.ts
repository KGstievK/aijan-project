export interface Request {
  id: number;
  department: string;
  date: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  department: string;
  date: string;
  description?: string;
}

export interface UpdateRequestData {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}