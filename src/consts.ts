export const SuitabilityTag = {
  RECOMMENDED: { label: 'recommended', safetyLabel: 'highly recommended' },
  PERMITTED: { label: 'permitted', safetyLabel: 'safe in moderation' },
  MODERATE: { label: 'moderate', safetyLabel: 'limit intake' },
  LIMIT: { label: 'limit', safetyLabel: 'consume with caution' },
  AVOID: { label: 'avoid', safetyLabel: 'strictly avoid' },
} as const;

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  PROMOM = 'PROMOM',
}

export enum SIGNUP_METHOD {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}
export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BAN = 'BAN',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}
