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
          <div class="check-selection-container">
            <q-card
              flat
              bordered
              class="my-card bg-grey-1 q-my-sm"
              style="max-width: 400px"
              v-for="check in checks"
              :key="check.id"
            >
              <q-card-section>
                <div class="row">
                  <div class="col-10 ellipsis">
                    {{ check.name }}

                    <div class="text-grey-7 ellipsis">
                      {{ check.target }}
                    </div>
                  </div>
                  <div class="col-2">
                    <q-toggle
                      class="float-right"
                      v-model="check.addToStatusPage"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card-actions vertical class="justify-around q-px-md">
              </q-card-actions>
            </q-card>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "PageStatusPageAdd",

  setup() {
    const store = useStore();

    const checks = ref([]);
    const loadingChecks = ref(true);
    const statusPage = ref({
      name: "",
      description: "",
      isPublic: false,
    });

    store
      .dispatch("checks/fetchAll", "?limit=9999")
      .then((response) => {
        checks.value = response.data.data.map((check) => {
          return {
            ...check,
            addToStatusPage: false,
          };
        });
      })
      .finally(() => {
        loadingChecks.value = false;
      });

    return {
      statusPage,
      checks,
      loadingChecks,
      onSubmit() {},
    };
  },
};
</script>
