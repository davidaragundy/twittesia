export const logger = {
  log: (message: string, ...args: unknown[]) => {
    console.log(`${new Date().toISOString()} [LOG] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`${new Date().toISOString()} [ERROR] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`${new Date().toISOString()} [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${new Date().toISOString()} [WARN] ${message}`, ...args);
  },
};
