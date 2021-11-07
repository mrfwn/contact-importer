import { Request , Response } from 'express';
import { getEventStatusById, deleteEventStatusById } from "./resource/tracker/event-emitter-file";
import { FileUploadStatus } from './resource/types';

const finishedStatus = [FileUploadStatus.Completed, FileUploadStatus.Error];

export const fileStatus = async (request: Request, response: Response): Promise<void> => {

  const id: string = request.params.id;
  
  const report = getEventStatusById(id);

  if (report && finishedStatus.includes(report?.status)) deleteEventStatusById(id);

  const status = report?.errors ? "error" : "success";
  
  response.json({ status, data: report });
};