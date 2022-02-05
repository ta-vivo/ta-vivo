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
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.enabled ? 'positive' : 'negative'"
            text-color="white"
          >
            {{
              props.row.enabled ? $t("common.enabled") : $t("common.disabled")
            }}
          </q-chip>
        </q-td>
      </template>
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
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            size="sm"
            icon="eva-file-text-outline"
            @click="handleShowLogs(props.row)"
          />
          <q-btn
            flat
            size="sm"
            icon="eva-eye-outline"
            :to="`/checks/edit/${props.row.id}`"
          />
          <q-btn
            color="negative"
            flat
            size="sm"
            icon="eva-trash-outline"
            @click="handleDeleteCheck(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="showLogsDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ $t("common.check") }} logs - {{ tempCheck.name }}
          </div>
          <q-space />
          <q-btn icon="eva-close-outline" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-table
            bordered
            flat
            :loading="loadingLogs"
            :rows-per-page-options="[]"
            :rows="logs"
            :columns="logsColumns"
            row-key="id"
            v-model:pagination="logsPagination"
            @request="fetchlogs"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.status === 'up' ? 'positive' : 'negative'"
                  text-color="white"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { fabTelegram, farEnvelope } from "@quasar/extras/fontawesome-v5";
import { useQuasar } from "quasar";
import { date } from "quasar";

export default {
  name: "PageChecks",
  setup() {
    const $t = useI18n().t;
    const $q = useQuasar();
    const columns = [
      {
        name: "enabled",
        label: $t("common.status"),
        align: "center",
        field: "enabled",
      },
      {
        name: "name",
        label: $t("common.name"),
        align: "left",
        field: "name",
      },
      {
        name: "target",
        align: "left",
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
        name: "periodToCheckLabel",
        align: "center",
        label: $t("common.period"),
        field: "periodToCheckLabel",
      },
      {
        name: "action",
        label: "",
        field: "action",
      },
    ];
    const logsColumns = [
      {
        name: "status",
        label: $t("common.status"),
        align: "left",
        field: "status",
      },
      {
        name: "createdAt",
        label: $t("common.date"),
        align: "left",
        field: (row) =>
          `${date.formatDate(row.createdAt, "DD/MM/YYYY")} ${$t(
            "common.at"
          )} ${date.formatDate(row.createdAt, "HH:mm:ss")}`,
      },
    ];
    const logsPagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const rows = ref([]);
    const loading = ref(false);
    const showLogsDialog = ref(false);
    const loadingLogs = ref(false);
    const logs = ref([]);
    const tempCheck = ref({});

    const store = useStore();
    store.dispatch("checks/fetchAll").then((response) => {
      rows.value = response.data.data;
    });

    const handleShowLogs = (check) => {
      tempCheck.value = check;
      fetchlogs();
    };

    const fetchlogs = (props) => {
      if (props) {
        const { page, rowsPerPage } = props.pagination;
        logsPagination.value.rowsPerPage = rowsPerPage;
        logsPagination.value.page = page;
      }

      loadingLogs.value = true;
      showLogsDialog.value = true;
      const queryString = `?page=${logsPagination.value.page}&limit=${logsPagination.value.rowsPerPage}&sort=-created_at`
      store
        .dispatch("checks/fetchLogsById", { id: tempCheck.value.id, query: queryString })
        .then((response) => {
          const results = response.data;
          logsPagination.value.rowsNumber = results.pagination.total;
          logs.value = results.data;
        })
        .finally(() => {
          loadingLogs.value = false;
        });
    };

    return {
      columns,
      rows,
      loading,
      showLogsDialog,
      loadingLogs,
      logs,
      tempCheck,
      logsColumns,
      logsPagination,
      handleShowLogs,
      fetchlogs,
      getIntegrationIcon(integration) {
        switch (integration) {
          case "telegram":
            return { icon: fabTelegram, color: "blue" };
          case "email":
            return { icon: farEnvelope, color: "grey" };
          default:
            return "";
        }
      },
      handleDeleteCheck(check) {
        $q.dialog({
          title: "Confirm",
          message: $t("messages.information.areYouSureYouWantToDelete").replace(
            "[ITEM]",
            check.name
          ),
          cancel: true,
          ok: {
            label: $t("action.delete"),
            color: "negative",
          },
          cancel: {
            label: $t("action.noKeepIt"),
            color: "primary",
            outline: true,
          },
          persistent: true,
        }).onOk(() => {
          $q.loading.show({});
          store
            .dispatch("checks/remove", { id: check.id })
            .then(() => {
              loading.value = true;
              store
                .dispatch("checks/fetchAll")
                .then((response) => {
                  rows.value = response.data.data;
                })
                .finally(() => {
                  loading.value = false;
                });
            })
            .finally(() => {
              $q.loading.hide();
            });
        });
      },
    };
  },
};
</script>
