import { socketManager } from '../socket';

interface TestSocket {
  on: jest.Mock;
  off: jest.Mock;
  emit: jest.Mock;
  connected: boolean;
}

describe('socketManager match request subscriptions', () => {
  let mockSocket: TestSocket;
  let manager: { socket: TestSocket | null; matchRequestCallbacks: Map<string, unknown> };

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connected: true,
    };

    manager = socketManager as unknown as {
      socket: TestSocket | null;
      matchRequestCallbacks: Map<string, unknown>;
    };

    // Attach the mock socket directly
    manager.socket = mockSocket;
  });

  afterEach(() => {
    manager.socket = null;
    manager.matchRequestCallbacks.clear();
  });

  it('registers listener for new match requests', () => {
    const cb = jest.fn();
    socketManager.subscribeToMatchRequests(cb);
    expect(mockSocket.on).toHaveBeenCalledWith('new-match-request', cb);
    expect(manager.matchRequestCallbacks.get('new-match-request')).toBe(cb);
  });

  it('removes listener when unsubscribing', () => {
    const cb = jest.fn();
    socketManager.subscribeToMatchRequests(cb);
    socketManager.unsubscribeFromMatchRequests();
    expect(mockSocket.off).toHaveBeenCalledWith('new-match-request');
    expect(manager.matchRequestCallbacks.size).toBe(0);
  });
});
