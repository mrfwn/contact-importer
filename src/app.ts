import 'express-async-errors';
import express from 'express';
import upload from "./middlewares/upload";
import { middlewareError } from './middlewares/error';
import health from './api/health/health-controller';
import { APP_NAME, NODE_ENV, PORT } from './config/env';
import { uploadFileController } from './api/upload-file/upload-file-controller';
import { fileStatus } from './api/upload-file/upload-file-status-controller';
import { getAllContactsController } from './api/contacts/getAll-contacts-controller';
import { getAllFilesController } from './api/files/getAll-files-controller';
import { createUserController } from './api/users/create-user-controller';
import { signInController } from './api/users/signin-user-controller';
import { auth } from './middlewares/auth';

const app = express();
app.use(express.json());
app.post('/signup', createUserController);
app.post('/signin',signInController);

app.get('/health', health);
app.use(auth);
app.post('/upload',upload.single("file"),uploadFileController)
app.get('/contacts', getAllContactsController)
app.get('/files', getAllFilesController)
app.get('/check-status/:id', fileStatus)

app.use(middlewareError);

if (NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`${APP_NAME} | ENV: ${NODE_ENV} | PORT: ${PORT}`));
}
export default app;
