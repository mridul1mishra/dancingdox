import { Observable } from "rxjs";

export interface Project {
    collabName: any;
    documentNamesString: any;    
    id: number;
    Name: string;
    Details: string;
    scope: string;
    title: string;
    participants: number;
    docCount: number;
    docCounttotal: number;
    comments: number;
    startDate: string;
    endDate: string;
    visibility: 'public' | 'private';
    members: string[];
    collabCount: number;
    documents: DocumentMetadata[];
    Host: string;
    reminder: string;
    samplefile: samplefile[];
    Collaborator: Collaborator[];
    docassigned: DocumentCollab[];
    status: string;
  }
  export interface samplefile{
    type: string,
    originalname: string,
    fieldName: string,
    maxSize: number,
    uploadTime: string,
    uploadedFilePath: string,
    filePath: string,
    status: string,
    sizeUnit: string
    uploadedFile?: File;
  fileNamePart?: string;
  filesize?: string;
  filename: string;
  size?: number;
  }
  export interface Collaborator {
    name: string;
    email: string;
    avatar?: string;
  }
  export interface DocumentMetadata {
    userId: string;
    fieldName: string;
    filename: string;
    type?: string;
    maxSize?: number;
    sizeUnit?: string;
    filesize?: string;
    [key: string]: any;
    color?: string;
    actions?: string;
    remarks?: string;
    uploadedFile?:File | null;
  }
  
  export interface DocumentCollab {
    collabemail: string;
    fieldName: string;
    collabName: string;
    uploadstatus?: string;
    filename?: string;
  }
  export interface ProjectWithDocuments extends Project {
    documentNamesString: string;
  }
  export interface ProjectWithDocuments extends Project {
    documentNamesString: string;
  }
  export interface CardData {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  billingName: string;
}