import {User} from './inbox';

export interface Notification {
  id: number;
  user: User;
  sender: User;
  type: string;
  notify_at: string;
  seen: boolean;
}
