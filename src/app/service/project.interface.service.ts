export interface Project {
    id: number;
    Name: string;
    scope: string;
    title: string;
    participants: number;
    host: string;
    docCount: number;
    docCounttotal: number;
    comments: number;
    startDate: string;
    endDate: string;
    visibility: 'Public' | 'Private';
    members: string[];
    collabCount: number;
    documents: string[];
  }