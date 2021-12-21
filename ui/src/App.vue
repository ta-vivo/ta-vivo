<template>
  <router-view class="constrain-width" />
</template>
<script>
import { defineComponent } from "vue";
import jwtDecode from "jwt-decode";

export default defineComponent({
  name: "App",
  created() {
    const token = window.localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      this.$store.commit("auth/SET_USER", {
        username: decoded.username,
        id: decoded.id,
      });
    }
  },
});
</script>
