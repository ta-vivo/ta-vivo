<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">{{ $t("action.addIntegration") }}</p>
        <q-btn
          v-if="selectedIntegration"
          flat
          color="primary"
          :label="$t('action.backToTheList')"
          icon="eva-arrow-back-outline"
          @click="selectedIntegration = null"
        />
      </q-card-section>
      <q-card-section v-if="!selectedIntegration">
        <q-list bordered>
          <q-item
            v-for="integration in availableIntegrations"
            :key="integration.name"
          >
            <q-item-section avatar>
              <q-img
                :src="integration.icon"
                style="width: 23px;"
                spinner-color="white"
                v-if="integration.isImage"
              />
              <q-icon
                v-else
                :color="integration.color"
                :name="integration.icon"
              />
            </q-item-section>

            <q-item-section class="text-capitalize">{{
              integration.name
            }}</q-item-section>
            <q-item-section side>
              <q-btn
                push
                color="primary"
                :label="$t('action.addIntegration')"
                icon="eva-plus"
                @click="selectedIntegration = integration.name"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-if="selectedIntegration">
        <TelegramForm
          v-if="selectedIntegration === 'telegram'"
          :loading="loading"
          @saved="onSubmit"
        />
        <EmailForm
          v-if="selectedIntegration === 'email'"
          :loading="loading"
          @saved="onSubmit"
        />
        <SlackForm
          v-if="selectedIntegration === 'slack'"
          :loading="loading"
          @saved="onSubmit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { fabTelegram, farEnvelope } from "@quasar/extras/fontawesome-v5";
import { useI18n } from "vue-i18n";
import TelegramForm from "components/Integrations/Form/Telegram";
import EmailForm from "components/Integrations/Form/Email";
import SlackForm from "components/Integrations/Form/Slack";
import slackImage from "assets/slack-logo.png";

export default {
  name: "PageAddIntegration",
  components: {
    TelegramForm,
    EmailForm,
    SlackForm
  },
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $t = useI18n().t;

    const integration = ref({
      name: "",
      uniqueCode: "",
    });
    const loading = ref(false);
    const availableIntegrations = ref([
      {
        name: "telegram",
        icon: fabTelegram,
        color: "blue",
      },
      {
        name: "email",
        icon: farEnvelope,
        color: "grey",
      },
      {
        name: "slack",
        icon: slackImage,
        color: "green",
        isImage: true,
      },
    ]);
    const selectedIntegration = ref(null);

    return {
      integration,
      loading,
      availableIntegrations,
      selectedIntegration,
      onSubmit(newIntegration) {
        loading.value = true;
        $store
          .dispatch("integrations/create", newIntegration)
          .then(() => {
            $q.notify({
              message: $t("action.integrationCreated"),
              color: "positive",
            });
            $router.push("/integrations");
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              message: error.response.data.message,
              icon: fabTelegram,
            });
          })
          .finally(() => {
            loading.value = false;
          });
      },
      getIntegrationIcon(integration) {
        switch (integration) {
          case "telegram":
            return { icon: fabTelegram, color: "blue" };
          default:
            return "";
        }
      },
    };
  },
};
</script>
