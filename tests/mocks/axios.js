import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: ({
    create: () => ({
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
      },
      get: vi.fn()
    })
  })
}))
