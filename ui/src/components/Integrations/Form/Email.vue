<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-5">
      <q-form @submit="requestCodeViaEmail" class="q-gutter-md">
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
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "ComponentEmailForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {
      onSubmit() {
        emit("saved", integration.value);
      },
    };
  },
  data() {
    return {
      loadingRequestCode: false,
      integration: { email: "" },
    };
  },
  methods: {
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
        .then(() => {})
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
