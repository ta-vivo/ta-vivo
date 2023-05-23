<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <template v-if="success">
      <q-banner class="bg-positive text-white" style="margin-top: 30%">
        {{ $t("messages.helpCenter.contactFormSuccess") }}
      </q-banner>
    </template>
    <template v-else>
      <p class="q-mb-md">
        {{ $t("messages.helpCenter.contactFormDescription") }}
      </p>
      <q-input
        outlined
        v-model="name"
        :label="$t('common.name')"
        counter
        maxlength="50"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        outlined
        type="email"
        v-model="email"
        :label="$t('common.email')"
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        type="textarea"
        outlined
        counter
        maxlength="500"
        v-model="message"
        :label="$t('common.message')"
      />
      <div class="text-center">
        <q-btn
          :loading="loading"
          :disable="!isFormFilled"
          push
          :label="$t('action.sendMessage')"
          type="submit"
          color="primary"
        />
      </div>
    </template>
  </q-form>
</template>

<script>
import { ref, computed } from "vue";
import emailjs from "@emailjs/browser";

export default {
  name: "ComponentContactForm",
  setup() {
    const name = ref("");
    const email = ref("");
    const message = ref("");
    const loading = ref(false);
    const success = ref(false);

    const isFormFilled = computed(() => {
      return name.value && email.value && message.value ? true : false;
    });

    return {
      name,
      email,
      message,
      isFormFilled,
      loading,
      success,
      onSubmit() {
        loading.value = true;

        const templateParams = {
          name: name.value,
          email: email.value,
          message: message.value,
        };

        emailjs
          .send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.EMAILJS_PUBLIC_KEY
          )
          .then(
            (response) => {
              success.value = true;
              console.log("SUCCESS!", response.status, response.text);
            },
            (err) => {
              console.log("FAILED...", err);
            }
          )
          .finally(() => {
            loading.value = false;
          });
      },
    };
  },
};
</script>
