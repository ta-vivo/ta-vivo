<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div>
      <p class="text-bold">{{ $t("common.basicInformation") }}</p>
    </div>
    <q-input
      type="text"
      outlined
      v-model="integration.name"
      :label="$t('common.name')"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || $t('messages.errors.requireField'),
      ]"
    />
    <q-input
      type="text"
      :hint="$t('messages.information.uniqueCodeGetFromTelegram')"
      outlined
      v-model="integration.uniqueCode"
      :label="$t('common.uniqueCode')"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || $t('messages.errors.requireField'),
      ]"
    />
    <div class="text-center">
      <q-btn
        push
        :loading="loading"
        :label="$t('action.save')"
        type="submit"
        color="primary"
      />
    </div>
  </q-form>
</template>

<script>
import { ref } from "vue";
export default {
  name: "ComponentTelegramForm",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const integration = ref({
      name: "",
      uniqueCode: "",
    });
    return {
      integration,
      onSubmit() {
        emit("saved", integration.value);
      },
    };
  },
};
</script>
