<template>
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
      :icon="githubLogo"
      class="full-width github-color q-mt-md"
      text-color="white"
      label="Github"
      @click="dispatchGithubAuth()"
      :disable="loading"
    />
    <q-btn
      v-if="!$q.dark.isActive"
      push
      class="full-width q-mt-md"
      color="#FFFFFF"
      @click="dispatchGoogleAuth()"
      :disable="loading"
    >
      <q-img
        style="margin-right: 24px"
        width="18px"
        src="https://developers.google.com/static/identity/images/g-logo.png"
      />
      <span style="color: #777777">Google</span>
    </q-btn>
    <q-btn
      v-else
      push
      class="full-width q-mt-md"
      color="#FFFFFF"
      @click="dispatchGoogleAuth()"
      :disable="loading"
      label="Google"
      icon="eva-google"
    />
    <q-btn
      v-if="$q.dark.isActive"
      push
      :icon="slackLogo"
      class="full-width slack-color q-mt-md"
      text-color="white"
      label="Slack"
      @click="dispatchSlackAuth()"
      :disable="loading"
    />
    <q-btn
      v-else
      push
      class="full-width q-mt-md"
      color="white"
      @click="dispatchSlackAuth()"
      :disable="loading"
    >
      <q-img
        style="margin-right: 24px"
        width="18px"
        src="../../assets/slack-logo.png"
      />
      <span style="color: #777777">SLACK</span>
    </q-btn>
  </div>
</template>

<script>
import { ref } from "vue";
import { fabDiscord, fabSlack, fabGithub } from "@quasar/extras/fontawesome-v5";
import { getUserTimezone } from "src/utils/time";
import supabase from "boot/supabase";
import {
  dispatchDiscordAuth,
  dispatchGithubAuth,
  dispatchGoogleAuth,
  dispatchSlackAuth,
} from "src/utils/auth";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import jwtDecode from "jwt-decode";

export default {
  name: "ComponentSocialNetworks",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const loading = ref(false);
    const discordIcon = ref(fabDiscord);
    const slackLogo = ref(fabSlack);
    const githubLogo = ref(fabGithub);
    const timezone = getUserTimezone();

    let user = supabase.auth.user();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        user = supabase.auth.user();
        onUserIsLoggedIn();
      }
    });

    const onSuccessLogin = (token) => {
      const decoded = jwtDecode(token);

      $store.commit("auth/SET_USER", decoded);
      window.localStorage.setItem("token", token);
    };

    const googleAuth = async () => {
      $store
        .dispatch("auth/google", {
          access_token: supabase.auth.session().access_token,
          timezone,
        })
        .then((response) => {
          const token = response.data.data.token;
          onSuccessLogin(token);
          $router.push("/");
        })
        .catch((error) => {
          console.log('🚀 ~ file: SocialNetworks.vue:130 ~ googleAuth ~ error:', error)
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
          timezone,
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
          timezone,
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

    const githubAuth = async () => {
      $store
        .dispatch("auth/github", {
          access_token: supabase.auth.session().access_token,
          timezone,
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

    const onUserIsLoggedIn = () => {
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
        case "github":
          githubAuth();
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
    };

    if (user) {
      onUserIsLoggedIn();
    }

    return {
      loading,
      discordIcon,
      slackLogo,
      githubLogo,
      dispatchGoogleAuth,
      dispatchDiscordAuth,
      dispatchSlackAuth,
      dispatchGithubAuth,
    };
  },
};
</script>

<style scoped>
.discord-color {
  background-color: #5865f2;
}
.github-color {
  background-color: #24292e;
}
</style>
