export class ResourceNotFoundError extends Error {
  constructor(resource?: string) {
    const message = `${resource ? `${resource} not found` : "Resource not found"}`;

    super(message);
    this.name = "NotFoundError";
  }
}
