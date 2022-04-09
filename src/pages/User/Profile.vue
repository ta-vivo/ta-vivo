<template>
  <q-page padding>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          @update:model-value="handleTabChange"
          vertical
          class="text-primary"
        >
          <q-tab
            name="basic-information"
            icon="eva-person-outline"
            :label="$t('common.basicInformation')"
          />
          <q-tab
            name="billing"
            icon="eva-file-text-outline"
            :label="$t('common.billing')"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="basic-information">
            <div class="text-h4 q-mb-md">{{ $t("common.basicInformation") }}</div>
            <div>
              <strong>{{ $t("common.fullname") }}:</strong>
              <span class="q-mr-sm">{{ user.fullname }}</span>
              <div>
                <strong>{{ $t("common.email") }}:</strong> {{ user.email }}
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div>
              <div class="text-h4 q-mb-md">{{ $t("common.subscription") }}</div>
              <role-badge
                class="cursor-pointer"
                @click="$router.push('/pricing')"
                :role="user.role"
              />

              <div
                class="plan-features q-my-md"
                v-show="planDetails.features.length > 0"
              >
                <div
                  v-for="feature in planDetails.features"
                  :key="feature.item"
                >
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
            </div>
          </q-tab-panel>

          <q-tab-panel name="billing">
            <div class="text-h4 q-mb-md">{{ $t("common.billing") }}</div>
            <q-table
              flat
              :loading="loadingBilling"
              :rows="billing"
              :columns="billingColumns"
              row-key="name"
            />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
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
import { date } from "quasar";

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
      splitterModel: 20,
      tab: "basic-information",
      billing: [],
      loadingBilling: false,
      billingColumns: [
        {
          name: "id",
          label: 'ID',
          align: "left",
          field: 'id'
        },
        {
          name: "date",
          label: this.$t("common.date"),
          align: "left",
          field: row => this.getDateFormat(row.time)
        },
        {
          name: 'client',
          label: this.$t("common.name"),
          align: "left",
          field: row => `${row.payer_name.given_name} ${row.payer_name.surname}`
        },
        {
          name: 'amount',
          label: this.$t("common.amount"),
          align: "left",
          field: row => `${row.amount_with_breakdown.gross_amount.value} ${row.amount_with_breakdown.gross_amount.currency_code}`
        },
        {
          name: 'status',
          label: this.$t("common.status"),
          align: "left",
          field: 'status'
        }
      ],
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
    handleTabChange(tab) {
      if (tab === "billing") {
        this.fetchSubscriptionTransactions();
      }
    },
    fetchSubscriptionTransactions() {
      this.loadingBilling = true;
      this.$store
        .dispatch("payments/paypalSubscriptionTransactions")
        .then((response) => {
          this.billing = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingBilling = false;
        });
    },
    getDateFormat(timeStamp) {
      return date.formatDate(timeStamp, "DD/MM/YYYY");
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
  },
};
</script>
