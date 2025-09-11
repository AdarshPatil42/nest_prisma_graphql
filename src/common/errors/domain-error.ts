export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly i18nKey: string,
    public readonly args?: Record<string, any>,
    public readonly httpStatus = 400,
  ) {
    super(i18nKey);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
