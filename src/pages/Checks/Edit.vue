<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">
          {{ $t("action.editCheck") }}
          <q-toggle size="lg" v-model="check.enabled" />
        </p>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>
            <p class="text-bold">{{ $t("common.basicInformation") }}</p>
          </div>
          <q-input
            type="text"
            outlined
            v-model="check.name"
            :label="$t('common.name')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || $t('messages.errors.requireField'),
            ]"
            maxlength="50"
            :hint="`${check.name.length}/50`"
          />
          <q-input
            type="text"
            hint="http://example.com or http://192.168.1.1:5000"
            outlined
            v-model="check.target"
            :label="$t('common.target')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || $t('messages.errors.requireField'),
            ]"
          />
          <div>
            <p class="text-bold">{{ $t("common.period") }}</p>
            <q-slider
              markers
              label
              :label-value="periods[check.periodToCheck]"
              label-always
              v-model="check.periodToCheck"
              :min="0"
              :max="periods.length - 1"
            />
          </div>
          <div>
            <p class="text-bold">{{ $t("common.integrations") }}</p>
            <template v-for="integration in integrations" :key="integration.id">
              <div>
                <q-toggle
                  v-model="check.currentIntegrations"
                  :val="integration.id"
                  @update:model-value="onToggleIntegration(integration.id)"
                />
                <small-Integration-Icon :type="integration.type" />
                {{ integration.name }}
                <q-separator />
              </div>
            </template>
          </div>
          <div class="text-center">
            <q-btn
              push
              :loading="loading"
              :label="$t('action.save')"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import SmallIntegrationIcon from 'components/Integrations/Icons/Small';

export default {
  name: "PageCheckEdit",
  components: {SmallIntegrationIcon},
  created() {
    this.$q.loading.show();

    this.$store
      .dispatch("integrations/fetchAll")
      .then((response) => {
        this.integrations = response.data.data;
        return;
      })
      .then(() => {
        this.$store
          .dispatch("checks/fetch", {
            id: this.$route.params.id,
          })
          .then((response) => {
            this.check = { ...this.check, ...response.data.data };
            const period = this.periods.findIndex(
              (period) => period === this.check.periodToCheckLabel
            );
            this.check.periodToCheck = period;
            this.check.currentIntegrations = this.check.check_integrations.map(
              (integration) => integration.integration.id
            );
          });
      })
      .finally(() => {
        this.$q.loading.hide();
      });
  },
  data() {
    return {
      check: {
        name: "",
        target: "",
        periodToCheck: 0,
        enabled: true,
        currentIntegrations: [],
        addIntegrations: [],
        removeIntegrations: [],
      },
      loading: false,
      periods: this.$store.getters["checks/getPeriods"],
      integrations: [],
    };
  },
  methods: {
    onToggleIntegration(integrationId) {
      const isChecked = this.check.currentIntegrations.includes(integrationId);
      const isOnCurrent = this.check.check_integrations.find(
        (integration) => integration.integration.id === integrationId
      );
      if (isChecked) {
        if (!isOnCurrent) {
          this.check.addIntegrations.push({ id: integrationId });
        }
        this.check.removeIntegrations = this.check.removeIntegrations.filter(
          (integration) => integration.id !== integrationId
        );
      } else {
        this.check.removeIntegrations.push({ id: integrationId });
        this.check.addIntegrations = this.check.addIntegrations.filter(
          (integration) => integration.id !== integrationId
        );
      }
    },
    onSubmit() {
      this.loading = true;
      const updatedCheck = {
        name: this.check.name,
        target: this.check.target,
        periodToCheck: this.periods[this.check.periodToCheck],
        enabled: this.check.enabled,
        addIntegrations: this.check.addIntegrations,
        removeIntegrations: this.check.removeIntegrations,
      };

      this.$store
        .dispatch("checks/update", { id: this.check.id, ...updatedCheck })
        .then(() => {
          this.$q.notify({
            message: this.$t("action.checkUpdated"),
            color: "positive",
          });
          this.$router.push("/checks");
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
};
</script>
