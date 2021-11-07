import { v4 as getUuid } from "uuid";
import { createNewEvent } from "../tracker/event-emitter-file";
import db from "../../../database/db-connection";
import { getFileInfo } from "./file";
import { FileInfo } from "../types";



export const createFileUploadTracker = async ({requestFile,user}): Promise<FileInfo> => {
  const operationId = getUuid();
  const fileInfo = getFileInfo({
      requestFile,
      operationId,
      user
  });
  
  await insertUploadOperation(fileInfo);

  createNewEvent(operationId);
  return fileInfo;
}



export const insertUploadOperation = async (fileInfo: FileInfo): Promise<FileInfo> => {
    const query = {
      name: "insert-back-execution-status",
      text: `
          INSERT INTO batch_execution_status
              (id, author, errors, size, filename, originalname, started_at, finished_at, status, additional_data)
          VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
          `,
      values: [
        fileInfo.id,
        fileInfo.author,
        fileInfo.errors,
        fileInfo.size,
        fileInfo.filename,
        fileInfo.originalname,
        fileInfo.started_at,
        fileInfo.finished_at,
        fileInfo.status,
        fileInfo.additional_data
      ]
    };
    await db.query(query);
    return fileInfo;
  };


  export const updateStatusOperationById = async (
    operation: any,
    rows: number,
  ): Promise<void> => {
    const query = `UPDATE batch_execution_status SET status = $2, errors = $3, finished_at = $4, additional_data = $5 WHERE id = $1;`;
    const result = await db.query(query, [
      operation.id,
      operation.status,
      operation.errors,
      operation.finished_at,
      { ...operation.additionalData, rows }
    ]);
  };