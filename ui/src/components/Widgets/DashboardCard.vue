<template>
  <q-card flat bordered style="max-width:200px">
    <q-card-section class="text-center">
      <q-avatar
        size="50px"
        :color="color"
        text-color="white"
        :icon="icon"
      />
    </q-card-section>
    <q-card-section>
      <p class="text-h6">{{ title }}</p>
      <p class="text-h4">{{ value }}</p>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'ComponentDashboardCard',
  props: {
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    return {};
  },
};
</script>
