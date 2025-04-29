export interface Project {
    find(arg0: (project: any) => any): unknown;
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
    documents: DocumentMetadata[];
    Host: string;
    Role: string;
  }
  export interface DocumentMetadata {
    name: string;
    type: string;
    maxSize: number;
    sizeUnit: string;
    filename: string;
  }