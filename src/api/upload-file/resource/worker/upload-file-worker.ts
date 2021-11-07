import { unlinkSync } from "fs";
import { workerData, parentPort } from "worker_threads";

const removeMulterTempFile = (filePath: string) => {
  unlinkSync(filePath);
};

const uploadFile = async () => {
  const data: any = workerData;
  parentPort!.postMessage({ message: "RESPONSE STATUS"});
  parentPort?.close();
  return;
};

uploadFile();
