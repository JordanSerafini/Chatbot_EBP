// jest.config.js

module.exports = {
  // Configuration pour les tests du processus principal (Node.js environment)
  projects: [
    {
      displayName: 'main',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/main/**/*.test.js'],
    },
    {
      displayName: 'renderer',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/renderer/**/*.test.js'],
    },
  ],
}; 