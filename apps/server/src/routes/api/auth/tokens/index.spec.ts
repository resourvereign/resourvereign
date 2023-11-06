import { UserRole } from '@resourvereign/common/models/user.js';
import { connectMongoose, disconnectMongoose } from '@slangy/mongo/helpers/mongoose/connection.js';
import { ClientErrorStatusCode, Method, SuccessStatusCode } from '@slangy/server/http.js';
import { generateToken } from '@slangy/server/middleware/express/auth/jwt.js';
import routes from '@slangy/server/test-utils/routes.js';
import server from '@slangy/server/test-utils/server.js';
import { jwtDecode } from 'jwt-decode';

import UserModel from '../../../../models/user.js';
import { getTokenPayload } from '../../../../utils/auth.js';

import router from './index.js';

routes(router, '/api/auth/tokens', [
  [Method.POST, '/'],
  [Method.PUT, '/'],
]);

describe('/api/auth/tokens', () => {
  beforeAll(async () => {
    await connectMongoose();
  });
  afterAll(async () => {
    await UserModel.deleteMany({}).exec();
    await disconnectMongoose();
  });
  beforeEach(async () => {
    await UserModel.deleteMany({}).exec();
  });

  describe('post', () => {
    describe('Should fail', () => {
      it('With status 400 if no password is received and a matching email', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
        });

        const response = await server(router).post('/').send({ email: 'test@email.com' });

        expect(response.statusCode).toBe(ClientErrorStatusCode.ClientErrorBadRequest);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With status 401 for not matching email', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
        });

        const response = await server(router)
          .post('/')
          .send({ email: 'doesNotMatch@email.com', password: 'testTest1.' });

        expect(response.statusCode).toBe(ClientErrorStatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With status 401 for not matching password', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
        });

        const response = await server(router)
          .post('/')
          .send({ email: 'test@email.com', password: 'doesNotMatch1.' });

        expect(response.statusCode).toBe(ClientErrorStatusCode.ClientErrorUnauthorized);
        expect.hasAssertions();
      });
    });

    describe('Should succeed', () => {
      it('With token for matching email and password pair', async () => {
        await UserModel.create({
          username: 'test',
          email: 'test@email.com',
          password: 'testTest1.',
          role: UserRole.user,
        });

        const response = await server(router).post('/').send({
          email: 'test@email.com',
          password: 'testTest1.',
        });
        const decodedValues = jwtDecode(response.body.token);

        expect(response.statusCode).toBe(SuccessStatusCode.SuccessCreated);
        expect(response.type).toBe('application/json');
        expect(decodedValues).toMatchObject({
          username: 'test',
          email: 'test@email.com',
          role: 'user',
        });
        expect.hasAssertions();
      });
    });
  });

  describe('put', () => {
    describe('Should fail', () => {
      it('With 401 status for expired tokens', async () => {
        const user = await UserModel.create({
          username: 'putTestFail',
          email: 'putTestFail@email.com',
          password: 'putTestFailTest1.',
          role: UserRole.user,
        });
        const token = await generateToken(getTokenPayload(user), { expiresIn: -50 });
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        expect(response.statusCode).toBe(ClientErrorStatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });

      it('With 401 status for non existing users', async () => {
        const user = await UserModel.create({
          username: 'putTestFail',
          email: 'putTestFail@email.com',
          password: 'putTestFailTest1.',
          role: UserRole.user,
        });
        const token = await generateToken(getTokenPayload(user));
        await UserModel.deleteMany({ _id: user._id }).exec();
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        expect(response.statusCode).toBe(ClientErrorStatusCode.ClientErrorUnauthorized);
        expect(response.body).toStrictEqual({});
        expect.hasAssertions();
      });
    });

    describe('Should succeed', () => {
      it('With renewed token for a valid token', async () => {
        const user = await UserModel.create({
          username: 'putTestOk',
          email: 'putTestOk@email.com',
          password: 'putTestOkTest1.',
          role: UserRole.user,
        });
        const token = await generateToken(getTokenPayload(user));
        const response = await server(router).put('/').set('Authorization', `bearer ${token}`);

        const decodedValues = jwtDecode(response.body.token);

        expect(response.statusCode).toBe(SuccessStatusCode.SuccessOK);
        expect(response.type).toBe('application/json');
        expect(decodedValues).toMatchObject({
          username: 'putTestOk',
          email: 'putTestOk@email.com',
          role: 'user',
        });
        expect.hasAssertions();
      });
    });
  });
});
