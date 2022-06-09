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
          </div>
          <div class="text-center">
            <q-btn
              flat
              to="/auth/register"
              :label="$t('common.registerWithEmail')"
              color="primary"
              icon="eva-person-add-outline"
            />
          </div>
          <div class="text-center">
            <q-separator class="q-my-md" />
            <span class="text-grey-7">
              {{ $t("common.connectWithOneClick") }}
            </span>
          </div>
          <div>
            <q-btn
              push
              :icon="discordIcon"
              class="full-width discord-color"
              text-color="white"
              label="Discord"
              @click="dispatchDiscordAuth()"
              :disable="loading"
            />
            <q-btn
              push
              icon="eva-google"
              class="full-width google-color q-mt-md"
              text-color="white"
              label="Google"
              @click="dispatchGoogleAuth()"
              :disable="loading"
            />
            <q-btn
              push
              :icon="slackLogo"
              class="full-width slack-color q-mt-md"
              text-color="black"
              label="Slack"
              @click="dispatchSlackAuth()"
              :disable="loading"
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
import { fabDiscord, fabSlack } from "@quasar/extras/fontawesome-v5";

export default {
  name: "PageLogin",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const email = ref(null);
    const password = ref(null);
    const loading = ref(false);
    const discordIcon = ref(fabDiscord);
    const slackLogo = ref(fabSlack);

    const user = supabase.auth.user();

    const onSuccessLogin = (token) => {
      const decoded = jwtDecode(token);

      $store.commit("auth/SET_USER", decoded);
      window.localStorage.setItem("token", token);
    };

    const googleAuth = async () => {
      $store
        .dispatch("auth/google", {
          access_token: supabase.auth.session().access_token,
        })
        .then((response) => {
          const token = response.data.data.token;
          onSuccessLogin(token);
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

    const discordAuth = async () => {
      $store
        .dispatch("auth/discord", {
          access_token: supabase.auth.session().access_token,
        })
        .then((response) => {
          const token = response.data.data.token;
          onSuccessLogin(token);

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

    const slackAuth = async () => {
      $store
        .dispatch("auth/slack", {
          access_token: supabase.auth.session().access_token,
        })
        .then((response) => {
          const token = response.data.data.token;
          onSuccessLogin(token);

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
      loading.value = true;

      switch (user.app_metadata.provider) {
        case "google":
          googleAuth();
          break;
        case "discord":
          discordAuth();
          break;
        case "slack":
          slackAuth();
          break;
        default:
          $q.notify({
            color: "negative",
            position: "top",
            message: "Unknown provider",
          });
          loading.value = false;
          break;
      }
    }

    return {
      email,
      password,
      loading,
      discordIcon,
      slackLogo,

      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/login", {
            email: email.value,
            password: password.value,
          })
          .then((response) => {
            const token = response.data.data.token;
            onSuccessLogin(token);

            const decoded = jwtDecode(token);

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
      async dispatchDiscordAuth() {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "discord",
        });
      },
      async dispatchSlackAuth() {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "slack",
        });
      },
    };
  },
};
</script>
<style scoped>
.google-color {
  background-color: #cf4737;
}
.discord-color {
  background-color: #5865f2;
}
</style>
