export interface Project {
    id: number;
    title: string;
    docCount: number;
    docCounttotal: number;
    comments: number;
    startDate: string;
    endDate: string;
    visibility: 'Public' | 'Private';
    members: string[];
  }