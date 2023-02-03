<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">{{ $t("action.addStatusPage") }}</p>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>
            <p class="text-bold">{{ $t("common.basicInformation") }}</p>
          </div>
          <q-input
            class="name"
            name="name"
            type="text"
            outlined
            v-model="statusPage.name"
            :label="$t('common.name')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || $t('messages.errors.requireField'),
            ]"
            maxlength="50"
            :hint="`${statusPage.name.length}/50`"
          />
          <q-input
            type="textarea"
            outlined
            v-model="statusPage.description"
            :label="$t('common.description')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || $t('messages.errors.requireField'),
            ]"
          />
          <q-toggle
            v-model="statusPage.isPublic"
            :label="$t('common.public')"
          />
          <div class="q-mt-none q-ml-lg text-italic text-grey-8">
            {{ $t("messages.information.statusPagePublicDescription") }}
          </div>

          <div>
            <p class="text-bold">{{ $t("common.checksInformation") }}</p>
            <div>
              {{ $t("messages.information.statusPageCheckDescription") }}
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  name: "PageStatusPageAdd",

  setup() {
    const statusPage = ref({
      name: "",
      description: "",
      isPublic: false,
    });

    return {
      statusPage,
      onSubmit() {},
    };
  },
};
</script>
