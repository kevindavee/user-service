export class CustomError extends Error {
  public errorCode: string;
  public prevErr?: Error;
  public context?: Record<string, any>;

  constructor(errorCode: string, message: string, prevErr?: Error, context?: Record<string, any>) {
    super(message);
    this.errorCode = errorCode;
    this.prevErr = prevErr;
    this.context = context;
  }
}
