import { Observable } from "rxjs";

export interface Project {
    collabName: any;
    documentNamesString: any;    
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
    Collaborator: Collaborator[];
    docassigned: DocumentCollab[];
    status: string;
  }
  export interface Collaborator {
    name: string;
    email: string;
    avatar?: string;
  }
  export interface DocumentMetadata {
    name: string;
    type: string;
    maxSize: number;
    sizeUnit: string;
    filename: string;
    color?: string;
    actions?: string;
    remarks?: string;
    title?: string;
    search?: string;
    colorClass?: string;
    date: string;
  }
  export interface AssignedCollaborator {
    assignedcollabemail: string;
    uploadstatus: string;
    filename: string;
  }
  export interface DocumentCollab {
    docname: string;
    assignedcollabs: AssignedCollaborator[];
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