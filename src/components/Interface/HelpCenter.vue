<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        @click="handleShowHelpCenter"
        round
        color="primary"
        icon="eva-question-mark-circle-outline"
      />
    </q-page-sticky>

    <q-dialog v-model="showHelpCenter" position="right">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t("messages.helpCenter.welcome") }}</div>
          <q-space />
          <q-btn
            icon="eva-close-circle-outline"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              v-for="(item, index) in menuItems"
              :key="index"
              expand-separator
              clickable
              :label="item.label"
              :icon="item.icon"
            >
              <q-list>
                <q-item
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="subIndex"
                  clickable
                >
                  <q-item-section>
                    <q-item-label>- {{ subItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "ComponentHelpCenter",
  setup() {
    const $t = useI18n().t;

    const showHelpCenter = ref(false);
    const menuItems = ref([
      {
        label: $t("common.getting_started"),
        icon: 'eva-compass-outline',
        subItems: [
          { label: $t("common.overview_tool") },
          { label: $t("common.quick_setup") },
        ],
      },
      {
        label: $t("common.creating_checks"),
        icon: 'eva-activity-outline',
        subItems: [
          { label: $t("common.setting_targets") },
          { label: $t("common.configuring_intervals") },
          { label: $t("common.specifying_timezone") },
        ],
      },
      {
        label: $t("common.integrations"),
        icon: 'eva-briefcase-outline',
        subItems: [
          { label: $t("common.discord_integration") },
          { label: $t("common.email_notifications") },
          { label: $t("common.slack_integration") },
          { label: $t("common.telegram_alerts") },
          { label: $t("common.whatsapp_notifications") },
        ],
      },
      {
        label: $t("common.status_pages"),
        icon: 'eva-bar-chart-outline',
        subItems: [
          { label: $t("common.create_dashboard") },
          { label: $t("common.customize_layout") },
          { label: $t("common.share_information") },
        ],
      },
      {
        label: $t("common.log_history"),
        icon: 'eva-file-text-outline',
        subItems: [
          { label: $t("common.viewing_logs") },
          { label: $t("common.tracking_uptime") },
          { label: $t("common.analyzing_data") },
        ],
      },
      {
        label: $t("common.timezone_configuration"),
        icon: 'eva-clock-outline',
        subItems: [
          { label: $t("common.managing_timezones") },
          { label: $t("common.daylight_saving") },
        ],
      },
      {
        label: $t("common.faqs"),
        icon: 'eva-question-mark-circle-outline',
        subItems: [
          { label: $t("common.frequently_asked_questions") },
          { label: $t("common.troubleshooting_issues") },
        ],
      },
      {
        label: $t("common.contact_support"),
        icon: 'eva-headphones-outline',
        subItems: [
          { label: $t("common.reach_out") },
          { label: $t("common.feedback_requests") },
        ],
      },
    ]);

    return {
      menuItems,
      showHelpCenter,
      handleShowHelpCenter: () => {
        showHelpCenter.value = true;
      },
    };
  },
};
</script>
