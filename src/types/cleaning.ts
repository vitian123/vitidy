export type IssueType =
  | "room_cleaning"
  | "bathroom_cleaning"
  | "deep_cleaning"
  | "corridor_window"
  | "urgent_cleaning"
  | "other";

export type TicketStatus = "NEW" | "ASSIGNED" | "IN PROGRESS" | "COMPLETED" | "VERIFIED";

export interface StudentUser {
  regNo: string;
  name: string;
  block: string;
  roomNumber: string;
}

export interface CleaningTicket {
  id: string;
  issueType: IssueType;
  title: string;
  description?: string;
  roomNumber: string;
  block: string;
  studentId: string;
  createdTime: string;
  timeSlot: string;
  status: TicketStatus;
  assignedCleaner?: string;
  cleanerContact?: string;
  photoUrl?: string;
  cleanedDate?: string;
}
