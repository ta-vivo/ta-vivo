<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <p class="text-h6">{{ $t("common.basicInformation") }}</p>
        <strong>{{ $t("common.fullname") }}:</strong>
        <span class="q-mr-sm">{{ user.fullname }}</span>
        <div>
          <strong>{{ $t("common.email") }}:</strong> {{ user.email }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="text-h6">{{ $t("common.subscription") }}</p>

        <role-badge
          class="cursor-pointer"
          @click="$router.push('/pricing')"
          :role="$store.getters['auth/getUser'].role"
        />

        <div
          class="plan-features q-my-md"
          v-show="planDetails.features.length > 0"
        >
          <div v-for="feature in planDetails.features" :key="feature.item">
            <pricing-feature :feature="feature" />
          </div>
        </div>

        <div class="q-mb-lg">
          <q-btn
            outline
            color="primary"
            to="/pricing"
            :label="$t('common.viewAllPlans')"
          />
        </div>
        <div v-show="user.role !== 'basic'">
          <q-btn
            @click="showCancelSubscription = true"
            push
            color="negative"
            :label="$t('action.cancelSubscription')"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showCancelSubscription">
      <q-card style="width:400px">
        <q-card-section>
          <div class="text-h6">
            {{ $t("messages.questions.areYousureYouWantCancelSubscription") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{$t('messages.information.unsubscribeDescription')}}
          <div class="q-my-md">
          <div v-for="feature in basicPlan.features" :key="feature.item">
            <pricing-feature :feature="feature" />
          </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline :label="$t('action.keepSubscription')" color="primary" v-close-popup />
          <q-btn push :label="$t('action.unsubscribe')" color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import jwtDecode from "jwt-decode";
import RoleBadge from "components/User/RoleBadge.vue";
import PricingFeature from "components/Pricing/Feature";

export default {
  name: "PageProfile",
  components: {
    RoleBadge,
    PricingFeature,
  },
  setup() {
    const store = useStore();
    const user = ref({});
    const planDetails = ref({
      features: [],
    });
    const basicPlan = ref({
      features: [],
    });
    const showCancelSubscription = ref(false);

    store.dispatch("auth/me").then((response) => {
      const token = response.data.data.token;
      const decoded = jwtDecode(token);

      user.value = decoded;
    });

    store
      .dispatch("payments/fetchPricing")
      .then((response) => {
        const plans = response.data.data;

        const found = plans.find(
          (plan) => plan.name.toLowerCase() === user.value.role
        );

        if (found) {
          planDetails.value = found;
        }

        const basic = plans.find(
          (plan) => plan.name.toLowerCase() === "basic" || plan.name.toLowerCase() === "free"
        );
        console.log('🚀 ~ file: Profile.vue ~ line 122 ~ .then ~ basic', basic)

        if (basic) {
          basicPlan.value = basic;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return {
      user,
      planDetails,
      basicPlan,
      showCancelSubscription
    };
  },
};
</script>
