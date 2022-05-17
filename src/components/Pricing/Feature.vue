<template>
  <div>
    <q-icon name="eva-checkmark-circle-2-outline" class="q-mr-sm" />
    <span class="text-bold q-mr-xs" v-if="feature.quantity">{{ feature.quantity }}</span>
    <span>{{ $t(`common.${feature.item}`) }}</span>
  </div>
</template>

<script>
export default {
  name: 'ComponentPricingFeature',
  props: {
    feature: {
      type: Object,
      required: true,
    },
  }
}
</script>
