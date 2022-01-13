<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-5">
      <q-form
        v-if="activeForm === 'requestCode'"
        @submit="requestCodeViaEmail"
        class="q-gutter-md"
      >
        <div>
          <p class="text-bold">{{ $t("common.basicInformation") }}</p>
        </div>
        <q-input
          type="text"
          hint="jhon@domain.com"
          outlined
          v-model="integration.email"
          :label="$t('common.email')"
          lazy-rules
          :rules="[
            (val) => validateEmail(val) || $t('messages.errors.notValidEmail'),
          ]"
        />
        <div class="text-center">
          <q-btn
            push
            :loading="loadingRequestCode"
            :label="$t('action.requestCode')"
            type="submit"
            color="primary"
            icon="eva-save-outline"
          />
        </div>
      </q-form>
      <q-form
        v-if="activeForm === 'confirmEmailCode'"
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <q-input
          type="text"
          outlined
          v-model="integration.code"
          :label="$t('common.uniqueCode')"
          lazy-rules
          :rules="[
            (val) => val.length > 0 || $t('messages.errors.requireField'),
          ]"
        />
        <div class="text-center">
          <q-btn
            push
            :loading="loading"
            :label="$t('action.save')"
            type="submit"
            color="primary"
            icon="eva-save-outline"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentEmailForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingRequestCode: false,
      integration: { email: "", code: "" },
      activeForm: "requestCode",
    };
  },
  methods: {
    onSubmit() {
      this.$emit("saved", { uniqueCode: this.integration.code });
    },
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    requestCodeViaEmail() {
      this.loadingRequestCode = true;
      this.$store
        .dispatch("integrations/requestEmailCode", {
          email: this.integration.email,
        })
        .then(() => {
          this.activeForm = "confirmEmailCode";
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message,
            icon: fabTelegram,
          });
        })
        .finally(() => {
          this.loadingRequestCode = false;
        });
    },
  },
};
</script>
