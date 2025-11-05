export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
}
