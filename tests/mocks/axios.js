import { vi } from 'vitest'

const getMock = () => {
  vi.mock('axios', () => ({
    default: ({
      create: () => ({
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() }
        },
        get: vi.fn((route) => {
          return Promise.resolve({ route: route, data: [] })
        }),
        post: vi.fn((route, data) => {
          return Promise.resolve({ route: route, data: data })
        }),
        put: vi.fn((route, data) => {
          return Promise.resolve({ route: route, data: data })
        }),
        delete: vi.fn((route) => {
          return Promise.resolve({ route: route, data: [] })
        })
      })
    })
  }))
}

export default getMock;
