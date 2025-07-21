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
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  isSubscribed: boolean;
  designation: string;
  organization: string
  // add more fields if needed
}