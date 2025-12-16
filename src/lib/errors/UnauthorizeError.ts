class UnauthorizeError extends Error {
  constructor() {
    super('Unauthorize');
    this.name = 'UnauthorizeError';
  }
}

export default UnauthorizeError;
