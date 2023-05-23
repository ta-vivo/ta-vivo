<template>
  <div class="onboarding"></div>
  <q-dialog persistent v-model="showInitialDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t("messages.onboarding.welcome") }} 🎉</div>
      </q-card-section>
      <q-card-section>
        {{ $t("messages.onboarding.welcomeDescription") }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          push
          @click="start"
          :label="$t('action.start')"
          color="primary"
        />
        <q-btn
          outline
          @click="skip"
          :label="$t('action.skip')"
          color="negative"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog persistent v-model="showTheFinalDialog">
    <q-card>
      <q-linear-progress :value="100" rounded color="positive" />
      <q-card-section>
        <div class="text-h6 text-center">
          {{ $t("messages.onboarding.newUserOnboardingTitleFinish") }}
        </div>
      </q-card-section>
      <q-card-section>
        {{ $t("messages.onboarding.newUserOnboardingDescriptionFinish") }}
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="finish"
          push
          :label="$t('action.closeTheTour')"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import "src/css/shepherd.css";

export default {
  name: "ComponentOnboardingNewUsers",
  emits: ["hide"],
  created() {
    this.createTour();
  },
  data() {
    return {
      tour: null,
      showInitialDialog: true,
      btnClasses:
        "q-btn q-btn-item non-selectable no-outline q-btn--push q-btn--rectangle bg-primary text-white q-btn--actionable q-focusable q-hoverable q-btn--active",
      btnOutlinedClasses:
        "q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--rectangle text-primary q-btn--actionable q-focusable q-hoverable",
      showTheFinalDialog: false,
    };
  },
  methods: {
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: {
            enabled: true,
          },
          scrollTo: { behavior: "smooth", block: "center" },
        },
      });

      this.tour.on("cancel", () => {
        window.localStorage.setItem("new-users-onboarding", "closed");
        window.localStorage.removeItem("show-new-users-onboarding-to-old-user");
        this.handleEmitHide();
      });

      this.tour.addStep({
        attachTo: { element: ".q-btn.checks", on: "bottom" },
        title: this.$t("common.checks"),
        text: this.$t("messages.onboarding.checksDescription"),
        buttons: [
          {
            text: this.$t('action.next'),
            classes: this.btnClasses,
            action: () => {
              this.$router.push({ name: "checks" });
            },
          },
        ],
      });
    },
    start() {
      this.tour.start();
      this.showInitialDialog = false;
    },
    skip() {
      this.showInitialDialog = false;
      window.localStorage.setItem("new-users-onboarding", "skiped");
      window.localStorage.removeItem("show-new-users-onboarding-to-old-user");
      this.$emit("hide");
    },
    dispatchShowCreateCheck() {
      let element = document.querySelector(".q-btn.create-check");
      const timeout = setInterval(() => {
        if (element) {
          this.showCreateCheck();
          clearInterval(timeout);
        } else {
          element = document.querySelector(".q-btn.create-check");
        }
      }, 250);
    },
    dispatchShowFormInformation() {
      let element = document.querySelector("label.name");
      const timeout = setInterval(() => {
        if (element) {
          this.showFormInformation();
          clearInterval(timeout);
        } else {
          element = document.querySelector("label.name");
        }
      }, 250);
    },
    showCreateCheck() {
      this.tour.addStep({
        attachTo: { element: ".q-btn.create-check", on: "bottom" },
        title: this.$t("messages.onboarding.checksCreationTitle"),
        text: this.$t("messages.onboarding.checksCreationDescription"),
      });

      this.tour.next();
    },
    showFormInformation() {
      this.tour.addStep({
        attachTo: { element: "label.name", on: "bottom" },
        title: this.$t("messages.onboarding.checksNameTitle"),
        text: this.$t("messages.onboarding.checksNameDescription"),
        highlightClass: "highlight",
        buttons: [
          {
            text: this.$t('action.next'),
            classes: this.btnClasses,
            action: this.tour.next,
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: "label.target", on: "bottom" },
        title: this.$t("messages.onboarding.checksTargetTitle"),
        text: this.$t("messages.onboarding.checksTargetDescription"),
        highlightClass: "highlight",
        buttons: [
          {
            text: "Prev",
            classes: this.btnClasses,
            action: this.tour.back,
          },
          {
            text: this.$t('action.next'),
            classes: this.btnClasses,
            action: this.tour.next,
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: "div.period-container", on: "bottom" },
        title: this.$t("messages.onboarding.checksPeriodTitle"),
        text: this.$t("messages.onboarding.checksPeriodDescription"),
        highlightClass: "highlight",
        buttons: [
          {
            text: "Prev",
            classes: this.btnClasses,
            action: this.tour.back,
          },
          {
            text: this.$t('action.next'),
            classes: this.btnClasses,
            action: this.tour.next,
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: ".q-btn.submit", on: "top" },
        title: this.$t("messages.onboarding.checksSaveTitle"),
        text: this.$t("messages.onboarding.checksSaveDescription")
      });

      this.tour.next();
    },
    showTheLastStep() {
      this.tour.next();
      this.showTheFinalDialog = true;
      window.localStorage.setItem("new-users-onboarding", "done");
      window.localStorage.removeItem("show-new-users-onboarding-to-old-user");
    },
    finish() {
      this.showTheFinalDialog = false;
      this.handleEmitHide();
    },
    handleEmitHide() {
      this.$emit("hide");
    },
  },
  watch: {
    $route(to) {
      if (to.name === "checks") {
        if (to.query.created === "true") {
          this.showTheLastStep();
        } else {
          this.dispatchShowCreateCheck();
        }
      }

      if (to.fullPath === "/checks/add") {
        this.dispatchShowFormInformation();
      }
    },
  },
};
</script>
