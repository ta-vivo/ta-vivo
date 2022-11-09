<template>
  <div class="onboarding"></div>
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
    };
  },
  methods: {
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
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
            action: this.tour.cancel,
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
    showCreateCheck() {
      this.tour.addStep({
        attachTo: { element: ".q-btn.create-check", on: "bottom" },
        text: "check description",
      });

      this.tour.next();
    },
  },
  watch: {
    $route(to) {
      if (to.fullPath === "/checks") {
        this.dispatchShowCreateCheck();
      }
      console.log(to);
    },
  },
};
</script>
