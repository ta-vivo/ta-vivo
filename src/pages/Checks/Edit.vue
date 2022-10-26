<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">
          {{ $t("action.editCheck") }}
          <q-toggle
            color="primary"
            size="lg"
            v-model="check.enabled"
            @update:model-value="
              (val) => (val ? enable(check) : disable(check))
            "
            :disable="check.loadingEnableStatus"
          >
            <q-tooltip class="bg-primary" max-width="200px">
              <span style="font-size: 14px">
                {{
                  check.enabled
                    ? $t("messages.information.diableCheckDescription")
                    : $t("messages.information.enableCheckDescription")
                }}
              </span>
            </q-tooltip>
          </q-toggle>
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
              :label-value="periods[check.periodToCheck].value"
              label-always
              v-model="check.periodToCheck"
              :min="0"
              :max="periods.length - 1"
            />
          </div>
          <div>
            <q-select
              outlined
              v-model="check.timezone"
              :options="timezones"
              :label="$t('common.timezone')"
              option-value="code"
              option-label="code"
              emit-value
              map-options
              use-input
              @filter="filterTimezone"
            />
          </div>
          <div>
            <p class="text-bold">
              {{ $t("common.retryOnFail") }}
            </p>
            <div>
              <span class="text-grey-7">
                <q-icon name="eva-alert-circle-outline" />
                {{ $t("messages.information.retryOnFailDescription") }}
              </span>
            </div>
            <q-toggle v-model="check.retryOnFail" :disable="isBasicUser()" />
            <role-badge
              v-if="isBasicUser()"
              class="cursor-pointer"
              @click="$router.push('/pricing')"
              role="Pro"
            />
            <template v-if="check.retryOnFail">
              <q-slider
                :disable="isBasicUser()"
                markers
                label
                :label-value="periods[check.onFailPeriodToCheck].value"
                label-always
                v-model="check.onFailPeriodToCheck"
                :min="0"
                :max="periods.length - 1"
              />
            </template>
          </div>
          <div>
            <p class="text-bold">
              {{ $t("common.authentication") }}
            </p>
            <div>
              <span class="text-grey-7">
                <q-icon name="eva-alert-circle-outline" />
                {{ $t("messages.information.authenticationDescription") }}
              </span>
            </div>
            <q-toggle v-model="useAuthorizationHeader" />
            <div class="q-gutter-md" v-if="useAuthorizationHeader">
              <q-select
                ref="refAuthorizationHeaderDropdown"
                outlined
                v-model="check.authorizationHeader.name"
                :options="commonAuthorizationHeader"
                :label="$t('common.header')"
                @new-value="onNewAuthorizationHeader"
                use-input
                :hint="
                  $t('messages.information.writeACustomValueAndPressEnter')
                "
              />
              <q-input
                type="textarea"
                outlined
                v-model="check.authorizationHeader.token"
                :label="$t('common.token')"
              />
            </div>
          </div>
          <div>
            <p class="text-bold">
              {{ $t("common.integrations") }}
              <q-spinner
                v-show="loadingIntegrations"
                color="primary"
                size="1em"
              />
            </p>
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
            <template v-if="integrations.length === 0">
              <NoIntegrationsAction />
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
import SmallIntegrationIcon from "components/Integrations/Icons/Small";
import RoleBadge from "components/User/RoleBadge.vue";
import timezonesJson from "assets/timezones.json";
import NoIntegrationsAction from "components/Integrations/NoIntegrationsAction.vue";

export default {
  name: "PageCheckEdit",
  components: { SmallIntegrationIcon, RoleBadge, NoIntegrationsAction },
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
              (period) => period.value === this.check.periodToCheckLabel
            );
            this.check.periodToCheck = period;

            this.check.retryOnFail;
            const onFailPeriod = this.periods.findIndex(
              (period) => period.value === this.check.onFailPeriodToCheckLabel
            );
            this.check.onFailPeriodToCheck =
              onFailPeriod === -1 ? 0 : onFailPeriod;

            this.check.currentIntegrations = this.check.check_integrations.map(
              (integration) => integration.integration.id
            );

            if (response.data.data.authorizationHeader) {
              this.useAuthorizationHeader = true;
              this.check.authorizationHeader.name =
                this.check.authorizationHeader.name || "";
            }
          });
      })
      .finally(() => {
        this.$q.loading.hide();
      });
  },
  mounted() {
    document.addEventListener("visibilitychange", this.fetchIntegrationsOnFocusWindow);
  },
  unmounted() {
    document.removeEventListener("visibilitychange", this.fetchIntegrationsOnFocusWindow);
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
        timezone: "",
        loadingEnableStatus: false,
        authorizationHeader: {
          name: "Authorization",
          token: "",
        },
      },
      useAuthorizationHeader: false,
      commonAuthorizationHeader: [
        "Authorization",
        "X-Auth-Token",
        "X-Auth-Key",
      ],
      refAuthorizationHeaderDropdown: null,
      loading: false,
      loadingIntegrations: false,
      timezones: [],
      periods: this.$store.getters["checks/getPeriods"].filter((period) =>
        period.roles.includes(
          this.$store.getters["auth/getUser"].role.toLowerCase()
        )
      ),
      integrations: [],
    };
  },
  methods: {
    fetchIntegrationsOnFocusWindow() {
      if (document.visibilityState === "visible") {
        this.$store
          .dispatch("integrations/fetchAll")
          .then((response) => {
            this.integrations = response.data.data;
          })
          .finally(() => {
            this.loadingIntegrations = false;
          });
      }
    },
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
        periodToCheck: this.periods[this.check.periodToCheck].value,
        enabled: this.check.enabled,
        addIntegrations: this.check.addIntegrations,
        removeIntegrations: this.check.removeIntegrations,
        onFailPeriodToCheck: this.periods[this.check.onFailPeriodToCheck].value,
        retryOnFail: this.check.retryOnFail,
        timezone: this.check.timezone,
      };

      if (this.useAuthorizationHeader) {
        updatedCheck.authorizationHeader = {
          name: this.check.authorizationHeader.name,
          token: this.check.authorizationHeader.token,
        };
      } else {
        updatedCheck.removeAuthorizationHeader = true;
      }

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
            message: error.response.data.message,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    isBasicUser() {
      return this.$store.getters["auth/getUser"].role === "basic";
    },
    filterTimezone(val, update) {
      if (val === "") {
        update(() => {
          this.timezones = timezonesJson;
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.timezones = timezonesJson.filter(
          (v) => v.code.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    enable(check) {
      this.check.loadingEnableStatus = true;

      this.$store
        .dispatch("checks/enable", check.id)
        .then(() => {
          this.$q.notify({
            position: "top",
            color: "positive",
            textColor: "white",
            message: this.$t("action.checkEnabled"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.check.loadingEnableStatus = false;
          }, 2500);
        });
    },
    disable(check) {
      this.check.loadingEnableStatus = true;
      this.$store
        .dispatch("checks/disable", check.id)
        .then(() => {
          this.$q.notify({
            position: "top",
            color: "positive",
            textColor: "white",
            message: this.$t("action.checkDisabled"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.check.loadingEnableStatus = false;
          }, 2500);
        });
    },
    onNewAuthorizationHeader(value) {
      this.check.authorizationHeader.name = value;
      this.commonAuthorizationHeader = this.commonAuthorizationHeader.filter(
        (header) => header !== value
      );
      this.$refs.refAuthorizationHeaderDropdown.blur();
    },
  },
};
</script>
