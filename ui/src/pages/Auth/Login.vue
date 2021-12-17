<template>
  <q-page padding>
    <q-card flat style="max-width: 300px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center">
        <q-img
          src="~assets/main-logo.png"
          spinner-color="white"
          style="height: 100px; max-width: 100px"
        />
        <div class="text-bold">Ta Vivo</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            type="text"
            outlined
            v-model="username"
            :label="$t('common.username')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            type="password"
            outlined
            v-model="password"
            :label="$t('common.password')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <div class="text-center">
            <q-btn
              push
              :loading="loading"
              :label="$t('common.login')"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "PageLogin",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const username = ref(null);
    const password = ref(null);
    const accept = ref(false);
    const loading = ref(false);

    return {
      username,
      password,
      accept,
      loading,

      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/login", {
            username: username.value,
            password: password.value,
          })
          .then((response) => {
            window.localStorage.setItem("token", response.data.data.token);
            $router.push("/");
          })
          .catch(error => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message,
          });
          })
          .finally(() => {
            loading.value = false;
          });
      },
    };
  },
};
</script>
