<template>
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
      <div class="question-container">
        <div class="text-bold">
          {{ $t("frequentQuestions.whatIsRetryOnCheckFail") }}
        </div>
        <div>
          {{ $t("frequentQuestions.whatIsRetryOnCheckFailAnswer") }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "ComponentFrequentQuestions",
  setup() {
    return {};
  },
};
</script>
