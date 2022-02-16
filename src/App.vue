<template>
  <router-view class="constrain-width" />
  <footer-component />
</template>
<script>
import { defineComponent } from "vue";
import jwtDecode from "jwt-decode";
import FooterComponent from 'components/Interface/Footer';

export default defineComponent({
  name: "App",
  components: {
    FooterComponent
  },
  created() {
    const token = window.localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      this.$store.commit("auth/SET_USER", {
        email: decoded.email,
        id: decoded.id,
      });
    }
  },
});
</script>
