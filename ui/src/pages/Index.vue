<template>
  <q-page padding>
    <div class="row q-col-gutter-sm text-center">
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
    <div class="row q-col-gutter-sm q-mt-lg">
      <div class="col-12">
        <q-table
          :loading="loading"
          flat
          bordered
          row-per-page="10"
          :rows-per-page-options="[]"
          :title="$t('common.mostRecentsLogs')"
          :rows="dashboard.recentActivity"
          :columns="columns"
          row-key="id"
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
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import DashboardCard from "components/Widgets/DashboardCard";
import DashboardIncidentCard from "components/Widgets/DashboardIncidentCard";
import { date } from "quasar";

export default defineComponent({
  name: "PageIndex",
  components: {
    DashboardCard,
    DashboardIncidentCard,
  },
  created() {
    const $store = useStore();
    this.loading = true;
    $store
      .dispatch("dashboard/fetchStats")
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
  data() {
    return {
      loading: false,
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
            `${date.formatDate(row.createdAt, "DD/MM/YYYY")} ${this.$t(
              "common.at"
            )} ${date.formatDate(row.createdAt, "HH:mm:ss")}`,
        },
      ],
    };
  },
});
</script>
