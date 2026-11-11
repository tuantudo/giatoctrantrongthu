/**
 * GIATOC PLATFORM — data/index.js
 * Central barrel export for Platform Data Layer.
 */

export { DataService } from './service.js';
export { HttpDataAdapter } from './http-adapter.js';
export { MockDataAdapter } from './mock-adapter.js';
export { createDataService, detectMode, isMockRequested } from './factory.js';
