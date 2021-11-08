import { updateStatusOperationById } from "../functions/file-io";
import { FileUploadStatus, OperationTrackStatus } from "../types";
import { registerEventError, registerEventStatusUpdate } from "./event-emitter-file";

export const emitFileError = async (
    id: string,
    errors: string[],
    rows: number
  ): Promise<void> => {
    const data = {
      id: id,
      status: OperationTrackStatus.Failed,
      errors: errors ? errors : null,
      additionalData: { rows },
      finished_at: new Date()
    };
    await updateStatusOperationById(data, rows);
    registerEventError(id, errors);
    return;
  };

export const emitValidatedUpload = async (operationId: string): Promise<void> => {
  registerEventStatusUpdate(operationId, FileUploadStatus.ValidatedUpload);
  return;
};


export const emitCompleteUpload = async (operationId: string): Promise<void> => {
    const data = {
      id: operationId,
      status: OperationTrackStatus.Terminated,
      errors: null,
      additionalData: {
        rows: 0
      },
      finished_at: new Date()
    };
    await updateStatusOperationById(data, 0);
    registerEventStatusUpdate(operationId, FileUploadStatus.Saved);
    return;
  };

  