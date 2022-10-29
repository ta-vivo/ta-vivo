import { vi } from 'vitest'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn()
  }),
  useRoute: () => ({
    path: vi.fn(),
    params: vi.fn(),
    query: vi.fn(),
    fullPath: vi.fn(),
    hash: vi.fn(),
    matched: vi.fn(),
    name: vi.fn()
  })
}))
