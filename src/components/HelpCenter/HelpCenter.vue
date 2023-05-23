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
      <q-card flat style="min-width: 400px; min-height: 500px">
        <q-card-section
          v-show="
            showTemplate === 'video' ||
            showTemplate === 'contact-form' ||
            showTemplate === 'frequent-questions' ||
            showTemplate === 'reading' ||
            showTemplate === 'troubleshooting'
          "
          class="row items-center bg-primary text-white"
        >
          <q-btn
            class="q-mr-md"
            @click="() => handleShow('options')"
            icon="eva-chevron-left-outline"
            flat
            :label="$t('action.back')"
          />
          <div class="text-h6">
            {{ selectedOption.label }}
          </div>
        </q-card-section>
        <q-card-section v-show="showTemplate === 'video'">
          <video
            style="max-width: 530px; height: auto; border-radius: 4px"
            controls
            preload="auto"
            :src="selectedOption.video"
          ></video>
        </q-card-section>

        <q-card-section
          v-show="showTemplate === 'options'"
          class="row items-center bg-primary text-white"
        >
          <div class="text-h6">{{ $t("messages.helpCenter.welcome") }}</div>
          <q-space />
          <q-btn
            icon="eva-close-circle-outline"
            flat
            round
            dense
            v-close-popup
          />

          <div>
            {{ $t("messages.helpCenter.description") }}
          </div>
        </q-card-section>

        <q-card-section v-show="showTemplate === 'options'">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              v-for="(item, index) in menuItems"
              :key="index"
              expand-separator
              clickable
              :label="item.label"
              :icon="item.icon"
              group="somegroup"
            >
              <q-list class="q-ml-md">
                <q-item
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="subIndex"
                  clickable
                  @click="() => handleClickOnOption(subItem)"
                >
                  <q-item-section>
                    <q-item-label>
                      <q-icon size="sm" :name="subItem.icon" />
                      {{ subItem.label }}
                      <q-inner-loading
                        :showing="subItem.loading"
                        label-class="text-teal"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-card-section>

        <q-card-section v-show="showTemplate === 'contact-form'">
          <ContactForm />
        </q-card-section>

        <q-card-section v-show="showTemplate === 'frequent-questions'">
          <frequent-questions :show-header="false" />
        </q-card-section>

        <q-card-section v-show="showTemplate === 'reading'">
          <div class="text-body2">
            <p
              v-for="(description, index) in selectedOption.description"
              :key="index"
            >
              {{ description }}
            </p>
          </div>
        </q-card-section>

        <q-card-section v-show="showTemplate === 'troubleshooting'">
          <troubleshooting-common-issues
            @click-on-contact-us="showTemplate = 'contact-form'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ContactForm from "components/HelpCenter/ContactForm.vue";
import FrequentQuestions from "components/HelpCenter/FrequentQuestions.vue";
import TroubleshootingCommonIssues from "./TroubleshootingCommonIssues.vue";

export default {
  name: "ComponentHelpCenter",
  components: {
    ContactForm,
    FrequentQuestions,
    TroubleshootingCommonIssues,
  },
  setup() {
    const $t = useI18n().t;
    const router = useRouter();

    const showTemplate = ref("options"); // options | video | contact-form | reading | frequent-questions | quick-guide | troubleshooting
    const showHelpCenter = ref(false);
    const selectedOption = ref({});
    const menuItems = ref([
      {
        label: $t("common.getting_started"),
        icon: "eva-compass-outline",
        subItems: [
          {
            label: $t("common.overview_tool"),
            icon: "eva-book-open-outline",
            action: "reading",
            description: [
              $t("messages.helpCenter.overviewDescription1"),
              $t("messages.helpCenter.overviewDescription2"),
              $t("messages.helpCenter.overviewDescription3"),
              $t("messages.helpCenter.overviewDescription4"),
              $t("messages.helpCenter.overviewDescription5"),
              $t("messages.helpCenter.overviewDescription6"),
            ],
          },
          {
            label: $t("common.quick_setup"),
            icon: "eva-book-open-outline",
            action: "quick-guide",
          },
        ],
      },
      {
        label: $t("common.creating_checks"),
        icon: "eva-activity-outline",
        subItems: [
          {
            label: $t("common.setting_targets"),
            icon: "eva-video-outline",
            video: "https://tavivo.s3.amazonaws.com/create+checks.mp4",
          },
          {
            label: $t("common.configuring_intervals"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Configuring+check+intervals.mp4",
          },
          {
            label: $t("common.specifying_timezone"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Specifying+timezone+for+each+check.mp4",
          },
        ],
      },
      {
        label: $t("common.integrations"),
        icon: "eva-briefcase-outline",
        subItems: [
          {
            label: $t("common.discord_integration"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Adding+Discord+integration.mp4",
          },
          {
            label: $t("common.email_notifications"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Setting+up+Email+notifications.mp4",
          },
          {
            label: $t("common.slack_integration"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Configuring+Slack+integration.mp4",
          },
          {
            label: $t("common.telegram_alerts"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Enabling+Telegram+alerts.mp4",
          },
          {
            label: $t("common.whatsapp_notifications"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Managing+WhatsApp+notifications.mp4",
          },
          {
            label: $t("common.adding_integrations_to_checks"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Adding+integrations+to+checks.mp4",
          },
        ],
      },
      {
        label: $t("common.status_pages"),
        icon: "eva-bar-chart-outline",
        subItems: [
          {
            label: $t("common.create_dashboard"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Creating+a+dynamic+dashboard.mp4",
          },
          {
            label: $t("common.share_information"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Sharing+information+with+teams1.mp4",
          },
        ],
      },
      {
        label: $t("common.log_history"),
        icon: "eva-file-text-outline",
        subItems: [
          {
            label: $t("common.tracking_uptime"),
            icon: "eva-video-outline",
            video: "https://tavivo.s3.amazonaws.com/Viewing+check+logs.mp4",
          },
        ],
      },
      {
        label: $t("common.timezone_configuration"),
        icon: "eva-clock-outline",
        subItems: [
          {
            label: $t("common.managing_general_timezones"),
            icon: "eva-video-outline",
            video:
              "https://tavivo.s3.amazonaws.com/Managing+general+timezones.mp4",
          },
        ],
      },
      {
        label: $t("common.faqs"),
        icon: "eva-question-mark-circle-outline",
        subItems: [
          {
            label: $t("common.frequently_asked_questions"),
            icon: "eva-book-open-outline",
            action: "frequent-questions",
          },
          {
            label: $t("common.troubleshooting_issues"),
            icon: "eva-book-open-outline",
            action: "troubleshooting",
          },
        ],
      },
      {
        label: $t("common.contact_support"),
        icon: "eva-headphones-outline",
        subItems: [
          {
            label: $t("common.feedback_requests"),
            icon: "eva-edit-outline",
            action: "contact-form",
          },
        ],
      },
    ]);

    const handleShow = (option) => {
      showTemplate.value = option;
    };

    return {
      menuItems,
      showHelpCenter,
      selectedOption,
      showTemplate,
      handleShow,
      handleShowHelpCenter: () => {
        showHelpCenter.value = true;
      },
      handleClickOnOption: (option) => {
        selectedOption.value = option;

        if (option.video) {
          handleShow("video");
        } else if (option.action === "quick-guide") {
          // show the onboarding
          window.localStorage.removeItem("new-users-onboarding");
          window.localStorage.setItem(
            "show-new-users-onboarding-to-old-user",
            "show"
          );

          option.loading = true;
          router.push({ name: "home" });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (option.action) {
          handleShow(option.action);
        }
      },
    };
  },
};
</script>
