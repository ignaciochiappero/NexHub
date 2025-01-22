
//types\chat.ts
export interface User {
  image: string | null | undefined;
  id: number;
  name: string;
  email: string;
  

}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: Date;
  updatedAt: Date;
  conversationId: number;
  isRead: boolean;
  sender?: {
    name: string;
    email: string;
  };
}

export interface Conversation {
  id: number;
  participants: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
  messages: Message[];
}