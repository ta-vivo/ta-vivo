<template>
  <onboarding-new-users v-if="showOnboarding" key="onboarding" />
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
    OnboardingNewUsers
  },
  data () {
    return {
      showOnboarding: false
    }
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
      const onboarding = window.localStorage.getItem('new-users-onboarding');
      if (onboarding === null) {
        this.showOnboarding = true;
      }
    },
  }
});
</script>
