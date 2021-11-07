import { resolve } from 'path';
import supertest from 'supertest';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';
import app from '../../src/app';

jest.setTimeout(30000);

let container: StartedDockerComposeEnvironment;
const request: supertest.SuperTest<supertest.Test> = supertest(app);
const server = app.listen(3000);

beforeAll(async () => {
    container = await new DockerComposeEnvironment(resolve(__dirname, '..', '..'), 'docker-compose.yml').up();
});


afterAll(async () => {
    server.close();
    await container.stop();
});
