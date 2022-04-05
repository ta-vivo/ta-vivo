<template>
  <div>
    <span class="text-bold">{{ feature.quantity }}</span>
    {{ $t(`common.${feature.item}`) }}
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
