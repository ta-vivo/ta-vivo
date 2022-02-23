<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section class="text-center" v-if="success">
        <div class="row">
          <div class="col-12">
            <q-icon
              size="120px"
              color="positive"
              name="eva-checkmark-circle-2-outline"
            />
            <p>{{$t('messages.information.slackIntegrationAddedSuccess')}}</p>
          </div>
          <div class="col-12">
            <q-btn
              push
              color="primary"
              :label="$t('action.backToIntegrations')"
              @click="$router.push('/integrations')"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "PageSlackSuccess",
  setup() {
    const $router = useRouter();
    const $store = useStore();
    const $q = useQuasar();

    const authorizationCode = $router.currentRoute.value.query.code;
    const success = ref(false);

    $q.loading.show();
    $store.dispatch("integrations/createSlackIntegration", {
      authorizationCode,
    })
    .then(() => {
      success.value = true;
    })
    .finally(() => {
      $q.loading.hide();
    })

    return {
      success,
    };
  },
};
</script>
