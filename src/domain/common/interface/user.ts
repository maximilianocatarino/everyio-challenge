export default interface User {
  id?: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
  updateddAt?: Date;
  deletedAt?: Date;
}
