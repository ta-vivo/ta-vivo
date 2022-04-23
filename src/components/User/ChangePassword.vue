<template>
  <q-form @submit="handleChangePassword" class="q-gutter-md">
    <q-input
      type="password"
      outlined
      v-model="oldPassword"
      :label="$t('common.oldPassword')"
      lazy-rules
      :rules="[
        (val) =>
          val.length > 0 || this.$t('messages.errors.pleaseTypeTheOldPassword'),
      ]"
    />
    <q-input
      type="password"
      outlined
      v-model="password"
      :label="$t('common.password')"
      lazy-rules
      :rules="[
        (val) =>
          isPasswordSecure(val) || this.$t('messages.errors.passwordSecurity'),
      ]"
    />
    <q-input
      type="password"
      outlined
      v-model="confirmPassword"
      :label="$t('common.confirmPassword')"
      lazy-rules
      :rules="[
        (val) =>
          isPasswordSecure(val) || this.$t('messages.errors.passwordSecurity'),
      ]"
    />
    <div class="text-center">
      <q-btn
        :disable="!oldPassword || !password || !confirmPassword"
        push
        :label="$t('common.changePassword')"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default {
  name: "ComponentChangePassword",
  setup(props, { emit }) {
    const oldPassword = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const loading = ref(false);
    const $store = useStore();
    const $q = useQuasar();
    const $t = useI18n().t;

    return {
      oldPassword,
      password,
      confirmPassword,
      loading,
      handleChangePassword() {
        loading.value = true;
        $store
          .dispatch("auth/changePassword", {
            oldPassword: oldPassword.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
          })
          .then(() => {
            emit("success");
            $q.notify({
              position: "top",
              color: "positive",
              textColor: "white",
              message: $t("messages.information.passwordChanged"),
            });
            oldPassword.value = "";
            password.value = "";
            confirmPassword.value = "";
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
      isPasswordSecure(password) {
        if (password) {
          const regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
          return regex.test(password);
        }
        // Prevent show error message on empty field
        return true;
      },
    };
  },
};
</script>
