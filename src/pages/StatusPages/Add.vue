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
          />
          <q-toggle
            v-model="statusPage.isPublic"
            :label="$t('common.public')"
          />
          <div class="q-mt-none q-ml-lg text-italic text-grey-8">
            {{ $t("messages.information.statusPagePublicDescription") }}
          </div>

          <div>
            <p class="check-selection-title text-bold">
              {{ $t("common.checksInformation") }}
            </p>
            <div>
              {{ $t("messages.information.statusPageCheckDescription") }}
            </div>
            <div v-show="showCheckSelectionError">
              <q-banner
                rounded
                class="text-white bg-primary q-my-sm"
                style="max-width: 450px"
              >
                <q-icon name="eva-alert-circle-outline" />
                {{ $t("messages.errors.noChecksSelected") }}
              </q-banner>
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
          <div class="invitations-container">
            <div>
              <p class="text-bold">{{ $t("common.invitations") }}</p>
              <div>
                {{ $t("messages.information.statusPageInvitationDescription") }}
              </div>
            </div>
            <q-input
              class="invitation q-mt-sm"
              style="max-width: 500px"
              name="invitation"
              type="email"
              outlined
              v-model="currentInvitation"
              :label="$t('common.email')"
              :error="isDuplicateInvitationEmail()"
              :error-message="$t('messages.errors.duplicateEmail')"
              lazy-rules
            >
              <template v-slot:after>
                <q-btn
                  @click="addInvitation()"
                  push
                  color="primary"
                  icon="eva-plus-circle-outline"
                  :label="$t('action.addEmail')"
                  :disable="
                    !isValidInvitationEmail() || isDuplicateInvitationEmail()
                  "
                />
              </template>
            </q-input>

            <div class="invitations">
              <q-chip
                v-for="invitation in invitations"
                :key="invitation"
                class="q-my-sm"
                removable
                @remove="removeInvitation(invitation)"
              >
                {{ invitation }}
              </q-chip>
            </div>
          </div>
          <div class="text-center">
            <q-btn
              class="submit"
              push
              :loading="loading"
              :label="$t('action.save')"
              type="submit"
              color="primary"
              icon="eva-save-outline"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default {
  name: "PageStatusPageAdd",

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const $t = useI18n().t;
    const $router = useRouter();

    const checks = ref([]);
    const showCheckSelectionError = ref(false);
    const invitations = ref([]);
    const currentInvitation = ref("");
    const loading = ref(false);
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
      showCheckSelectionError,
      loadingChecks,
      loading,
      invitations,
      currentInvitation,
      onSubmit() {
        loading.value = true;
        const payload = {
          name: statusPage.value.name,
          description: statusPage.value.description,
          isPublic: statusPage.value.isPublic,
          checks: checks.value
            .filter((check) => check.addToStatusPage)
            .map((check) => check.id),
          invitations: invitations.value,
        };

        if (payload.checks.length === 0) {
          document.querySelector(".check-selection-title").scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          showCheckSelectionError.value = true;
          loading.value = false;
          return;
        }

        store
          .dispatch("statusPages/create", payload)
          .then(() => {
            $q.notify({
              message: $t("action.statusPageCreated"),
              color: "positive",
            });
            $router.push({ name: "status-pages", query: { created: true } });
          })
          .catch((error) => {
            console.log('🚀 ~ file: Add.vue:232 ~ onSubmit ~ error', error)
            $q.notify({
              color: "negative",
              message: error.response.data.message,
            });
          })
          .finally(() => {
            loading.value = false;
          });
      },
      isValidInvitationEmail() {
        return String(currentInvitation.value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      isDuplicateInvitationEmail() {
        return invitations.value.includes(currentInvitation.value);
      },
      addInvitation() {
        invitations.value.push(currentInvitation.value);
        currentInvitation.value = "";
      },
      removeInvitation(invitation) {
        invitations.value.splice(invitations.value.indexOf(invitation), 1);
      },
    };
  },
};
</script>
