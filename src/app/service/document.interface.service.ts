export interface Document {
  id: number;
  name: string;
  format: string;
  maxSize: string;
  date: string;
  status: string;
  file: string;
  projectID: string;
  }
  export interface UserProfile {
  name: string;
  email: string;
  image: string;
  // add more fields if needed
}