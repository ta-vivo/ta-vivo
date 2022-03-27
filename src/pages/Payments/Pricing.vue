<template>
  <q-page padding>
    <div v-show="!showProPaypalButton">
      <div class="row">
        <div class="col-12 text-center">
          <p class="text-h3">{{ $t("common.plans") }}</p>
        </div>
      </div>
      <div class="row justify-between q-col-gutter-md">
        <div class="col-md-3" v-for="plan in plans" :key="plan.id">
          <q-card flat bordered class="text-center plan-card">
            <q-card-section>
              <span class="text-h6">{{ plan.name }}</span>
              <div>
                <span class="q-ml-sm" style="font-size: 20px">
                  ${{ plan.price }}
                </span>
                <span>/ ${{ $t("common.month") }}</span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div v-for="feature in plan.features" :key="feature.item">
                <pricing-feature :feature="feature" />
              </div>
            </q-card-section>
            <q-card-section>
              <q-btn
                :disable="
                  $store.getters['auth/getUser'].role ===
                  plan.name.toLowerCase()
                "
                v-if="plan.price > 0"
                push
                color="primary"
                :label="
                  $store.getters['auth/getUser'].role ===
                  plan.name.toLowerCase()
                    ? $t('common.subscribed')
                    : $t('action.select')
                "
                @click="selectPlan(plan)"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card flat bordered class="q-mt-lg">
        <q-card-section>
          <div class="text-h6">{{ $t("common.frequentQuestions") }}</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="questions-container">
          <div class="question-container">
            <div class="text-bold">
              {{ $t("frequentQuestions.whatPaymentAccept") }}
            </div>
            <div>{{ $t("frequentQuestions.whatPaymentAcceptAnswer") }}</div>
          </div>
          <div class="question-container">
            <div class="text-bold">
              {{ $t("frequentQuestions.whatsTheDifferenceBetWeenPlans") }}
            </div>
            <div>
              {{ $t("frequentQuestions.whatsTheDifferenceBetWeenPlansAnswer") }}
            </div>
          </div>
          <div class="question-container">
            <div class="text-bold">
              {{ $t("frequentQuestions.canICancelMyPaymentPlan") }}
            </div>
            <div>
              {{ $t("frequentQuestions.canICancelMyPaymentPlanAnswer") }}
            </div>
          </div>
          <div class="question-container">
            <div class="text-bold">
              {{ $t("frequentQuestions.whatIsTheLogsHistoryNumber") }}
            </div>
            <div>
              {{ $t("frequentQuestions.whatIsTheLogsHistoryNumberAnswer") }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-show="showProPaypalButton">
      <q-btn
        color="primary"
        flat
        :label="$t('action.backToPlans')"
        @click="showProPaypalButton = false"
        class="q-mb-md"
        icon="eva-arrow-back-outline"
      />
      <div class="text-center q-my-md">
        <span class="text-h6">{{ selectedPlan.name }}</span>
        <span class="q-ml-sm" style="font-size: 20px">
          ${{ selectedPlan.price }}
        </span>
        <span>/ ${{ $t("common.month") }}</span>
      </div>
      <div class="text-center" id="paypal-button-container"></div>
    </div>
    <q-dialog maximized v-model="success">
      <q-card class="text-center">
        <q-card-section>
          <q-icon
            size="100px"
            color="positive"
            name="eva-checkmark-circle-outline"
          />
          <p class="text-h5">
            {{ $t("messages.information.thanksForYourSubscription") }}
          </p>
        </q-card-section>

        <q-card-section class="q-py-none">
          {{ $t("messages.information.subscriptionSuccessDescription") }}
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            push
            :label="$t('action.goToHome')"
            color="primary"
            @click="$router.push('/')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import jwtDecode from "jwt-decode";
import PricingFeature from 'components/Pricing/Feature'

export default {
  name: "PagePricing",
  components: {
    PricingFeature
  },
  data() {
    return {
      success: false,
      plans: [],
      showProPaypalButton: false,
      selectedPlan: {}
    };
  },
  mounted() {
    let paypalScript = document.createElement("script");
    paypalScript.setAttribute(
      "src",
      `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&vault=true&intent=subscription`
    );
    paypalScript.setAttribute("data-sdk-integration-source", "button-factory");
    document.head.appendChild(paypalScript);
    this.fetchSubscriptionPlans();
  },
  methods: {
    fetchSubscriptionPlans () {
    this.$store
      .dispatch("payments/fetchPricing")
      .then((response) => {
        this.plans = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      })
    },
    selectPlan (plan) {
      this.selectedPlan = plan;
      document.querySelector("#paypal-button-container").innerHTML = "";
      this.createdPaypalButton(plan.id);
      this.showProPaypalButton = true;
    },
    createdPaypalButton(subcriptionId) {
      paypal
        .Buttons({
          style: {
            shape: "rect",
            color: "blue",
            layout: "vertical",
            label: "paypal",
          },
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              /* Creates the subscription */
              plan_id: subcriptionId,
            });
          },
          onApprove: async (data) => {
            this.$q.loading.show({});
            // Fetch "me" to set new role
            this.$store
              .dispatch("payments/saveSubscription", {
                subscriptionId: data.subscriptionID,
              })
              .then(() => {
                this.success = true;
              })
              .catch((e) => {
                console.log(e);
              })
              .finally(() => {
                this.$q.loading.hide();
              });

            this.$store.dispatch("auth/me").then((response) => {
              const token = response.data.data.token;
              const decoded = jwtDecode(token);

              this.$store.commit("auth/SET_USER", {
                email: decoded.email,
                id: decoded.userId,
                role: decoded.role,
              });

              window.localStorage.setItem("token", token);
            });
          },
        })
        .render(`#paypal-button-container`);
    },
  },
};
</script>
<style>
.plan-card {
  height: 100%;
  width: 200px;
}
.questions-container .question-container {
  margin: 20px auto;
}
</style>
