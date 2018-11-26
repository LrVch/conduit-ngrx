export interface Errors {
  errors: { [key: string]: string };
}

export class ErrorsObj {
  errors = {};

  constructor({ type, body }: { type: string, body: string[] }) {
    this.errors[type] = body;
  }
}
