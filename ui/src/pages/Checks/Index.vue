<template>
  <q-page padding>
    <div>
      <q-btn
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addCheck')"
        to="/checks/add"
      />
    </div>
    <q-table
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[]"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-check_integrations="props">
        <q-td :props="props">
          <template
            v-for="checkIntegration in props.value"
            :key="checkIntegration.id"
          >
            <div class="the-integration items-center">
              <q-btn
                round
                flat
                size="sm"
                :icon="
                  getIntegrationIcon(checkIntegration.integration.type).icon
                "
                :text-color="
                  getIntegrationIcon(checkIntegration.integration.type).color
                "
              >
                <q-tooltip>
                  {{ checkIntegration.integration.name }}
                </q-tooltip>
              </q-btn>
            </div>
          </template>
        </q-td>
      </template>
      ></q-table
    >
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { fabTelegram } from "@quasar/extras/fontawesome-v5";

export default {
  name: "PageChecks",
  setup() {
    const $t = useI18n().t;
    const columns = [
      {
        name: "name",
        label: $t("common.name"),
        align: "left",
        field: "name",
      },
      {
        name: "target",
        align: "center",
        label: $t("common.target"),
        field: "target",
      },
      {
        name: "check_integrations",
        align: "center",
        label: $t("common.integrations"),
        field: "check_integrations",
      },
      {
        name: "periodToCheck",
        align: "center",
        label: $t("common.period"),
        field: "periodToCheck",
      },
      {
        name: "actions",
        align: "center",
        label: " ",
        field: "actions",
      },
    ];

    const rows = ref([]);

    const store = useStore();
    store.dispatch("checks/fetchAll").then((response) => {
      rows.value = response.data.data;
    });

    return {
      columns,
      rows,
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
