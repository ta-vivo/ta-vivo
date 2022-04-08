<template>
  <q-page padding>
    <div>
      <q-btn
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addIntegration')"
        to="/integrations/add"
        :disable="reachedTheLimit()"
      />
      <span :class="`${$q.screen.lt.md ? 'block q-mt-md' : null} q-ml-sm`" v-if="reachedTheLimit()">
        <q-icon size="sm" name="eva-info-outline" />
        {{$t('messages.information.reachedLimit')}}.
        <router-link class="text-primary" to="/pricing">{{$t('common.viewAllPlans')}}</router-link>
      </span>
    </div>
    <q-table
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[]"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-icon="props">
        <q-td :props="props">
          <div class="the-integration items-center">
            <IntegrationIcon
              class="cursor-pointer"
              :type="props.row.type"
              size="md"
              @click="handleEditIntegration(props.row)"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            size="sm"
            icon="eva-eye-outline"
            @click="handleEditIntegration(props.row)"
          >
            <q-tooltip>
              {{ $t("common.details") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            color="negative"
            flat
            size="sm"
            icon="eva-trash-outline"
            @click="handleDeleteIntegration(props.row)"
          >
            <q-tooltip class="bg-negative">
              {{ $t("action.delete") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="showEditIntegrationDialog">
      <q-card style="width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t("action.editIntegration") }}</div>
          <q-space />
          <q-btn
            color="primary"
            flat
            round
            dense
            v-close-popup
            text-color="black"
            icon="eva-close-outline"
          />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveEditIntegration" class="q-gutter-md">
            <q-input
              type="text"
              :hint="
                $t('messages.information.telegramIntegrationNamePlaceholder')
              "
              outlined
              v-model="integration.name"
              :label="$t('common.name')"
              lazy-rules
              :disable="integration.type === 'email'"
              :rules="[
                (val) =>
                  (val && val.length > 0) || $t('messages.errors.requireField'),
              ]"
            />
            <div class="text-center">
              <q-btn
                push
                :loading="loading"
                :label="$t('action.save')"
                type="submit"
                color="primary"
                icon="eva-save-outline"
                :disable="integration.type === 'email'"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import IntegrationIcon from "components/Integrations/Icons/Small";
import jwtDecode from "jwt-decode";

export default {
  name: "PageIntegrations",
  components: {
    IntegrationIcon,
  },
  setup() {
    const $t = useI18n().t;
    const $q = useQuasar();
    const columns = [
      {
        name: "icon",
        label: "",
        align: "center",
        field: "icon",
      },
      {
        name: "name",
        label: $t("common.name"),
        align: "left",
        field: "name",
      },
      {
        name: "assignments",
        align: "center",
        label: $t("common.assignments"),
        field: (row) => row.check_integrations.length,
      },
      {
        name: "action",
        label: "",
        field: "action",
      },
    ];

    const rows = ref([]);
    const loading = ref(false);
    const showEditIntegrationDialog = ref(false);
    const integration = ref({});

    const store = useStore();
    loading.value = true;
    store
      .dispatch("integrations/fetchAll")
      .then((response) => {
        rows.value = response.data.data;
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      columns,
      rows,
      loading,
      showEditIntegrationDialog,
      integration,
      handleDeleteIntegration(integration) {
        $q.dialog({
          title: "Confirm",
          message: $t("messages.information.areYouSureYouWantToDelete").replace(
            "[ITEM]",
            integration.name
          ),
          cancel: true,
          ok: {
            label: $t("action.delete"),
            color: "negative",
          },
          cancel: {
            label: $t("action.noKeepIt"),
            color: "primary",
            outline: true,
          },
          persistent: true,
        }).onOk(() => {
          $q.loading.show({});
          store
            .dispatch("integrations/remove", { id: integration.id })
            .then(() => {
              loading.value = true;
              store
                .dispatch("integrations/fetchAll")
                .then((response) => {

                  store.dispatch("auth/me").then((response) => {
                    const token = response.data.data.token;
                    const decoded = jwtDecode(token);

                    store.commit("auth/SET_USER", decoded);
                  })
                  rows.value = response.data.data;
                })
                .finally(() => {
                  loading.value = false;
                });
            })
            .finally(() => {
              $q.loading.hide();
            });
        });
      },
      handleEditIntegration({ id, name, type }) {
        integration.value = { id, name, type };
        showEditIntegrationDialog.value = true;
      },
      saveEditIntegration() {
        loading.value = true;
        store
          .dispatch("integrations/update", {
            id: integration.value.id,
            payload: {
              name: integration.value.name,
            },
          })
          .then(() => {
            showEditIntegrationDialog.value = false;
            $q.notify({
              color: "positive",
              message: $t("action.integrationUpdated"),
            });
            store
              .dispatch("integrations/fetchAll")
              .then((response) => {
                rows.value = response.data.data;
              })
              .finally(() => {
                loading.value = false;
              });
          })
          .finally(() => {
            loading.value = false;
          });
      },
      reachedTheLimit() {
        const user = store.getters["auth/getUser"];
        if (user.settings && user.settings.integrations) {
          return user.settings.integrations.count >= user.settings.integrations.limit;
        }

        return false;
      },
    };
  },
};
</script>
