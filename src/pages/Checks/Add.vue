<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">{{ $t("action.addCheck") }}</p>
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
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    $t('messages.errors.requireField'),
                ]"
              />
            </div>
          </div>
          <div>
            <p class="text-bold">{{ $t("common.integrations") }}</p>
            <template v-for="integration in integrations" :key="integration.id">
              <div>
                <q-toggle
                  v-model="check.addIntegrations"
                  :val="integration.id"
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
              icon="eva-save-outline"
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
import { useI18n } from "vue-i18n";
import SmallIntegrationIcon from "components/Integrations/Icons/Small";
import jwtDecode from "jwt-decode";
import RoleBadge from "components/User/RoleBadge.vue";
import timezonesJson from "assets/timezones.json";
import NoIntegrationsAction from "components/Integrations/NoIntegrationsAction.vue";

export default {
  name: "PageCheckForm",
  components: { SmallIntegrationIcon, RoleBadge, NoIntegrationsAction },
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $t = useI18n().t;
    const timezones = ref([]);
    const useAuthorizationHeader = ref(false);
    const commonAuthorizationHeader = ref([
      "Authorization",
      "X-Auth-Token",
      "X-Auth-Key",
    ]);
    const refAuthorizationHeaderDropdown = ref(null);

    const check = ref({
      name: "",
      target: "",
      periodToCheck: 0,
      enabled: true,
      addIntegrations: [],
      retryOnFail: false,
      onFailPeriodToCheck: 0,
      timezone: $store.getters["auth/getUser"].timezone,
      authorizationHeader: {
        name: "Authorization",
        token: "",
      },
    });
    const loading = ref(false);
    const integrations = ref([]);
    const periods = ref(
      $store.getters["checks/getPeriods"].filter((period) =>
        period.roles.includes($store.getters["auth/getUser"].role.toLowerCase())
      )
    );

    $store.dispatch("integrations/fetchAll").then((response) => {
      integrations.value = response.data.data;
    });

    return {
      check,
      loading,
      periods,
      integrations,
      timezones,
      useAuthorizationHeader,
      commonAuthorizationHeader,
      onNewAuthorizationHeader(value) {
        check.value.authorizationHeader.name = value;
        commonAuthorizationHeader.value =
          commonAuthorizationHeader.value.filter((header) => header !== value);
        refAuthorizationHeaderDropdown.value.blur();
      },
      refAuthorizationHeaderDropdown,
      onSubmit() {
        loading.value = true;
        const newCheck = {
          name: check.value.name,
          target: check.value.target,
          periodToCheck: periods.value[check.value.periodToCheck].value,
          enabled: check.value.enabled,
          retryOnFail: check.value.retryOnFail,
          onFailPeriodToCheck:
            periods.value[check.value.onFailPeriodToCheck].value,
          addIntegrations: check.value.addIntegrations.map((id) => {
            const integration = integrations.value.find((i) => i.id === id);
            return {
              id: integration.id,
              type: integration.type,
            };
          }),
          timezone: check.value.timezone,
        };

        if (useAuthorizationHeader.value) {
          newCheck.authorizationHeader = {
            name: check.value.authorizationHeader.name,
            token: check.value.authorizationHeader.token,
          };
        }

        $store
          .dispatch("checks/create", newCheck)
          .then(() => {
            $store.dispatch("auth/me").then((response) => {
              const token = response.data.data.token;
              const decoded = jwtDecode(token);

              $store.commit("auth/SET_USER", decoded);
            });
            $q.notify({
              message: $t("action.checkCreated"),
              color: "positive",
            });
            $router.push("/checks");
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
      isBasicUser() {
        return $store.getters["auth/getUser"].role === "basic";
      },
      filterTimezone(val, update) {
        if (val === "") {
          update(() => {
            timezones.value = timezonesJson;

            // here you have access to "ref" which
            // is the Vue reference of the QSelect
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          timezones.value = timezonesJson.filter(
            (v) => v.code.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
};
</script>
