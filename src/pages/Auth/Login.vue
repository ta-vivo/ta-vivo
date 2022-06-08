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
            type="email"
            outlined
            v-model="email"
            :label="$t('common.email')"
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
          <div class="text-right q-my-none">
            <q-btn
              to="/auth/forgot-password"
              class="q-my-none"
              dense
              flat
              color="primary"
              :label="$t('common.forgotPassword')"
            />
          </div>
          <div class="text-center">
            <q-btn
              push
              :loading="loading"
              :label="$t('common.login')"
              type="submit"
              color="primary"
              icon="eva-log-in-outline"
            />
            <q-btn
              @click="dispatchGoogleAuth()"
              color="primary"
              label="Google"
            />
          </div>
          <div class="text-center">
            <q-separator />
          </div>
          <div class="text-center">
            <q-btn
              flat
              to="/auth/register"
              :label="$t('common.register')"
              color="primary"
              icon="eva-person-add-outline"
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
import jwtDecode from "jwt-decode";
import supabase from "boot/supabase";

export default {
  name: "PageLogin",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const email = ref(null);
    const password = ref(null);
    const loading = ref(false);

    const user = supabase.auth.user();

    const googleAuth = async () => {
      $store
        .dispatch("auth/google", {
          access_token: supabase.auth.session().access_token,
        })
        .then((response) => {
          const token = response.data.data.token;
          const decoded = jwtDecode(token);

          $store.commit("auth/SET_USER", decoded);

          window.localStorage.setItem("token", token);

          $router.push("/");
        })
        .catch((error) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: error.response.data.message,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    if (user) {
      if (user.app_metadata.provider === "google") {
        googleAuth();
      }
    }

    return {
      email,
      password,
      loading,

      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/login", {
            email: email.value,
            password: password.value,
          })
          .then((response) => {
            const token = response.data.data.token;
            const decoded = jwtDecode(token);

            $store.commit("auth/SET_USER", decoded);

            window.localStorage.setItem("token", token);

            if (!decoded.active) {
              $router.push("/auth/confirm-email");
              return;
            }

            $router.push("/");
          })
          .catch((error) => {
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
      async dispatchGoogleAuth() {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "google",
        });
      },
    };
  },
};
</script>
