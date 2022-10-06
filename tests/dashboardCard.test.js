import { test, expect } from 'vitest'
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

test('mount component', () => {
  expect(DashboardCard).toBeTruthy();
  expect(wrapper.html()).toContain("10");
})

test('should render title', () => {
  expect(wrapper.html()).toContain("checks");
})

test('should render value', () => {
  expect(wrapper.html()).toContain("10");
})

test('should render icon', () => {
  expect(wrapper.html()).toContain("eva-activity-outline");
})
