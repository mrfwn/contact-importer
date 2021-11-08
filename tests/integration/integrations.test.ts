import { resolve } from 'path';
import supertest from 'supertest';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';
import app from '../../src/app';
import { createUserIntegrationTest } from './create-user-test';

jest.setTimeout(30000);

let container: StartedDockerComposeEnvironment;
const request: supertest.SuperTest<supertest.Test> = supertest(app);
const server = app.listen(3000);

beforeAll(async () => {
    container = await new DockerComposeEnvironment(resolve(__dirname, '..', '..'), 'docker-compose.yml').up();
});

describe('Create User',()=>createUserIntegrationTest(request))

afterAll(async () => {
    server.close();
    await container.stop();
});
