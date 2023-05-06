import {
  DateTimeTimeZone,
  GraphEmail,
  ShowAsValues,
} from "@microsoft/myhub-types";
import dayjs from "dayjs";

export type CalendarEvent = {
  attendees?: IContact[];
  description: string;
  fromDate: string;
  title: string;
  toDate: string;
  timeZone: string;
  isAllDay: boolean;
};

export declare type MeetingPayload = {
  attendees?: IContact[];
  body?: {
    content: string;
    contentType: "text" | "html";
  };
  end?: DateTimeTimeZone;
  id?: string;
  isAllDay?: boolean;
  organizer?: {
    emailAddress: GraphEmail;
  };
  responseRequested?: boolean;
  showAs: ShowAsValues;
  start?: DateTimeTimeZone;
  subject: string;
};

export type UserOptions = {
  id: string;
  status: string;
};

export enum ActionsProgressType {
  notStarted = "notStarted",
  started = "started",
  completed = "completed",
  warning = "warning",
  error = "error",
}

export enum AddUserType {
  People = "people",
  Manager = "manager",
}

export type FrequentPeopleState = {
  frequentPeopleContacts: IContact[];
};
export interface IContact {
  displayName: string;
  givenName: string;
  jobTitle: string;
  surname: string;
  alias: string;
  userImage: string;
  userPrincipalName: string;
}

export type Name = {
  firstName: string;
  lastName: string;
};

export type NotificationDateArgs = {
  startDate: string;
  endDate: string;
};

export type ClearCalendarNotificationArgs = {
  type: string;
  dates: NotificationDateArgs;
};
