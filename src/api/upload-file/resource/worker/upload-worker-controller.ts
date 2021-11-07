import { join } from "path";
import { API_ROOT } from "../../../../config/env";
import { FileInfo, FileUploadStatus, UploadFileWorkerResponseData } from "../types";

import { Worker } from "worker_threads";
import { emitCompleteUpload, emitFileError, emitValidatedUpload } from "../tracker/upload-tracker";

export const workerController = (uploadTracker: FileInfo) => (resolve: (value: unknown) => void) => {
    
  const filePath = join(API_ROOT, "/api/upload-file/resource/worker");
  
  const fileName = "upload-file-worker.importer.js";
  
  const worker = new Worker(join(filePath, fileName), { workerData: uploadTracker });

  worker.on("message", (data: UploadFileWorkerResponseData) => {
    if (data.type === FileUploadStatus.Error) {
      emitFileError(data.operationId, data.error, 0);
      resolve(data);
    } else if (data.type === FileUploadStatus.ValidatedUpload) {
      emitValidatedUpload(data.operationId);
    } else if (data.type === FileUploadStatus.Completed) {
      emitCompleteUpload(data.operationId);
      resolve(data);
    }
  });
  worker.on("exit", worker.terminate);
};