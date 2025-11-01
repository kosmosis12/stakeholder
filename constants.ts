
import { Role } from './types';

export const ROLE_COLORS: Record<Role, string> = {
  [Role.CHAMPION]: 'bg-manjaro-success',
  [Role.INFLUENCER]: 'bg-manjaro-info',
  [Role.EVALUATOR]: 'bg-manjaro-warn',
  [Role.EXECUTIVE_SPONSOR]: 'bg-manjaro-exec',
  [Role.SIGNER]: 'bg-manjaro-signer',
  [Role.DETRACTOR]: 'bg-manjaro-error',
};

export const ROLE_TEXT_COLORS: Record<Role, string> = {
    [Role.CHAMPION]: 'text-manjaro-success',
    [Role.INFLUENCER]: 'text-manjaro-info',
    [Role.EVALUATOR]: 'text-manjaro-warn',
    [Role.EXECUTIVE_SPONSOR]: 'text-manjaro-exec',
    [Role.SIGNER]: 'text-manjaro-signer',
    [Role.DETRACTOR]: 'text-manjaro-error',
};

export const ROLE_BORDER_COLORS: Record<Role, string> = {
    [Role.CHAMPION]: 'border-manjaro-success',
    [Role.INFLUENCER]: 'border-manjaro-info',
    [Role.EVALUATOR]: 'border-manjaro-warn',
    [Role.EXECUTIVE_SPONSOR]: 'border-manjaro-exec',
    [Role.SIGNER]: 'border-manjaro-signer',
    [Role.DETRACTOR]: 'border-manjaro-error',
};
