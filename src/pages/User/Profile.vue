<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <p class="text-h6">{{ $t("common.basicInformation") }}</p>
        <strong>{{ $t("common.fullname") }}:</strong> <span class="q-mr-sm">{{ user.fullname }}</span>
        <div>
          <strong>{{ $t("common.email") }}:</strong> {{ user.email }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="text-h6">{{ $t("common.subscription") }}</p>

        <role-badge
          class="cursor-pointer"
          @click="$router.push('/pricing')"
          :role="user.role"
        />

        <div
          class="plan-features q-my-md"
          v-show="planDetails.features.length > 0"
        >
          <div v-for="feature in planDetails.features" :key="feature.item">
            <pricing-feature :feature="feature" />
          </div>
        </div>

        <div class="q-mb-lg">
          <q-btn
            flat
            class="q-pl-none"
            color="primary"
            to="/pricing"
            :label="$t('common.viewAllPlans')"
          />
          <q-btn
            flat
            v-show="user.role !== 'basic'"
            @click="showCancelSubscription = true"
            color="negative"
            :label="$t('action.cancelSubscription')"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showCancelSubscription">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ $t("messages.questions.areYousureYouWantCancelSubscription") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t("messages.information.unsubscribeDescription") }}
          <div class="q-my-md">
            <div v-for="feature in basicPlan.features" :key="feature.item">
              <pricing-feature :feature="feature" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            outline
            :label="$t('action.keepSubscription')"
            color="primary"
            v-close-popup
          />
          <q-btn
            @click="unsubscribe()"
            push
            :loading="loading"
            :label="$t('action.cancelSubscription')"
            color="negative"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import jwtDecode from "jwt-decode";
import RoleBadge from "components/User/RoleBadge.vue";
import PricingFeature from "components/Pricing/Feature";

export default {
  name: "PageProfile",
  components: {
    RoleBadge,
    PricingFeature,
  },
  data() {
    return {
      loading: false,
      planDetails: { features: [] },
      basicPlan: { features: [] },
      showCancelSubscription: false,
    };
  },
  async created() {
    await this.fetchMe();
    await this.fetchPlans();
  },
  methods: {
    async fetchMe() {
      return this.$store.dispatch("auth/me").then((response) => {
        const token = response.data.data.token;
        const decoded = jwtDecode(token);

        this.$store.commit("auth/SET_USER", decoded);

        window.localStorage.setItem("token", token);
        return;
      });
    },
    async fetchPlans() {
      return this.$store
        .dispatch("payments/fetchPricing")
        .then((response) => {
          const plans = response.data.data;

          const found = plans.find(
            (plan) => plan.name.toLowerCase() === this.user.role
          );

          if (found) {
            this.planDetails = found;
          }

          const basic = plans.find(
            (plan) => plan.name.toLowerCase() === "basic"
          );

          if (basic) {
            this.basicPlan = basic;
          }
          return;
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    },
    async unsubscribe() {
      this.loading = true;
      this.$store
        .dispatch("payments/paypalSubscriptionCancel")
        .then(() => {
          this.showCancelSubscription = false;
          this.$q.notify({
            message: this.$t(
              "messages.information.subscriptionCancelDescription"
            ),
            color: "positive",
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
  },
};
</script>
