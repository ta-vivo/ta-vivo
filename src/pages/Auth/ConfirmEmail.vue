<template>
  <q-page padding>
    <q-card flat v-if="success">
      <q-card-section class="text-center">
        <q-icon
          size="120px"
          color="positive"
          name="eva-checkmark-circle-2-outline"
        />
        <p class="text-bold">
          {{ $t("messages.information.emailSuccessfullyVerified") }}
        </p>
        <q-btn
          color="primary"
          to="/"
          :label="$t('action.continueToDashboard')"
        />
      </q-card-section>
    </q-card>
    <q-card v-else flat style="max-width: 300px" class="q-mx-auto q-mt-lg">
      <q-card-section class="text-center">
        <q-img
          src="~assets/mail-sent.png"
          spinner-color="white"
          style="height: 100px; max-width: 100px"
        />
        <div class="text-bold">
          {{ $t("messages.information.verifyYourEmail") }}
        </div>
        <div class="q-mt-lg">
          {{ $t("messages.information.emailVerificationInformation") }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            type="text"
            outlined
            v-model="uniqueCode"
            :label="$t('common.code')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 5) || 'Please type something',
            ]"
          />
          <div class="text-center">
            <q-btn
              push
              :loading="loading"
              :label="$t('action.send')"
              type="submit"
              color="primary"
              icon="eva-log-in-outline"
            />
          </div>
        </q-form>
        <div class="q-mt-md text-center">
          <q-btn
            flat
            color="primary"
            :label="$t('action.requestNewEmail')"
            @click="requestNewEmail()"
            :loading="loadingRequestNewEmail"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import jwtDecode from "jwt-decode";

export default {
  name: "PageConfirmEmail",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $t = useI18n().t;

    const uniqueCode = ref(null);
    const loading = ref(false);
    const loadingRequestNewEmail = ref(false);
    const success = ref(false);

    return {
      uniqueCode,
      loading,
      loadingRequestNewEmail,
      success,
      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/registerEmailConfirmation", {
            uniqueCode: uniqueCode.value,
          })
          .then((response) => {
            const token = response.data.data.token;
            const decoded = jwtDecode(token);

            $store.commit("auth/SET_USER", {
              email: decoded.email,
              id: decoded.userId,
            });

            window.localStorage.setItem("token", token);
            success.value = true;
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
      requestNewEmail() {
        loadingRequestNewEmail.value = true;
        $store
          .dispatch("auth/requestRegisterEmailConfirmation")
          .then(() => {
            $q.notify({
              message: $t("messages.information.emailSent"),
              color: "positive",
            });
          })
          .finally(() => {
            loadingRequestNewEmail.value = false;
          });
      },
    };
  },
};
</script>
