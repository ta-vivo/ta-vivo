<template>
  <div class="constrain-width">
    <div class="footer-container q-mx-md q-my-md">
      <q-img
        src="~assets/main-logo.png"
        spinner-color="white"
        style="height: 20px; max-width: 20px"
        @click="$router.push('/')"
        class="q-mr-sm cursor-pointer"
      />
      Ta-Vivo
      <q-separator class="q-my-md" />
      <div class="footer-links">
        <span class="text-grey-7"> Copyright © {{ getYear() }} Ta-Vivo </span>
        <span
          class="link text-grey-7"
          @click="$router.push('/legal/terms-and-conditions')"
        >
          {{ $t("common.termsAndConditions") }}
        </span>
        <span
          class="link text-grey-7"
          @click="$router.push('/legal/privacy-policy')"
        >
          {{ $t("common.privacyPolicy") }}
        </span>
        <span
          v-show="$store.getters['auth/getUser'].id"
          class="link text-grey-7"
          @click="$router.push('/pricing')"
        >
          {{ $t("common.pricing") }}
        </span>
        <span
          class="link text-grey-7"
          @click="$router.push('/about')"
        >
          {{ $t("common.about") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentFooter",
  setup() {
    return {};
  },
  methods: {
    getYear() {
      return new Date().getFullYear();
    },
  },
};
</script>
<style scoped>
.footer-links .link {
  margin: 0 0.5rem;
  cursor: pointer;
}
.footer-links .link:hover {
  text-decoration: underline;
}
.footer-links .link:before {
  content: "|";
  margin: 0 0.5rem;
}
</style>
