<template>
  <q-toolbar class="constrain-width" :class="`${$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'}`">
  <q-img
    src="~assets/main-logo.png"
    spinner-color="white"
    style="height: 40px; max-width: 40px"
    @click="$router.push('/')"
    class="q-mr-sm cursor-pointer"
  />
  <q-btn
    to="/checks"
    stretch
    flat
    :text-color="$q.dark.isActive ? 'white' : 'primary'"
    icon="eva-activity-outline"
    :label="$t('common.checks')"
  ></q-btn>
  <q-btn
    to="/integrations"
    stretch
    flat
    :text-color="$q.dark.isActive ? 'white' : 'primary'"
    icon="eva-briefcase-outline"
    :label="$t('common.integrations')"
  ></q-btn>
  <q-space />
  <role-badge
    v-if="$q.screen.gt.xs"
    class="cursor-pointer"
    @click="$router.push('/pricing')"
    :role="user.role"
  />
  <q-btn-dropdown
    flat
    color="primary"
    class="q-ml-xs q-mr-xs"
    :label="user.email"
    icon='eva-person-outline'
  >
    <q-list>
      <q-item clickable v-close-popup @click="$router.push('/profile')">
        <q-item-section>
          <q-item-label>
            <q-icon name="eva-person-outline" />
            {{ $t("common.profile") }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="logout">
        <q-item-section>
          <q-item-label class="text-negative">
            <q-icon name="eva-log-out-outline" />
            Logout
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
  <q-toggle
    color="primary"
    dark
    v-model="darkMode"
    :icon="darkMode ? 'eva-moon-outline' : 'eva-sun-outline'"
    @update:model-value="toggleDarkMode"
  />
</q-toolbar>
</template>

<script>
  import { defineComponent, ref } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import RoleBadge from "components/User/RoleBadge.vue";
  import supabase from "boot/supabase";
  import { useQuasar } from 'quasar';

  export default defineComponent({
    name: "MainLayout",
    components: {
      RoleBadge,
    },
    setup() {
      const darkmodeFromLocalStorage = localStorage.getItem("darkmode");
      const $store = useStore();
      const $router = useRouter();
      const $q = useQuasar();
      const darkMode = ref(darkmodeFromLocalStorage || $q.dark.isActive);

      return {
        darkMode,
        async logout() {
          $q.loading.show();
          const user = supabase.auth.user();

          window.localStorage.removeItem("token");
          $store.commit("auth/SET_USER", {
            email: "",
            id: null,
            role: "basic",
          });

          if (user) {
            await supabase.auth.signOut();
          }

          $q.loading.hide();
          $router.push("/auth/login");
        },
        toggleDarkMode() {
          window.localStorage.setItem("darkMode", darkMode.value);
          $q.dark.set(darkMode.value);
        },
      };
    },
    computed: {
      user() {
        return this.$store.getters["auth/getUser"];
      }
    },
  });
  </script>

