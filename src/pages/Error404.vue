<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t("messages.errors.nothingHere") }}
      </div>

      <q-btn
        push
        class="q-mt-xl"
        color="white"
        text-color="blue"
        to="/"
        :label="$t('action.goHome')"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
