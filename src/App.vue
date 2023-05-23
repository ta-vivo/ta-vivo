<template>
  <onboarding-new-users
    v-if="showOnboarding"
    @hide="handleEmitHide"
    key="onboarding"
  />
  <router-view class="constrain-width" />
  <footer-component />
</template>
<script>
import { defineComponent } from "vue";
import jwtDecode from "jwt-decode";
import FooterComponent from "components/Interface/Footer";
import OnboardingNewUsers from "components/Onboarding/NewUsers";

export default defineComponent({
  name: "App",
  components: {
    FooterComponent,
    OnboardingNewUsers,
  },
  data() {
    return {
      showOnboarding: false,
    };
  },
  created() {
    let darkmodeFromLocalStorage = localStorage.getItem("darkMode");

    if (
      darkmodeFromLocalStorage === "true" ||
      darkmodeFromLocalStorage === true ||
      darkmodeFromLocalStorage === null
    ) {
      darkmodeFromLocalStorage = true;
    } else {
      darkmodeFromLocalStorage = false;
    }

    this.$q.dark.set(darkmodeFromLocalStorage);

    const token = window.localStorage.getItem("token");
    if (token) {
      this.$store.dispatch("auth/me").then((response) => {
        const token = response.data.data.token;
        const decoded = jwtDecode(token);

        this.$store.commit("auth/SET_USER", decoded);

        if (!decoded.active) {
          this.$router.push("/auth/confirm-email");
          return;
        }

        window.localStorage.setItem("token", token);
      });
    }
    this.isNewUser();
  },
  methods: {
    isNewUser() {
      const onboarding = window.localStorage.getItem("new-users-onboarding");
      const obboardingToOldUser = window.localStorage.getItem(
        "show-new-users-onboarding-to-old-user"
      );
      const sessionToken = window.localStorage.getItem("token");

      if(obboardingToOldUser === 'show') {
        this.showOnboarding = true;
        return;
      }

      if (onboarding === null && sessionToken) {
        const decoded = jwtDecode(sessionToken);
        const createdAt = new Date(decoded.createdAt)
          .toISOString()
          .split("T")[0];

        if (createdAt === new Date().toISOString().split("T")[0]) {
          this.showOnboarding = true;
        }
      }
    },
    handleEmitHide() {
      this.showOnboarding = false;
    },
  },
  watch: {
    $route(to, from) {
      if (
        from.name === "login" ||
        (from.name === "confirm-email" && to.name === "home")
      ) {
        this.isNewUser();
      }
    },
  },
});
</script>
