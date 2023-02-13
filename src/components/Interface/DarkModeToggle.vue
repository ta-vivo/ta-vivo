<template>
  <q-toggle
    :color="darkMode ? 'primary' : 'black'"
    keep-color
    dark
    v-model="darkMode"
    :icon="darkMode ? 'eva-moon-outline' : 'eva-sun-outline'"
    @update:model-value="toggleDarkMode"
  />
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
export default {
  name: "ComponentDarkModeToggle",
  setup() {
    const $q = useQuasar();

    const darkmodeFromLocalStorage = localStorage.getItem("darkmode");
    const darkMode = ref(darkmodeFromLocalStorage || $q.dark.isActive);

    return {
      darkMode,
      toggleDarkMode() {
        window.localStorage.setItem("darkMode", darkMode.value);
        $q.dark.set(darkMode.value);
      },
    };
  },
};
</script>
