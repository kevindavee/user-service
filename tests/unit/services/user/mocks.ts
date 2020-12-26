export const UserRepoMock = {
  get: jest.fn().mockResolvedValue([null, null]),
  find: jest.fn().mockResolvedValue([null, null]),
  create: jest.fn().mockResolvedValue(null),
  update: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(null),
}

export const SecretGenMock = {
  generateID: jest.fn().mockReturnValue('id'),
}
