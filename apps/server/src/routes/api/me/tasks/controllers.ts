import { UserTask } from '@resourvereign/common/api/me/tasks.js';
import controller, {
  RequestWithFields,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import { getUserTasks } from '../../../../utils/scheduler.js';

export const getTasks = controller<RequestWithFields<JwtData>, ResponseWithBody<UserTask[]>>(
  async (req, res) => {
    const tasks = getUserTasks(req.jwtUser.id).sort((a, b) => a.date.getTime() - b.date.getTime());

    return res.status(SuccessStatusCode.SuccessOK).send(
      tasks.map((t) => {
        const { date, intent } = t;

        return {
          date,
          integration: { label: intent.integration.label },
          intent: { date: intent.date },
        };
      }),
    );
  },
);
