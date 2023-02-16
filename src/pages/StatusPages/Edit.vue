<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <p class="text-h5">{{ $t("action.editStatusPage") }}</p>
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
            <template v-if="loadingChecks">
              <q-card
                flat
                bordered
                class="my-card bg-grey-1 q-my-sm"
                style="max-width: 400px"
                v-for="i in 4"
                :key="i"
              >
                <q-card-section>
                  <q-skeleton type="text" width="300px" />
                  <q-skeleton type="text" width="150px" />
                </q-card-section>
              </q-card>
            </template>
            <template v-else>
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
                        @update:model-value="
                          (val) => updateCheckSelection(check, val)
                        "
                      />
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions vertical class="justify-around q-px-md">
                </q-card-actions>
              </q-card>
            </template>
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
                :color="invitation.status === 'accepted' ? 'positive' : 'grey-5'"
                :text-color="invitation.status === 'accepted' ? 'white' : 'black'"
              >
                {{ invitation.email }} - <i>{{ invitation.status.toUpperCase() }}</i>
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
import { useRouter, useRoute } from "vue-router";
import { isValidEmail } from "src/utils/validations";

export default {
  name: "PageStatusPageAdd",

  setup() {
    const store = useStore();
    const $q = useQuasar();
    const $t = useI18n().t;
    const $router = useRouter();
    const $route = useRoute();

    const checks = ref([]);
    const checksToAdd = ref([]);
    const checksToRemove = ref([]);
    const showCheckSelectionError = ref(false);
    const invitations = ref([]);
    const addEmailInvitations = ref([]);
    const removeEmailInvitations = ref([]);
    const currentInvitation = ref("");
    const loading = ref(true);
    const loadingChecks = ref(true);
    const statusPage = ref({
      name: "",
      description: "",
      isPublic: false,
    });
    const uuid = $route.params.uuid;

    store.dispatch("statusPages/fetchByuuid", uuid).then((response) => {
      statusPage.value = {
        ...statusPage.value,
        ...response.data.data,
        checks: response.data.data.status_page_checks.map((check) => check.id),
      };

      invitations.value = response.data.data.status_page_invitations.map(
        (invitation) => ({ email: invitation.email, status: invitation.status })
      );

      store
        .dispatch("checks/fetchAll", "?limit=9999")
        .then((response) => {
          checks.value = response.data.data.map((check) => {
            return {
              ...check,
              addToStatusPage: statusPage.value.checks.includes(check.id),
            };
          });
        })
        .finally(() => {
          loading.value = false;
          loadingChecks.value = false;
        });
    });

    return {
      statusPage,
      checks,
      showCheckSelectionError,
      loading,
      loadingChecks,
      invitations,
      currentInvitation,
      onSubmit() {
        loading.value = true;
        const payload = {
          name: statusPage.value.name,
          description: statusPage.value.description,
          isPublic: statusPage.value.isPublic,
          checksToAdd: checksToAdd.value,
          checksToRemove: checksToRemove.value,
          addEmailInvitations: addEmailInvitations.value,
          removeEmailInvitations: removeEmailInvitations.value,
        };

        if (statusPage.value.checks.some((check) => check.addToStatusPage)) {
          document.querySelector(".check-selection-title").scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          showCheckSelectionError.value = true;
          loading.value = false;
          return;
        }

        store
          .dispatch("statusPages/update", {
            uuid: statusPage.value.uuid,
            payload,
          })
          .then(() => {
            $q.notify({
              message: $t("action.statusPageUpdated"),
              color: "positive",
            });
            $router.push({ name: "status-pages", query: { created: true } });
          })
          .catch((error) => {
            console.log("🚀 ~ file: Add.vue:232 ~ onSubmit ~ error", error);
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
        return isValidEmail(currentInvitation.value);
      },
      isDuplicateInvitationEmail() {
        return invitations.value.includes(currentInvitation.value);
      },
      addInvitation() {
        invitations.value.push({ email: currentInvitation.value, status: 'not send'});
        addEmailInvitations.value.push(currentInvitation.value);
        currentInvitation.value = "";
      },
      removeInvitation(invitation) {
        invitations.value = invitations.value.filter(
          (currentInvitation) => currentInvitation.email !== invitation.email
        );
        removeEmailInvitations.value.push(invitation.email);
      },
      updateCheckSelection(check, value) {
        if (value) {
          checksToAdd.value.push(check.id);
          checksToRemove.value = checksToRemove.value.filter(
            (checkId) => checkId !== check.id
          );
        } else {
          checksToRemove.value.push(check.id);
          checksToAdd.value = checksToAdd.value.filter(
            (checkId) => checkId !== check.id
          );
        }
      },
    };
  },
};
</script>
