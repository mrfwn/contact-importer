import multer from "multer";
import { RequestHandler } from "express";

declare class Multer {
  single(fieldName: string): RequestHandler;
  array(fieldName: string, maxCount?: number): RequestHandler;
  fields(fields: ReadonlyArray<multer.Field>): RequestHandler;
  any(): RequestHandler;
  none(): RequestHandler;
}

const uploadMiddleware: Multer = multer({ dest: "uploads/temp/" });

export default uploadMiddleware;
