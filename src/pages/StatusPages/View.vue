<template>
  <q-page padding>
    <template v-if="showNoFound"> <component404 /> </template>
    <template v-else>
      <div class="header-container text-center">
        <p class="text-h4">{{ statusPage.name }}</p>
        <p class="text-grey-7">{{ statusPage.description }}</p>
        <dark-mode-toggle />
      </div>
      <div class="checks-container">
        <template v-if="loading">
          <q-card flat bordered class="q-mt-sm" v-for="i in 4" :key="i">
            <q-skeleton height="120px" square />
          </q-card>
        </template>
        <templat
          v-if="!loading && statusPage.checks && statusPage.checks.length === 0"
        >
          <div class="text-center">
            <q-icon
              color="grey-7"
              size="100px"
              name="eva-radio-button-off-outline"
            />
            <div class="text-h6 text-grey-7">
              {{ $t("common.noCheckFoundOnThisStatusPage") }}
            </div>
          </div>
        </templat>
        <q-card
          flat
          bordered
          class="q-mt-sm"
          v-for="(check, index) in statusPage.checks"
          :key="index"
        >
          <q-card-section>
            <div class="row">
              <div class="col-10">
                <div class="text-h6">{{ check.name }}</div>
                <div class="text-grey-7">{{ check.target }}</div>
              </div>
              <div class="col-2" v-if="check.lastLog">
                <q-chip
                  class="q-ml-none"
                  :color="
                    check.lastLog.status === 'up' ? 'positive' : 'negative'
                  "
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
                  :label="
                    check.showDetails
                      ? $t('action.refresh')
                      : $t('common.details')
                  "
                />
              </div>
              <template v-if="check.showDetails">
                <div class="col-12 text-center">
                  <div class="row">
                    <div class="col-4">
                      <div class="text-bold text-h4">
                        {{ getUpTimePercent(check.details) }}
                      </div>
                      <div class="text-grey-7">
                        {{ $t("common.totalUpTime") }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-bold text-h4">
                        {{ getTheAverageResponseTime(check.details) }}
                      </div>
                      <div class="text-grey-7">
                        {{ $t("common.avgResponseTime") }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-bold text-h4 ellipsis">
                        {{ check.timezone }}
                      </div>
                      <div class="text-grey-7">{{ $t("common.timezone") }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <apex-charts
                    type="area"
                    height="250"
                    :options="check.chartOptions"
                    :series="check.series"
                  />
                </div>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import ApexCharts from "vue3-apexcharts";
import { colors } from "quasar";
import {
  getMsOrSecondsFromMs,
  getTheAverageResponseTime,
  getUpTimePercent,
} from "src/utils/functions";
import component404 from "components/Interface/404";
import DarkModeToggle from "components/Interface/DarkModeToggle";

export default {
  name: "PageStatusPagesView",
  components: {
    ApexCharts,
    component404,
    DarkModeToggle,
  },
  setup() {
    const $store = useStore();
    const $route = useRoute();
    const $router = useRouter();
    const uuid = $route.params.uuid;
    const loading = ref(true);

    const token = $route.query.invitation_token;

    if (token) {
      localStorage.setItem(`statusPageToken-${uuid}`, token);
      $router.replace({
        name: "status-pages-view",
        params: {
          uuid,
        },
      });
    }

    const tokenFromLocalStorage = localStorage.getItem(
      `statusPageToken-${uuid}`
    );

    const statusPage = ref({
      name: "",
      description: "",
      checks: [],
    });
    const showNoFound = ref(false);

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
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    });

    $store
      .dispatch("statusPages/fetchViewByuuid", {
        uuid,
        queryString: tokenFromLocalStorage
          ? `?invitation_token=${tokenFromLocalStorage}`
          : "",
      })
      .then((response) => {
        statusPage.value = response.data.data;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status &&
          error.response.status === 400
        ) {
          showNoFound.value = true;
        }

        localStorage.removeItem(`statusPageToken-${uuid}`);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      statusPage,
      series,
      chartOptions,
      getMsOrSecondsFromMs,
      getTheAverageResponseTime,
      getUpTimePercent,
      showNoFound,
      loading,
      handleDetails: (check) => {
        check.loadingDetails = true;
        const queryString = `?logs=true&check_id=${check.id}${
          tokenFromLocalStorage
            ? `&invitation_token=${tokenFromLocalStorage}`
            : ""
        }`;
        $store
          .dispatch("statusPages/fetchViewByuuid", { uuid, queryString })
          .then((response) => {
            check.details = response.data.data;
            check.series = series.value;
            check.chartOptions = chartOptions.value;

            check.series[0].data = check.details.map((log) => {
              return log.duration;
            });
            check.chartOptions.xaxis.categories = check.details.map((log) => {
              return log.createdAt;
            });

            statusPage.value.checks.forEach((check) => {
              check.showDetails = false;
            });
            check.showDetails = true;
          })
          .finally(() => {
            check.loadingDetails = false;
          });
      },
    };
  },
};
</script>
