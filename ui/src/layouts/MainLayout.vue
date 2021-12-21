<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-black" bordered>
      <q-toolbar class="constrain-width">
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
        <q-btn-dropdown
          flat
          color="primary"
          :label="$store.getters['auth/getUser'].username"
        >
          <q-list>
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
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const $store = useStore();
    const $router = useRouter();

    return {
      logout () {
        window.localStorage.removeItem("token");
        $store.commit("auth/SET_USER", {
          username: '',
          id: null,
        });
        $router.push("/login");
      },
    }
  },
});
</script>
