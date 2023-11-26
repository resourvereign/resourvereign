import { ServerErrorStatusCode } from '@slangy/server/http.js';
import routes from '@slangy/server/test-utils/routes.js';
import server from '@slangy/server/test-utils/server.js';
import { describe, expect, it } from 'vitest';

import router from './index.js';

routes(router, '/api', ['/auth', '/me', '/plugins']);

describe('/api', () => {
  describe('Should fail for unsupported routes', () => {
    it('With status 501 and empty body', async () => {
      const randomRoute = `/${Math.random().toString(36).substring(7)}`;
      const response = await server(router).get(randomRoute).send();

      expect(response.statusCode).toBe(ServerErrorStatusCode.ServerErrorNotImplemented);
      expect(response.body).toStrictEqual({});
      expect.hasAssertions();
    });
  });
});
