import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

import DashboardCard from "../src/components/Widgets/DashboardCard.vue";

const wrapperFactory = () => mount(DashboardCard, {
  global: {
    plugins: [Quasar]
  },
  props: {
    icon: "eva-activity-outline",
    color: "primary",
    title: "checks",
    value: 10,
    loading: false
  }
})

const wrapper = wrapperFactory();

describe('DashboardCard', () => {
  it('mount component', () => {
    expect(DashboardCard).toBeTruthy();
  })

  it('should render title', () => {
    expect(wrapper.html()).toContain("checks");
  })

  it('should render value', () => {
    expect(wrapper.html()).toContain("10");
  })

  it('should render icon', () => {
    expect(wrapper.html()).toContain("eva-activity-outline");
  })
})
