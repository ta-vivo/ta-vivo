<template>
  <q-page padding>
    <div>
      <q-btn
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addIntegration')"
        to="/integrations/add"
      />
    </div>
    <q-table
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[]"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-icon="props">
        <q-td :props="props">
          <div class="the-integration items-center">
            <q-btn
              round
              flat
              size="lg"
              :icon="getIntegrationIcon(props.row.type).icon"
              :text-color="getIntegrationIcon(props.row.type).color"
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
            :to="`/integrations/edit/${props.row.id}`"
          />
          <q-btn
            color="negative"
            flat
            size="sm"
            icon="eva-trash-outline"
            @click="handleDeleteIntegration(props.row)"
          />
        </q-td>
      </template>
      ></q-table
    >
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { fabTelegram } from "@quasar/extras/fontawesome-v5";
import { useQuasar } from "quasar";

export default {
  name: "PageIntegrations",
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
        align: "left",
        label: $t("common.assignments"),
        field: row => row.check_integrations.length
      },
      {
        name: "action",
        label: "",
        field: "action",
      },
    ];

    const rows = ref([]);
    const loading = ref(false);

    const store = useStore();
    store.dispatch("integrations/fetchAll").then((response) => {
      rows.value = response.data.data;
    });

    return {
      columns,
      rows,
      loading,
      getIntegrationIcon(integration) {
        switch (integration) {
          case "telegram":
            return { icon: fabTelegram, color: "blue" };
          default:
            return "";
        }
      },
      handleDeleteIntegrations(integration) {
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
    };
  },
};
</script>
