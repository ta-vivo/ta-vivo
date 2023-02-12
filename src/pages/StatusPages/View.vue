<template>
  <q-page padding>
    <div class="header-container text-center">
      <p class="text-h4">{{ statusPage.name }}</p>
      <p class="text-grey-7">{{ statusPage.description }}</p>
    </div>
    <div class="checks-container">
      <q-card
        flat
        bordered
        v-for="(check, index) in statusPage.checks"
        :key="index"
      >
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <div class="text-h6">{{ check.name }}</div>
              <div class="text-grey-7">{{ check.target }}</div>
            </div>
            <div class="col-2">
              <q-chip
                class="q-ml-none"
                :color="check.lastLog.status === 'up' ? 'positive' : 'negative'"
                text-color="white"
              >
                {{ check.lastLog.status }}
              </q-chip>
              <div class="text-grey-7">
                <div>
                  {{ getMsOrSecondsFromMs(check.lastLog.duration) }}
                </div>
              </div>
            </div>
            <div class="col-12 text-center">
              <q-btn
                @click="handleDetails(check)"
                :loading="check.loadingDetails"
                class="full-width"
                flat
                size="sm"
                color="primary"
                :label="check.showDetails ? $t('action.refresh') : $t('common.details')"
              />
            </div>
            <template v-if="check.showDetails">
              <div class="col-12 text-center">
                <div class="row">
                  <div class="col-4">
                    <div class="text-bold text-h4">
                      {{ getUpTimePercent(check.details) }}
                    </div>
                    <div>{{ $t("common.totalUpTime") }}</div>
                  </div>
                  <div class="col-4">
                    <div class="text-bold text-h4">
                      {{ getTheAverageResponseTime(check.details) }}
                    </div>
                    <div>{{ $t("common.avgResponseTime") }}</div>
                  </div>
                  <div class="col-4"></div>
                </div>
              </div>
              <div class="col-12">
                <apex-charts
                  type="area"
                  height="350"
                  :options="chartOptions"
                  :series="series"
                />
              </div>
            </template>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ApexCharts from "vue3-apexcharts";
import { colors } from "quasar";
import {
  getMsOrSecondsFromMs,
  getTheAverageResponseTime,
  getUpTimePercent,
} from "src/utils/functions";

export default {
  name: "PageStatusPagesView",
  components: {
    ApexCharts,
  },
  setup() {
    const $store = useStore();
    const $route = useRoute();
    const $t = useI18n().t;

    const statusPage = ref({
      name: "",
      description: "",
      checks: [],
    });

    // chart options
    const series = ref([
      {
        name: "ms",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ]);
    const chartOptions = ref({
      chart: {
        height: 450,
        width: "100%",
        type: "area",
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
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    });

    const uuid = $route.params.uuid;

    $store
      .dispatch("statusPages/fetchViewByuuid", { uuid })
      .then((response) => {
        statusPage.value = response.data.data;
      });

    return {
      statusPage,
      series,
      chartOptions,
      getMsOrSecondsFromMs,
      getTheAverageResponseTime,
      getUpTimePercent,
      handleDetails: (check) => {
        check.loadingDetails = true;
        const queryString = `?logs=true&check_id=${check.id}`;
        $store
          .dispatch("statusPages/fetchViewByuuid", { uuid, queryString })
          .then((response) => {
            check.details = response.data.data;
            check.showDetails = true;
            series.value[0].data = check.details.map((log) => {
              return log.duration;
            });
            chartOptions.value.xaxis.categories = check.details.map((log) => {
              return log.createdAt;
            });
          })
          .finally(() => {
            check.loadingDetails = false;
          });
      },
    };
  },
};
</script>
