<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-5">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <p class="text-bold">{{ $t("common.basicInformation") }}</p>
        </div>
        <q-input
          input-class="name"
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
          input-class="token"
          type="text"
          :hint="$t('messages.information.uniqueCodeGetFromTelegram')"
          outlined
          v-model="integration.uniqueCode"
          :label="$t('common.uniqueCode')"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || $t('messages.errors.requireField'),
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
    <div class="col-xs-12 col-md-6">
      <p class="text-bold">Telegram</p>
      <p>{{ $t("messages.information.telegramSetupInformation") }}</p>
      <q-separator class="q-mb-md" />
      <p>
        <span class="text-bold">1-</span> {{ $t("messages.information.telegramSetupBot") }}
        <a
          class="text-primary text-bold bot-link"
          href="https://t.me/TaVivoBot"
          target="_blank"
          >@ta-vivo-bot</a
        >
      </p>
      <p>
        <span class="text-bold">2-</span> {{ $t("messages.information.telegramSetupBotCommand") }}
        <q-img
          class="q-mt-md telegram-demo"
          src="~assets/telegram/telegram-bot-command.jpeg"
          spinner-color="white"
          style="max-width: 80%"
        />
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "ComponentTelegramForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const integration = ref({
      name: "",
      uniqueCode: "",
    });
    return {
      integration,
      onSubmit() {
        emit("saved", integration.value);
      },
    };
  },
};
</script>
