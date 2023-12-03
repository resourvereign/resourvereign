import { ClientErrorUnauthorized } from '@slangy/server/helpers/httpError.js';
import { Jwt } from '@slangy/server/middleware/express/auth/jwt.js';
import user from '@slangy/server/middleware/express/auth/user.js';

import UserModel, { UserDocument } from '../../models/user.js';

export const checkUser = user<Jwt, UserDocument>({
  userFactory: async (auth) => {
    const user = await UserModel.findById(auth.id);
    if (!user) {
      throw new ClientErrorUnauthorized();
    }
    return user;
  },
});
