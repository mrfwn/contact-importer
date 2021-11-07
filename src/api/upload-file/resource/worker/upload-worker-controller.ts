import { join } from "path";
import { API_ROOT } from "../../../../config/env";
import { FileUploadStatus } from "../types";

import { Worker } from "worker_threads";

export const workerController = (uploadTracker: any) => (resolve: (value: unknown) => void) => {
    const filePath = join(API_ROOT, "/api/upload-file/resource/worker");
    const fileName = "upload-file-worker.importer.js";
  
  
    const workerData: any = {
      ...uploadTracker
    }
    const worker = new Worker(join(filePath, fileName), { workerData });
    worker.on("message", (data: any) => {
      if (data.type === FileUploadStatus.Error) {
          console.log("ERROR");
        resolve(data);
      } else if (data.type === FileUploadStatus.ValidatedUpload) {
          console.log("VALID")
      } else if (data.type === FileUploadStatus.Completed) {
        console.log("COMPLETE")
        resolve(data);
      }
    });
    worker.on("exit", worker.terminate);
  };