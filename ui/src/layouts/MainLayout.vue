<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" elevated>
      <q-toolbar>
        <q-btn color="primary" to="/checks" stretch flat icon="eva-activity-outline" :label="$t('common.checks')"></q-btn>
        <q-btn color="primary" to="/integrations" stretch flat icon="eva-briefcase-outline" :label="$t('common.integrations')"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {},
});
</script>
