<template>
  <q-page padding>
    <q-card flat style="max-width: 400px" class="q-mx-auto q-mt-lg">
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
            v-model="fullname"
            :label="$t('common.fullname')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 5) || 'Please type something',
            ]"
          />
          <q-input
            type="text"
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
              val => isPasswordSecure(val) || this.$t('messages.errors.passwordSecurity')
            ]"
          />
          <q-input
            type="password"
            outlined
            v-model="confirmPassword"
            :label="$t('common.confirmPassword')"
            lazy-rules
            :rules="[
              val => isPasswordSecure(val) || this.$t('messages.errors.passwordSecurity')
            ]"
          />
          <div class="text-center">
            <q-btn
              :disable="password !== confirmPassword"
              push
              :loading="loading"
              :label="$t('common.register')"
              type="submit"
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

export default {
  name: 'PageRegister',
  setup () {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const fullname = ref('')
    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const loading = ref(false);

    return {
      fullname,
      email,
      password,
      confirmPassword,
      loading,
      isPasswordSecure (password) {
        if (password) {
          const regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/
          return regex.test(password)
        }
        // Prevent show error message on empty field
        return true
      },
      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/register", {
            fullname: fullname.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
          })
          .then((response) => {
            const token = response.data.data.token;
            const decoded = jwtDecode(token);
            $store.commit("auth/SET_USER", {
              email: decoded.email,
              id: decoded.id,
              role: decoded.role
            });
            window.localStorage.setItem("token", token);
            $router.push("/auth/confirm-email")
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
    };
  }
}
</script>
