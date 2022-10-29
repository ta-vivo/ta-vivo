<template>
  <div>
    {{ $t("messages.information.noIntegration1") }}
    <router-link to="/integrations" target="_blank" class="text-primary">
      {{ $t("action.clickHere") }}
      <q-icon
        name="eva-external-link-outline"
        size="14px"
        style="margin-bottom: 6px"
      />
    </router-link>
    {{ $t("messages.information.noIntegration2") }}
  </div>
</template>

<script>
export default {
  name: 'ComponentNoIntegrationsAction',
  setup() {
    return {};
  },
};
</script>
