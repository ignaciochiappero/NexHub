
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
  sender?: MessageSender;
}


export interface MessageSender {
  id: number;
  name: string;
  email: string;
  image?: string | null;
}

export interface Conversation {
  id: number;
  participants: {
    user: {
      id: number;
      name: string;
      email: string;
      image?: string; 
    };
  }[];
  messages: Message[];
}