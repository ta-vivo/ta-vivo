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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "PageConfirmEmail",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const uniqueCode = ref(null);
    const loading = ref(false);
    const success = ref(false);

    return {
      uniqueCode,
      loading,
      success,
      onSubmit() {
        loading.value = true;
        $store
          .dispatch("auth/registerEmailConfirmation", {
            uniqueCode: uniqueCode.value,
          })
          .then(() => {
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
    };
  },
};
</script>
