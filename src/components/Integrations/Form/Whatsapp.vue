<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-5">
      <q-form
        v-if="activeForm === 'requestCode'"
        @submit="requestCode"
        class="q-gutter-md text-center request-code"
        style="max-width:400px; margin:auto;"
      >
        <p class="text-h4">{{ $t("common.basicInformation") }}</p>
        <p>{{$t('messages.information.whatsappNumberInformation')}}</p>
        <q-input
          input-class="phone"
          prefix="+1"
          mask="(###) ### - ####"
          unmasked-value
          outlined
          v-model="integration.phone"
          :label="$t('common.phone')"
          lazy-rules
          :rules="[
            (val) => validatePhone(val) || $t('messages.errors.notValidPhoneNumber'),
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
        v-if="activeForm === 'confirmCode'"
        @submit="onSubmit"
        class="q-gutter-md text-center confirm-code"
        style="max-width: 400px; margin: auto"
      >
        <p class="text-h4">{{ $t("common.whatsappConfirmationCode") }}</p>
        <p class="text-italic text-grey-9">
          {{ $t("messages.information.whatsappVerificationInformation").replace('[PHONE]', integration.phone) }}
        </p>
        <q-input
          type="text"
          :hint="$t('messages.information.telegramIntegrationNamePlaceholder')"
          outlined
          v-model="integration.name"
          :label="$t('common.name')"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || $t('messages.errors.requireField'),
          ]"
          maxlength="50"
        />
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
  name: "ComponentWhatsappForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingRequestCode: false,
      integration: { phone: "", code: "", name: "" },
      activeForm: "requestCode",
    };
  },
  methods: {
    onSubmit() {
      this.$emit("saved", { uniqueCode: this.integration.code, name: this.integration.name });
    },
    validatePhone(phone) {
      if(/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im.test(phone) === false || String(phone).length !== 10){
        return false;
      }
      return true;
    },
    requestCode() {
      this.loadingRequestCode = true;
      this.$store
        .dispatch("integrations/requestWhatsappCode", {
          phone: '1'+this.integration.phone,
        })
        .then(() => {
          this.activeForm = "confirmCode";
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message
          });
        })
        .finally(() => {
          this.loadingRequestCode = false;
        });
    },
  },
};
</script>
