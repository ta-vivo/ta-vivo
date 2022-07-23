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
            :label="$q.screen.gt.xs ? $t('common.basicInformation') : null"
          />
          <q-tab
            name="billing"
            icon="eva-file-text-outline"
            :label="$q.screen.gt.xs ? $t('common.billing') : null"
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
            <div class="text-h4 q-mb-md">
              {{ $t("common.basicInformation") }}
            </div>
            <div>
              <strong>{{ $t("common.fullname") }}:</strong>
              <span class="q-mr-sm">{{ user.fullname }}</span>
              <div>
                <strong>{{ $t("common.email") }}:</strong> {{ user.email }}
              </div>
              <div>
                <q-btn
                  class="q-pl-none"
                  color="primary"
                  flat
                  :label="$t('common.changePassword')"
                  @click="showChangePassword = true"
                />
                <q-dialog v-model="showChangePassword">
                  <q-card style="width: 500px">
                    <q-card-section class="row items-center q-pb-none">
                      <div class="text-h6">{{$t('common.changePassword')}}</div>
                      <q-space />
                      <q-btn icon="eva-close-outline" flat round dense v-close-popup />
                    </q-card-section>

                    <q-card-section>
                      <change-password @success="showChangePassword = false" />
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div>
              <div class="text-h4 q-mb-md">
                {{ $t("common.timezone") }}
              </div>
              <p>{{$t('messages.information.timezoneDescription')}}</p>
              <q-select
                outlined
                v-model="timezone"
                :options="timezones"
                :label="$t('common.timezone')"
                option-value="code"
                option-label="code"
                emit-value
                map-options
                use-input
                @filter="filterTimezone"
              />
                <q-btn
                  :loading="loading"
                  class="q-pl-none q-mt-md"
                  color="primary"
                  flat
                  :label="$t('action.saveTimezone')"
                  @click="saveTimezone"
                />
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
                  :class="$q.screen.gt.xs ? null : 'q-pl-none'"
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
import ChangePassword from 'components/User/ChangePassword';
import timezonesJson from "assets/timezones.json";

export default {
  name: "PageProfile",
  components: {
    RoleBadge,
    PricingFeature,
    ChangePassword
  },
  data() {
    return {
      loading: false,
      showChangePassword: false,
      timezones: [],
      timezone: this.$store.getters["auth/getUser"].timezone,
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
          label: "ID",
          align: "left",
          field: "id",
        },
        {
          name: "date",
          label: this.$t("common.date"),
          align: "left",
          field: (row) => this.getDateFormat(row.time),
        },
        {
          name: "client",
          label: this.$t("common.name"),
          align: "left",
          field: (row) =>
            `${row.payer_name.given_name} ${row.payer_name.surname}`,
        },
        {
          name: "amount",
          label: this.$t("common.amount"),
          align: "left",
          field: (row) =>
            `${row.amount_with_breakdown.gross_amount.value} ${row.amount_with_breakdown.gross_amount.currency_code}`,
        },
        {
          name: "status",
          label: this.$t("common.status"),
          align: "left",
          field: "status",
        },
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
    },
    filterTimezone(val, update) {
      if (val === "") {
        update(() => {
          this.timezones = timezonesJson;
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.timezones = timezonesJson.filter(
          (v) => v.code.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    saveTimezone () {
      this.loading = true;
      this.$store
        .dispatch("user/update", {timezone: this.timezone})
        .then(async () => {
          this.$q.notify({
            message: this.$t("action.timezoneSaved"),
            color: "positive",
          });
          await this.fetchMe();
        })
        .catch((error) => {
          console.log(error);
          this.$q.notify({
            message: this.$t("messages.error.errorOnSave"),
            color: "negative",
          });
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
