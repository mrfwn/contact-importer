import 'express-async-errors';
import express from 'express';
import upload from "./middlewares/upload";
import { middlewareError } from './middlewares/error';
import health from './api/health/health-controller';
import { APP_NAME, NODE_ENV, PORT, ENVIRONMENT } from './config/env';
import { uploadFileController } from './api/upload-file/upload-file-controller';

const app = express();
app.use(express.json());

app.get('/health', health);
app.post('/upload',upload.single("file"),uploadFileController)
app.use(middlewareError);

if (NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`${APP_NAME} | ENV: ${NODE_ENV} | PORT: ${PORT}`));
}
export default app;
