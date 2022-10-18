import { vi } from 'vitest'
/**
 * Mocks Quasar, is a set of properties that are used in the components
 * For example to set the screen size, the language, the theme, etc.
 */
export default {
  screen: { gt: { xs: true } },
  dark: { isActive: false },
  iconSet: { arrow: { dropdown: 'arrow_drop_down' } },
  lang: {
    label: {
      collapse: vi.fn(),
      expand: vi.fn(),
      "clear": "Clear",
      "ok": "OK",
      "cancel": "Cancel",
      "close": "Close",
      "set": vi.fn(),
      "select": "Select",
      "reset": "Reset",
      "remove": "Remove",
      "update": "Update",
      "create": "Create",
      "search": "Search",
      "filter": "Filter",
      "refresh": "Refresh"
    }
  },
  notify: { mounted: vi.fn() },
}
