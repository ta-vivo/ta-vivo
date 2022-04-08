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
            :key="integration"
          >
            <q-item-section avatar>
              <integration-icon :type="integration" size="md" />
            </q-item-section>

            <q-item-section class="text-capitalize">{{
              integration
            }}</q-item-section>
            <q-item-section side>
              <q-btn
                push
                color="primary"
                :label="$t('action.addIntegration')"
                icon="eva-plus"
                @click="selectedIntegration = integration"
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
        <SlackForm v-if="selectedIntegration === 'slack'" />
        <DiscordForm v-if="selectedIntegration === 'discord'" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import TelegramForm from "components/Integrations/Form/Telegram";
import EmailForm from "components/Integrations/Form/Email";
import SlackForm from "components/Integrations/Form/Slack";
import IntegrationIcon from "components/Integrations/Icons/Small";
import DiscordForm from "components/Integrations/Form/Discord";
import jwtDecode from "jwt-decode";

export default {
  name: "PageAddIntegration",
  components: {
    TelegramForm,
    EmailForm,
    SlackForm,
    IntegrationIcon,
    DiscordForm,
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
      "discord",
      "email",
      "slack",
      "telegram",
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
            $store.dispatch("auth/me").then((response) => {
              const token = response.data.data.token;
              const decoded = jwtDecode(token);

              $store.commit("auth/SET_USER", decoded);
            })
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
