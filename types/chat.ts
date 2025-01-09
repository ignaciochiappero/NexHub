export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface Message {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    sender: {
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