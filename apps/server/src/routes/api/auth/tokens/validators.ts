import { password } from '@slangy/server/regex.js';
import { body } from 'express-validator';

export const validateTokenCreation = [
  body('email').isString().isEmail().trim().notEmpty(),
  body('password').isString().trim().notEmpty().matches(password),
];
