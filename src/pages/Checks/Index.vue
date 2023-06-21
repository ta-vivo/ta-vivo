<template>
  <q-page padding>
    <div>
      <q-btn
        class="create-check"
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addCheck')"
        to="/checks/add"
        :disable="reachedTheLimit()"
      />
      <q-btn
        class="go-to-status-pages q-ml-sm"
        outline
        color="primary"
        icon="eva-bar-chart-outline"
        :label="$t('common.statusPages')"
        to="/status-pages"
      />
      <span
        :class="`${$q.screen.lt.md ? 'block q-mt-md' : null} q-ml-sm`"
        v-if="reachedTheLimit()"
      >
        <q-icon size="sm" name="eva-info-outline" />
        {{ $t("messages.information.reachedLimit") }}.
        <router-link class="text-primary" to="/pricing">{{
          $t("common.viewAllPlans")
        }}</router-link>
      </span>
    </div>
    <q-table
      :grid="$q.screen.xs"
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[10]"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="checksPagination"
      @request="fetchChecks"
    >
      <!-- Gid -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat>
            <q-card-section>
              <div class="text-grey-8">
                {{ $t("common.status") }}
              </div>
              <div class="q-mb-sm">
                <q-chip
                  class="q-ml-none"
                  :color="props.row.enabled ? 'positive' : 'negative'"
                  text-color="white"
                >
                  {{
                    props.row.enabled
                      ? $t("common.enabled")
                      : $t("common.disabled")
                  }}
                  <q-icon
                    v-show="props.row.check_authorization"
                    size="sm"
                    name="eva-lock-outline"
                    class="cursor-pointer"
                  >
                    <q-tooltip class="bg-primary">
                      {{
                        $t("messages.information.authorizationHeaderConfigured")
                      }}
                    </q-tooltip>
                  </q-icon>
                </q-chip>
              </div>
              <div class="text-grey-8">{{ $t("common.name") }}</div>
              <div class="q-mb-sm">{{ props.row.name }}</div>
              <div class="text-grey-8">{{ $t("common.target") }}</div>
              <div class="q-mb-sm">{{ props.row.target }}</div>
              <div class="text-grey-8">{{ $t("common.integrations") }}</div>
              <div class="q-mb-sm">
                <template
                  v-for="checkIntegration in props.row.check_integrations"
                  :key="checkIntegration.id"
                >
                  <div class="the-integration items-center q-my-sm">
                    <small-integration-Icon
                      :type="checkIntegration.integration.type"
                    >
                      <q-tooltip>
                        {{ checkIntegration.integration.name }}
                      </q-tooltip>
                    </small-integration-Icon>
                  </div>
                </template>
              </div>
              <div class="text-grey-8">{{ $t("common.period") }}</div>
              <div class="q-mb-sm">
                {{ props.row.periodToCheckLabel }}
                <template v-if="props.row.retryOnFail">
                  <q-icon color="primary" name="eva-repeat-outline">
                    <q-tooltip class="bg-primary">
                      {{
                        `${$t("common.retryOnFail")} ${
                          props.row.onFailPeriodToCheckLabel
                        }`
                      }}
                    </q-tooltip>
                  </q-icon>
                </template>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-toggle
                v-model="props.row.enabled"
                color="primary"
                @update:model-value="
                  (val) => (val ? disable(props.row) : enable(props.row))
                "
                :disable="props.row.loadingEnableStatus"
              >
                <q-tooltip class="bg-primary" max-width="200px">
                  <span style="font-size: 14px">
                    {{
                      props.row.enabled
                        ? $t("messages.information.diableCheckDescription")
                        : $t("messages.information.enableCheckDescription")
                    }}
                  </span>
                </q-tooltip>
              </q-toggle>
              <q-btn
                :label="$t('action.viewLogs')"
                flat
                size="sm"
                icon="eva-file-text-outline"
                @click="handleShowLogs(props.row)"
              />
              <q-btn
                :label="$t('common.details')"
                flat
                size="sm"
                icon="eva-edit-outline"
                :to="`/checks/edit/${props.row.id}`"
              />
              <q-btn
                :label="$t('action.delete')"
                color="negative"
                flat
                size="sm"
                icon="eva-trash-outline"
                @click="handleDeleteCheck(props.row)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <!-- Table -->
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.enabled ? 'positive' : 'negative'"
            text-color="white"
          >
            {{
              props.row.enabled ? $t("common.enabled") : $t("common.disabled")
            }}
            <q-icon
              v-show="props.row.check_authorization"
              size="sm"
              name="eva-lock-outline"
              class="cursor-pointer"
            >
              <q-tooltip class="bg-primary">
                {{ $t("messages.information.authorizationHeaderConfigured") }}
              </q-tooltip>
            </q-icon>
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
      <template v-slot:body-cell-periodToCheckLabel="props">
        <q-td :props="props">
          {{ props.row.periodToCheckLabel }}
          <template v-if="props.row.retryOnFail">
            <q-icon size="16" color="primary" name="eva-repeat-outline">
              <q-tooltip class="bg-primary">
                {{
                  `${$t("common.retryOnFail")} ${
                    props.row.onFailPeriodToCheckLabel
                  }`
                }}
              </q-tooltip>
            </q-icon>
          </template>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-toggle
            v-model="props.row.enabled"
            color="primary"
            @update:model-value="
              (val) => (val === true ? enable(props.row) : disable(props.row))
            "
            :disable="props.row.loadingEnableStatus"
          >
            <q-tooltip class="bg-primary" max-width="200px">
              <span style="font-size: 14px">
                {{
                  props.row.enabled
                    ? $t("messages.information.diableCheckDescription")
                    : $t("messages.information.enableCheckDescription")
                }}
              </span>
            </q-tooltip>
          </q-toggle>
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
            icon="eva-edit-outline"
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
        <q-card-section class="q-py-none">
          <div class="text-grey-7">
            {{ tempCheck.target }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-12 text-center">
            <div class="row">
              <div class="col-4">
                <div class="text-bold text-h4">
                  {{ getUpTimePercent(logs.details) }}
                </div>
                <div class="text-grey-7">
                  {{ $t("common.totalUpTime") }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-bold text-h4">
                  {{ getTheAverageResponseTime(logs.details) }}
                </div>
                <div class="text-grey-7">
                  {{ $t("common.avgResponseTime") }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-bold text-h4 ellipsis">
                  {{ tempCheck.timezone }}
                </div>
                <div class="text-grey-7">{{ $t("common.timezone") }}</div>
              </div>
              <div class="col-12 text-grey-7">
                {{ $t("common.period") }} {{ tempCheck.periodToCheckLabel }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-12">
              <template v-if="loadingLogs">
                <q-skeleton height="250px" square />
              </template>
              <template v-else>
                <apex-charts
                  type="area"
                  height="250"
                  :options="logs.chartOptions"
                  :series="logs.series"
                />
                <div class="text-grey-7 text-center">
                  {{ $t("common.lastRecords").replace("[NUMBER]", 10) }}
                  <span class="q-mx-md">-</span>
                  <q-btn
                    @click="() => handleLogsDownload()"
                    :loading="downloadingLogs"
                    flat
                    dense
                    color="primary"
                    :label="$t('action.downloadAll')"
                  />
                </div>
              </template>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useQuasar, colors } from "quasar";
import SmallIntegrationIcon from "components/Integrations/Icons/Small";
import jwtDecode from "jwt-decode";
import { getTimestampInHumanFormat } from "src/utils/time";
import {
  getTheAverageResponseTime,
  getUpTimePercent,
} from "src/utils/functions";
import ApexCharts from "vue3-apexcharts";

export default {
  name: "PageChecks",
  components: { SmallIntegrationIcon, ApexCharts },
  setup() {
    const $t = useI18n().t;
    const $q = useQuasar();
    const store = useStore();
    const downloadingLogs = ref(false);

    // chart options
    const series = ref([
      {
        name: "ms",
        data: [],
      },
    ]);
    const chartOptions = ref({
      chart: {
        height: 250,
        width: "100%",
        type: "area",
        toolbar: {
          show: false,
        },
      },
      colors: [colors.getPaletteColor("positive")],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [],
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    });

    const truncatext = (text, length) => {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      }
      return text;
    };

    const getMsOrSecondsFromMs = (ms) => {
      if (ms < 1000) {
        return `${ms} ms`;
      }
      return `${(ms / 1000).toFixed(2)} ${$t("common.seconds")}`;
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
        name: "ResponseTime",
        label: $t("common.responseTime"),
        align: "left",
        field: (row) => getMsOrSecondsFromMs(row.duration),
      },
      {
        name: "createdAt",
        label: $t("common.date"),
        align: "left",
        field: (row) =>
          `${getTimestampInHumanFormat(row.createdAt, row.timezone)} (${
            row.timezone
          })`,
      },
    ];
    const logsPagination = ref({
      sortBy: "id",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const checksPagination = ref({
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
    const logs = ref({
      series: [],
      chartOptions: {},
      details: [],
    });
    const tempCheck = ref({});

    const fetchChecks = (props) => {
      loading.value = true;

      if (props) {
        const { page, rowsPerPage } = props.pagination;
        checksPagination.value.rowsPerPage = rowsPerPage;
        checksPagination.value.page = page;
      }
      const queryString = `?page=${checksPagination.value.page}&limit=${checksPagination.value.rowsPerPage}&sort=-created_at`;

      store
        .dispatch("checks/fetchAll", queryString)
        .then((response) => {
          checksPagination.value.rowsNumber = response.data.pagination.total;
          rows.value = response.data.data.map((check) => {
            return {
              ...check,
              loadingEnableStatus: false,
            };
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    fetchChecks();

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

          logs.value.details = results.data;
          logsPagination.value.rowsNumber = results.pagination.total;

          logs.value.series = series.value;
          logs.value.chartOptions = chartOptions.value;

          logs.value.series[0].data = results.data.map((log) => {
            return log.duration;
          });
          logs.value.chartOptions.xaxis.categories = results.data.map((log) => {
            return log.createdAt;
          });
        })
        .finally(() => {
          loadingLogs.value = false;
        });
    };

    const disable = (check) => {
      const index = rows.value.findIndex((item) => item.id === check.id);
      rows.value[index].loadingEnableStatus = true;
      store
        .dispatch("checks/disable", check.id)
        .then(() => {
          $q.notify({
            position: "top",
            color: "positive",
            textColor: "white",
            message: $t("action.checkDisabled"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            rows.value[index].loadingEnableStatus = false;
          }, 2500);
        });
    };

    const enable = (check) => {
      const index = rows.value.findIndex((item) => item.id === check.id);
      rows.value[index].loadingEnableStatus = true;

      store
        .dispatch("checks/enable", check.id)
        .then(() => {
          $q.notify({
            position: "top",
            color: "positive",
            textColor: "white",
            message: $t("action.checkEnabled"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            rows.value[index].loadingEnableStatus = false;
          }, 2500);
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
      checksPagination,
      handleShowLogs,
      fetchlogs,
      fetchChecks,
      disable,
      enable,
      getTheAverageResponseTime,
      getUpTimePercent,
      downloadingLogs,
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
                  });
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
      handleLogsDownload(){
        downloadingLogs.value = true;

        store.dispatch('checks/downloadCheckLogs', tempCheck.value.id)
        .then(response => {
          const blob = new Blob([response.data], { type: 'text/csv' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${tempCheck.value.name}.csv`
          link.click()
        })
        .finally(() => {
          downloadingLogs.value = false;
        })
      }
    };
  },
};
</script>
