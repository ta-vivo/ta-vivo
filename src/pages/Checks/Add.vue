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
                  v-model="check.addIntegrations"
                  :val="integration.id"
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
import SmallIntegrationIcon from 'components/Integrations/Icons/Small';

export default {
  name: "PageCheckForm",
  components: {SmallIntegrationIcon},
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $t = useI18n().t;

    const check = ref({
      name: "",
      target: "",
      periodToCheck: 0,
      enabled: true,
      addIntegrations: [],
    });
    const loading = ref(false);
    const integrations = ref([]);
    const periods = ref($store.getters["checks/getPeriods"]);

    $store.dispatch("integrations/fetchAll").then((response) => {
      integrations.value = response.data.data;
    });

    return {
      check,
      loading,
      periods,
      integrations,
      onSubmit() {
        loading.value = true;
        const newCheck = {
          name: check.value.name,
          target: check.value.target,
          periodToCheck: periods.value[check.value.periodToCheck],
          enabled: check.value.enabled,
          addIntegrations: check.value.addIntegrations.map((id) => {
            const integration = integrations.value.find((i) => i.id === id);
            return {
              id: integration.id,
              type: integration.type,
            };
          }),
        };
        $store
          .dispatch("checks/create", newCheck)
          .then(() => {
            $q.notify({
              message: $t("action.checkCreated"),
              color: "positive",
            });
            $router.push("/checks");
          })
          .catch((error) => {
            $q.notify({
              color: "negative",
              message: error.response.data.message
            });
          })
          .finally(() => {
            loading.value = false;
          });
      }
    };
  },
};
</script>
