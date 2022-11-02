<template>
  <q-page padding>
    <div class="row q-col-gutter-sm text-center" v-if="!$q.screen.xs">
      <div class="col-sm-4">
        <DashboardCard
          icon="eva-activity-outline"
          color="primary"
          :title="$t('common.checks')"
          :value="dashboard.checks"
          :loading="loading"
        />
      </div>
      <div class="col-sm-4">
        <DashboardCard
          class="q-mx-auto"
          icon="eva-briefcase-outline"
          color="positive"
          :title="$t('common.integrations')"
          :value="dashboard.integrations"
          :loading="loading"
        />
      </div>
      <div class="col-sm-4">
        <DashboardIncidentCard
          class="q-ml-auto"
          :incident="dashboard.mostRecentIncident"
          :loading="loading"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xs text-center" v-if="$q.screen.xs">
      <div class="col-xs-4">
        <DashboardCard
          icon="eva-activity-outline"
          color="primary"
          class="q-mx-auto"
          :title="$t('common.checks')"
          :value="dashboard.checks"
          :loading="loading"
        />
      </div>
      <div class="col-xs-4">
        <DashboardCard
          class="q-mx-auto"
          icon="eva-briefcase-outline"
          color="positive"
          :title="$t('common.integrations')"
          :value="dashboard.integrations"
          :loading="loading"
        />
      </div>
      <div class="col-xs-4">
        <DashboardIncidentCard
          class="q-mx-auto"
          :incident="dashboard.mostRecentIncident"
          :loading="loading"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-lg">
      <div class="col-12">
        <q-table
          :grid="$q.screen.xs"
          :loading="loading"
          flat
          bordered
          row-per-page="10"
          :rows-per-page-options="[10]"
          :rows="dashboard.recentActivity"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:top>
            <span class="text-h6">{{ $t("common.mostRecentsLogs") }}</span>
            <q-space />
            <span class="q-mr-sm">{{
              getDurationOfLastRefreshInSeconds(lastRefresh)
            }}</span>
            <q-btn
              @click="onRefresh()"
              :loading="isRefresh"
              round
              flat
              size="sm"
              color="white"
              text-color="primary"
              icon="eva-refresh-outline"
            />
          </template>
          <!-- Grid -->
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat>
                <q-card-section>
                  <div class="q-mb-sm">
                    <q-chip
                      class="q-ml-none"
                      :color="
                        props.row.status === 'up' ? 'positive' : 'negative'
                      "
                      text-color="white"
                    >
                      {{ props.row.status }}
                    </q-chip>
                  </div>
                  <div class="text-grey-7">
                    {{ $t("common.check") }}
                  </div>
                  <div class="q-mb-sm">{{ props.row.check.name }}</div>
                  <div class="text-grey-7">
                    {{ $t("common.date") }}
                  </div>
                  <div>
                    {{ formatDate(props.row.createdAt, props.row.timezone) }}
                    <span class="ellipsis">({{ props.row.timezone }})</span>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
          <!-- Table -->
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
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import DashboardCard from "components/Widgets/DashboardCard";
import DashboardIncidentCard from "components/Widgets/DashboardIncidentCard";
import { getTimestampInHumanFormat, getDuration } from "src/utils/time";

export default defineComponent({
  name: "PageIndex",
  components: {
    DashboardCard,
    DashboardIncidentCard,
  },
  created() {
    this.loading = true;
    this.fetchDashboard()
      .then((response) => {
        this.dashboard = { ...response.data.data };
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  mounted() {
    document.addEventListener("visibilitychange",  () => {
      if (document.hidden) {
        this.isWindowFocused = false;
      } else {
        this.isWindowFocused = true;
      }
    });
  },
  data() {
    return {
      loading: false,
      isRefresh: false,
      lastRefresh: 0,
      isWindowFocused: true,
      dashboard: {
        checks: 0,
        recentActivity: [],
        mostRecentIncident: {},
      },
      columns: [
        {
          name: "status",
          label: this.$t("common.status"),
          align: "left",
          field: "status",
        },
        {
          name: "check",
          label: this.$t("common.check"),
          align: "left",
          field: (row) => row.check.name,
        },
        {
          name: "createdAt",
          label: this.$t("common.date"),
          align: "left",
          field: (row) =>
            this.formatDate(row.createdAt, row.timezone) + ` (${row.timezone})`,
        },
      ],
    };
  },
  methods: {
    async fetchDashboard() {
      return this.$store.dispatch("dashboard/fetchStats");
    },
    onRefresh() {
      this.isRefresh = true;
      this.fetchDashboard()
        .then((response) => {
          this.dashboard = { ...response.data.data };
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isRefresh = false;
        });
    },
    formatDate(timestamp, timezone) {
      return getTimestampInHumanFormat(timestamp, timezone);
    },
    getDurationOfLastRefreshInSeconds() {
      return getDuration(this.lastRefresh);
    },
  },
  watch: {
    lastRefresh: {
      handler() {
        if (this.lastRefresh > 5 * 60 && this.isWindowFocused) {
          this.lastRefresh = 0;
          this.onRefresh();
        }
        setTimeout(() => {
          this.lastRefresh++;
        }, 1000);
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
});
</script>
