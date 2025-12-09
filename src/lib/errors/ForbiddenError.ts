class ForbiddenError extends Error {
  constructor(modelName: string) {
    super(`You are not allowed to control this ${modelName}.`);
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
