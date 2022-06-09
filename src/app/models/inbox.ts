export interface User {
  username: string;
  first_name: string;
  last_name: string;
}

export interface Inbox {
  id: number;
  sender: User;
  receiver: User;
  text: string;
  message_at: string;
  seen: boolean;
}
