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
                <span class="text-bold">{{ feature.quantity }}</span>
                {{ $t(`common.${feature.item}`) }}
              </div>
            </q-card-section>
            <q-card-section>
              <q-btn
                v-if="plan.price > 0"
                push
                color="primary"
                :label="$t('action.select')"
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
      <div
        class="text-center"
        id="paypal-button-container-P-7PA122898W931520MMI5IDEQ"
      ></div>
    </div>
  </q-page>
</template>
<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "PagePricing",
  setup() {
    const plans = ref([]);
    const $store = useStore();
    const showProPaypalButton = ref(false);
    const selectedPlan = ref({});
    const loading = ref(false);

    loading.value = true;
    $store
      .dispatch("payments/fetchPricing")
      .then((response) => {
        plans.value = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });

    const selectPlan = (plan) => {
      selectedPlan.value = plan;
      showProPaypalButton.value = true;
    };
    return {
      plans,
      selectPlan,
      showProPaypalButton,
      selectedPlan,
    };
  },
  mounted() {
    let paypalScript = document.createElement("script");
    paypalScript.setAttribute(
      "src",
      "https://www.paypal.com/sdk/js?client-id=AVOCNKuZewHvYrimSZpQjinKmOntIGwJXJ60vFUVPsRb-WqlpSZSNTS9k7vJHZoCgGoEmXwmWEJTgMs0&vault=true&intent=subscription"
    );
    paypalScript.setAttribute("data-sdk-integration-source", "button-factory");
    document.head.appendChild(paypalScript);

    setTimeout(() => {
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
              plan_id: "P-7PA122898W931520MMI5IDEQ",
            });
          },
          onApprove: function (data, actions) {
            // send the subcriptionID to the server
            alert(data.subscriptionID); // You can add optional success message for the subscriber here
          },
        })
        .render("#paypal-button-container-P-7PA122898W931520MMI5IDEQ");
    }, 1000);
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
