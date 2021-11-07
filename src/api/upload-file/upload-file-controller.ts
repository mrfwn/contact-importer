import { Request, Response } from 'express';
import { createFileUploadTracker } from './resource/functions/file-io';
import { RequestFile } from './resource/types';

import { workerController } from "./resource/worker/upload-worker-controller";

export const uploadFileController = async (request: Request, response: Response): Promise<void> => {
  
  const requestFile = request.file as RequestFile;
  
  const user = { email: 'mariowessen@gmail.com' }
  
  const uploadTracker = await createFileUploadTracker({ requestFile, user });

  response.json({ status: "success", data: { operationId: uploadTracker.id } });

  await new Promise(workerController(uploadTracker));
};
