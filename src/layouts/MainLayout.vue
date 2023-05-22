<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <MobileMenu v-if="$q.screen.xs" />
      <DesktopMenu v-else />
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath" />
      <help-center />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import DesktopMenu from "src/components/Interface/DesktopMenu.vue";
import MobileMenu from "src/components/Interface/MobileMenu.vue";
import HelpCenter from "components/HelpCenter/HelpCenter";

export default defineComponent({
  name: "MainLayout",
  components: {
    DesktopMenu,
    MobileMenu,
    HelpCenter,
  },
  setup() {
    return {};
  },
});
</script>
