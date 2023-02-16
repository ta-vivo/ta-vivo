<template>
  <div class="text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t("messages.errors.nothingHere") }}
      </div>

      <q-btn
        push
        class="q-mt-xl"
        color="primary"
        to="/"
        :label="$t('action.goHome')"
      />
    </div>
  </div>
</template>
