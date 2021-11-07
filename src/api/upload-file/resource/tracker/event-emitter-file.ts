import { EventEmitter } from "events";
import { FileUploadReport, FileUploadStatus } from "../types";

export const events = new Map<string, FileUploadReport>();

export const event = new EventEmitter();

export const createNewEvent = (uuid: string) => {
  events.set(uuid, { status: FileUploadStatus.Sent, percent: 0 });
};

export const registerEventError = (uuid: string, errors: any | null) => {
  events.set(uuid, {
    status: FileUploadStatus.Error,
    errors: errors,
    percent: 0
  });
};

export const registerEventStatusUpdate = (uuid: string, status: FileUploadStatus, percent: number = 0) => {
  events.set(uuid, { status, percent });
};

export const updateInsertStatus = (uuid: string, percent: number) => {
  events.set(uuid, { status: FileUploadStatus.Insert, percent });
};

export const getEventStatusById = (uuid: string): FileUploadReport => {
  return events.has(uuid) ? events.get(uuid)! : { status: FileUploadStatus.NotExist, percent: 0 };
};

export const deleteEventStatusById = (uuid: string): void => {
  events.delete(uuid);
};
