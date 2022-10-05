export interface Task {
  id?: string;
  userId: string;
  postId?: string;
  quoteOriginal: boolean;
  message: string;
  createdAt: Date;
  responses: Task[];
}
