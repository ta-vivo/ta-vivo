<template>
  <q-page padding>
    <div>
      <q-btn
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addCheck')"
        to="/checks/add"
        :disable="reachedTheLimit()"
      />
      <span :class="`${$q.screen.lt.md ? 'block q-mt-md' : null} q-ml-sm`" v-if="reachedTheLimit()">
        <q-icon size="sm" name="eva-info-outline" />
        {{$t('messages.information.reachedLimit')}}.
        <router-link class="text-primary" to="/pricing">{{$t('common.viewAllPlans')}}</router-link>
      </span>
    </div>
    <q-table
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[]"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
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
            <div class="the-integration items-center q-my-sm">
              <small-integration-Icon :type="checkIntegration.integration.type">
                <q-tooltip>
                  {{ checkIntegration.integration.name }}
                </q-tooltip>
              </small-integration-Icon>
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
          >
            <q-tooltip>
              {{ $t("action.viewLogs") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            size="sm"
            icon="eva-eye-outline"
            :to="`/checks/edit/${props.row.id}`"
          >
            <q-tooltip>
              {{ $t("common.details") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            color="negative"
            flat
            size="sm"
            icon="eva-trash-outline"
            @click="handleDeleteCheck(props.row)"
          >
            <q-tooltip class="bg-negative">
              {{ $t("action.delete") }}
            </q-tooltip>
          </q-btn>
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
import { useQuasar } from "quasar";
import { date } from "quasar";
import SmallIntegrationIcon from "components/Integrations/Icons/Small";
import jwtDecode from "jwt-decode";

export default {
  name: "PageChecks",
  components: { SmallIntegrationIcon },
  setup() {
    const $t = useI18n().t;
    const $q = useQuasar();

    const truncatext = (text, length) => {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    };
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
        field: (row) => truncatext(row.name, 20),
      },
      {
        name: "target",
        align: "left",
        label: $t("common.target"),
        field: (row) => truncatext(row.target, 30),
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
    loading.value = true;
    store
      .dispatch("checks/fetchAll")
      .then((response) => {
        rows.value = response.data.data;
      })
      .finally(() => {
        loading.value = false;
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
      const queryString = `?page=${logsPagination.value.page}&limit=${logsPagination.value.rowsPerPage}&sort=-created_at`;
      store
        .dispatch("checks/fetchLogsById", {
          id: tempCheck.value.id,
          query: queryString,
        })
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
                  store.dispatch("auth/me").then((response) => {
                    const token = response.data.data.token;
                    const decoded = jwtDecode(token);

                    store.commit("auth/SET_USER", decoded);
                  })
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
      reachedTheLimit() {
        const user = store.getters["auth/getUser"];
        if (user.settings && user.settings.checks) {
          if (user.settings.checks.limit === 0) {
            return false;
          }
          return user.settings.checks.count >= user.settings.checks.limit;
        }

        return false;
      },
    };
  },
};
</script>
