<template>
  <div class="onboarding"></div>
  <q-dialog v-model="showTheFinalDialog">
    <q-card>

    <q-linear-progress
      :value="100"
      rounded
      color="positive"
    />
      <q-card-section>
        <div class="text-h6 text-center">🎉 Success</div>
      </q-card-section>
      <q-card-section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. porro. Rerum
        blanditiis perferendis totam, ea at omnis vel numquam exercitationem
        aut, natus minima, porro labore.
      </q-card-section>
      <q-card-actions align="center">
        <q-btn push label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ComponentOnboardingNewUsers",
  created() {
    this.createTour();
  },
  mounted() {
    this.tour.start();
  },
  data() {
    return {
      tour: null,
      btnClasses:
        "q-btn q-btn-item non-selectable no-outline q-btn--push q-btn--rectangle bg-primary text-white q-btn--actionable q-focusable q-hoverable q-btn--active",
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
      });

      this.tour.addStep({
        attachTo: { element: ".onboarding", on: "top" },
        text: "Welcome 🎉",
        buttons: [
          {
            text: "Next",
            classes: this.btnClasses,
            action: this.tour.next,
          },
          {
            text: "Skip",
            classes:
              "q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--rectangle text-primary q-btn--actionable q-focusable q-hoverable",
            action: () => {
              this.tour.cancel();
              window.localStorage.setItem("new-users-onboarding", "skiped");
            },
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: ".q-btn.checks", on: "bottom" },
        text: "Go to Create check",
      });
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
        text: "check description",
      });

      this.tour.next();
    },
    showFormInformation() {
      this.tour.addStep({
        attachTo: { element: "label.name", on: "bottom" },
        text: "check name info",
        buttons: [
          {
            text: "Next",
            classes: this.btnClasses,
            action: this.tour.next,
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: "label.target", on: "bottom" },
        text: "check target info",
        buttons: [
          {
            text: "Prev",
            classes: this.btnClasses,
            action: this.tour.back,
          },
          {
            text: "Next",
            classes: this.btnClasses,
            action: this.tour.next,
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: "div.period-container", on: "bottom" },
        text: "check period info",
        buttons: [
          {
            text: "Prev",
            classes: this.btnClasses,
            action: this.tour.back,
          },
          {
            text: "Next",
            classes: this.btnClasses,
            action: () => {
              this.tour.next();
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            },
          },
        ],
      });

      this.tour.addStep({
        attachTo: { element: ".q-btn.submit", on: "bottom" },
        text: "check save info",
      });

      this.tour.next();
    },
    showTheLastStep() {
      this.tour.next();
      this.showTheFinalDialog = true;
      window.localStorage.setItem("new-users-onboarding", "done");
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
