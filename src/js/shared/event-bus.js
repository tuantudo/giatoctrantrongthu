/**
 * GIATOC SHARED UTILITIES — event-bus.js
 * Lightweight, zero-dependency Pub/Sub Event Bus for cross-module decoupled messaging.
 */

export function createEventBus() {
  const listeners = new Map();

  return {
    /**
     * Subscribe to an event.
     * @param {string} event
     * @param {Function} callback
     * @returns {() => void} Unsubscribe function
     */
    on(event, callback) {
      if (typeof callback !== 'function') return () => {};
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(callback);
      return () => this.off(event, callback);
    },

    /**
     * Subscribe to an event once.
     * @param {string} event
     * @param {Function} callback
     * @returns {() => void} Unsubscribe function
     */
    once(event, callback) {
      if (typeof callback !== 'function') return () => {};
      const wrapper = (...args) => {
        this.off(event, wrapper);
        callback(...args);
      };
      return this.on(event, wrapper);
    },

    /**
     * Unsubscribe a specific callback from an event.
     * @param {string} event
     * @param {Function} callback
     */
    off(event, callback) {
      const set = listeners.get(event);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          listeners.delete(event);
        }
      }
    },

    /**
     * Publish an event to all subscribers.
     * @param {string} event
     * @param {*} data
     */
    emit(event, data) {
      const set = listeners.get(event);
      if (set) {
        // Clone to allow callbacks to unsubscribe during iteration
        for (const cb of Array.from(set)) {
          try {
            cb(data);
          } catch (err) {
            console.error(`[EventBus] Error in listener for "${event}":`, err);
          }
        }
      }
    },

    /**
     * Clear all subscribers or all subscribers for a given event.
     * @param {string} [event]
     */
    clear(event) {
      if (event) {
        listeners.delete(event);
      } else {
        listeners.clear();
      }
    },

    /**
     * Number of registered callbacks for an event.
     * @param {string} event
     * @returns {number}
     */
    listenerCount(event) {
      return listeners.get(event)?.size || 0;
    }
  };
}

/** Default global shared instance */
export const sharedEventBus = createEventBus();

export default sharedEventBus;

