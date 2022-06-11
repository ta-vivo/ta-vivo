<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" bordered>
      <q-toolbar class="constrain-width">
        <q-img
          src="~assets/main-logo.png"
          spinner-color="white"
          style="height: 40px; max-width: 40px"
          @click="$router.push('/')"
          class="q-mr-sm cursor-pointer"
        />
        <q-btn
          color="primary"
          to="/checks"
          stretch
          flat
          icon="eva-activity-outline"
          :label="$t('common.checks')"
        ></q-btn>
        <q-btn
          color="primary"
          to="/integrations"
          stretch
          flat
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
          :label="$q.screen.gt.xs ? user.email : null"
          :icon="$q.screen.xs ? 'eva-person-outline' : null"
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
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
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
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();

    return {
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
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
  },
});
</script>
