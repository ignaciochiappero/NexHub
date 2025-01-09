export interface User {
    id: number;
    name: string;
    email: string;
    image?: string | null;
    birthday: Date;
    location?: string | null;
    company?: string | null;
    role: 'USER' | 'ADMIN';
  }
  
  export interface UserFormData {
    name: string;
    email: string;
    password: string;
    birthday: string;
    location?: string;
    company?: string;
    image?: string;
  }