<template>
  <q-card flat bordered style="max-width: 200px; min-height: 210px;">
    <q-card-section class="text-center">
      <q-avatar
        size="50px"
        :color="incident.id ? 'negative' : 'positive'"
        text-color="white"
        :icon="
          incident.id ? 'eva-alert-triangle-outline' : 'eva-checkmark-outline'
        "
      />
    </q-card-section>
    <q-card-section>
      <p v-if="!incident.id">
        {{ $t("common.noIncident") }}
      </p>
      <template v-if="incident.id">
        <p>
          <span class="text-bold">{{ incident.check.name }}</span>
          {{ $t("common.isNoReachable") }}
        </p>
        <p>
          {{ getDateFormat(incident.createdAt, "DD/MM/YYYY HH:mm:ss") }} ({{incident.timezone}})
        </p>
      </template>
      <q-inner-loading :showing="loading" label-style="font-size: 1.1em" />
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from "quasar";
export default {
  name: "ComponentDashboardIncidentCard",
  props: {
    incident: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
  methods: {
    getDateFormat(timeStamp) {
      return `${date.formatDate(timeStamp, "DD/MM/YYYY")} ${this.$t(
        "common.at"
      )} ${date.formatDate(timeStamp, "HH:mm:ss")}`;
    },
  },
};
</script>
