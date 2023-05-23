<template>
  <q-card flat>
    <q-card-section class="q-pb-none">
      <p>{{ $t("messages.helpCenter.troubleshootingDescription") }}</p>
      <q-separator />
    </q-card-section>

    <q-card-section>
      <q-scroll-area :visible="true" style="height: 500px; max-width: 100%">
        <p class="text-bold">{{ $t("messages.helpCenter.targetNotValid") }}</p>
        {{ $t("messages.helpCenter.targetNotValidDescription1") }}
        <ol>
          <li
            v-html="$t('messages.helpCenter.targetNotValidDescription2')"
          ></li>
          <li
            v-html="$t('messages.helpCenter.targetNotValidDescription3')"
          ></li>
          <li
            v-html="$t('messages.helpCenter.targetNotValidDescription4')"
          ></li>
          <li
            v-html="$t('messages.helpCenter.targetNotValidDescription5')"
          ></li>
        </ol>

        <p>{{ $t("messages.helpCenter.targetNotValidSoluctionTitle") }}</p>
        <ul>
          <li>{{ $t("messages.helpCenter.targetNotValidSolution1") }}</li>
          <li>{{ $t("messages.helpCenter.targetNotValidSolution2") }}</li>
          <li>{{ $t("messages.helpCenter.targetNotValidSolution3") }}</li>
          <li>{{ $t("messages.helpCenter.targetNotValidSolution4") }}</li>
        </ul>
      </q-scroll-area>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-separator class="q-mb-md" />
      <p>{{ $t("messages.helpCenter.cantFindSpecificIssue") }}</p>
      <div class="text-center" @click="$emit('click-on-contact-us')">
        <q-btn push color="primary" :label="$t('action.contactUs')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "ComponentTroubleshootingCommonIssues",
  setup() {
    return {};
  },
};
</script>
