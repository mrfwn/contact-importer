import { v4 as getUuid } from "uuid";
import { createNewEvent } from "../tracker/event-emitter-file";
import db from "../../../database/db-connection";
import { getFileInfo } from "./file";



export const createFileUploadTracker = async ({requestFile,user}): Promise<any> => {
  const operationId = getUuid();
  const fileInfo = getFileInfo({
      requestFile,
      operationId,
      user
  })
  await insertUploadOperation(fileInfo);

  createNewEvent(operationId);
  return fileInfo;
}



export const insertUploadOperation = async (fileInfo: any): Promise<any> => {
    const query = {
      name: "insert-back-execution-status",
      text: `
          INSERT INTO batch_execution_status
              (id, author, errors, size, filename, originalname, started_at, finished_at, status, additional_data)
          VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
          `,
      values: [
        fileInfo.operationId,
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