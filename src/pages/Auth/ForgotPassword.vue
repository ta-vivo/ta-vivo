<template>
  <q-page padding>
    <q-card flat style="max-width: 500px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center" v-if="!showSuccess">
        <q-img
          src="~assets/main-logo.png"
          spinner-color="white"
          style="height: 100px; max-width: 100px"
        />
        <div class="text-bold">Ta Vivo</div>
      </q-card-section>
      <template v-if="showEmailRecoveryForm">
        <q-card-section>
          <div class="text-h5 text-center">
            {{ $t("common.recoveryPassword") }}
          </div>
          <p class="q-my-md">
            {{ $t("messages.information.recoveryPasswordInitialDescription") }}
          </p>
          <q-form @submit="requestReset" class="q-gutter-md q-mt-md">
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
            <div class="text-center">
              <q-btn
                :loading="loading"
                :disable="!email"
                push
                :label="$t('action.sendEmail')"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </template>
      <template v-else-if="showUnicodeEntry">
        <q-card-section>
          <q-form @submit="handleUniqueCodeEntry" class="q-gutter-md q-mt-md">
            <p class="q-my-md">
              {{
                $t("messages.information.recoveryPasswordDescription").replace(
                  "[EMAIL]",
                  email
                )
              }}
            </p>
            <q-input
              type="text"
              outlined
              v-model="uniqueCode"
              :label="$t('common.uniqueCode')"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || $t('messages.errors.requireField'),
              ]"
            />
            <div class="text-center">
              <q-btn
                :loading="loading"
                :disable="!uniqueCode"
                push
                :label="$t('action.continue')"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </template>
      <template v-else-if="showChangePasswordForm">
        <q-card-section>
          <div class="text-h5 text-center">
            {{ $t("common.changePassword") }}
          </div>
          <div class="q-my-md">
            {{ $t("messages.information.changePasswordRules") }}
          </div>
          <q-form @submit="handleChangePassword" class="q-gutter-md q-mt-md">
            <q-input
              type="password"
              outlined
              v-model="password"
              :label="$t('common.password')"
              lazy-rules
              :rules="[
                (val) =>
                  isPasswordSecure(val) ||
                  this.$t('messages.errors.passwordSecurity'),
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
                  isPasswordSecure(val) ||
                  this.$t('messages.errors.passwordSecurity'),
              ]"
            />
            <div class="text-center">
              <q-btn
                :disable="!password || !confirmPassword"
                push
                :label="$t('common.changePassword')"
                type="submit"
                color="primary"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </template>
      <template v-else-if="showSuccess">
        <q-card-section>
          <transition
            appear
            enter-active-class="animated flipInX"
          >
            <div class="text-center">
              <q-icon
                name="eva-checkmark-circle-outline"
                color="positive"
                size="150px"
              />
            </div>
          </transition>
          <p class="q-my-md text-center">
            {{ $t("messages.information.recoveryPasswordSuccess") }}
          </p>
          <div class="text-center">
            <q-btn
              push
              :label="$t('action.goToLogin')"
              @click="$router.push('/auth/login')"
              color="primary"
            />
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  name: "PageForgotPassword",
  setup() {
    const email = ref("");
    const loading = ref(false);
    const showEmailRecoveryForm = ref(true);
    const showUnicodeEntry = ref(false);
    const showChangePasswordForm = ref(false);
    const showSuccess = ref(false);
    const password = ref("");
    const confirmPassword = ref("");
    const uniqueCode = ref("");
    const $store = useStore();
    const $q = useQuasar();

    return {
      email,
      loading,
      showEmailRecoveryForm,
      showUnicodeEntry,
      showChangePasswordForm,
      uniqueCode,
      password,
      confirmPassword,
      showSuccess,
      isPasswordSecure(password) {
        if (password) {
          const regex = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
          return regex.test(password);
        }
        // Prevent show error message on empty field
        return true;
      },
      requestReset() {
        loading.value = true;
        $store
          .dispatch("auth/forgotPassword", { email: email.value })
          .then(() => {
            showEmailRecoveryForm.value = false;
            showUnicodeEntry.value = true;
          })
          .finally(() => {
            loading.value = false;
          });
      },
      handleUniqueCodeEntry() {
        showChangePasswordForm.value = true;
        showUnicodeEntry.value = false;
      },
      handleChangePassword() {
        loading.value = true;
        $store
          .dispatch("auth/recoverPassword", {
            email: email.value,
            uniqueCode: uniqueCode.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
          })
          .then(() => {
            showChangePasswordForm.value = false;
            showSuccess.value = true;
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
  },
};
</script>
