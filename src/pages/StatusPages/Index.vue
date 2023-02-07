<template>
  <q-page padding>
    <div>
      <q-btn
        class="create-status-page"
        push
        color="primary"
        icon="eva-plus"
        :label="$t('action.addStatusPage')"
        to="/status-pages/add"
      />
    </div>
    <q-table
      :grid="$q.screen.xs"
      class="q-mt-lg"
      bordered
      flat
      :rows-per-page-options="[10]"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-model:pagination="pagination"
      @request="fetchStatusPages"
    >
      <!-- Table -->
      <template v-slot:body-cell-enabled="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.enabled ? 'positive' : 'negative'"
            text-color="white"
          >
            {{
              props.row.enabled ? $t("common.enabled") : $t("common.disabled")
            }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props">
          <span>{{ breakDescription(props.row.description) }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            flat
            size="sm"
            icon="eva-trash-outline"
            @click="handleDeleteStatusPage(props.row)"
          >
            <q-tooltip class="bg-negative">
              {{ $t("action.delete") }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog persistent v-model="showDeleteDialog">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ $t("messages.information.deleteStatusPage") }}
          </div>
        </q-card-section>
        <q-card-section>
          {{ $t("messages.information.deleteStatusPageDescription1") }}
          <strong>{{ statusPageToDelete.name }}</strong>
          {{ $t("messages.information.deleteStatusPageDescription2") }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            outline
            :label="$t('action.goBack')"
            color="default"
            v-close-popup
          />
          <q-btn
            :loading="loading"
            @click="dispatchDeleteStatusPage()"
            push
            :label="$t('action.yesDelete')"
            color="negative"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default {
  name: "PageStatusPagesList",
  setup() {
    const store = useStore();
    const $t = useI18n().t;

    const showDeleteDialog = ref(false);
    const statusPageToDelete = ref({ name: "", uuid: "" });
    const loading = ref(false);
    const rows = ref([]);
    const pagination = ref({
      sortBy: "createdAt",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });

    const columns = [
      {
        name: "name",
        label: $t("common.name"),
        field: "name",
        align: "left",
      },
      {
        name: "description",
        label: $t("common.description"),
        field: "description",
        align: "left",
      },
      {
        name: "enabled",
        label: $t("common.status"),
        field: "enabled",
        align: "left",
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left",
      },
    ];

    const fetchStatusPages = (props) => {
      loading.value = true;

      if (props) {
        const { page, rowsPerPage } = props.pagination;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.page = page;
      }
      const queryString = `?page=${pagination.value.page}&limit=${pagination.value.rowsPerPage}&sort=-created_at`;

      store
        .dispatch("statusPages/fetchAll", queryString)
        .then((response) => {
          pagination.value.rowsNumber = response.data.pagination.total;
          rows.value = response.data.data.map((check) => {
            return {
              ...check,
              loadingEnableStatus: false,
            };
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    fetchStatusPages();

    const dispatchDeleteStatusPage = () => {
      loading.value = true;
      store
        .dispatch("statusPages/remove", statusPageToDelete.value.uuid)
        .then(() => {
          showDeleteDialog.value = false;
          fetchStatusPages();
        })
    };

    return {
      loading,
      rows,
      pagination,
      columns,
      fetchStatusPages,
      showDeleteDialog,
      breakDescription(description) {
        return description.length > 50
          ? description.substring(0, 50) + "..."
          : description;
      },
      handleDeleteStatusPage(statusPage) {
        showDeleteDialog.value = true;

        statusPageToDelete.value = {
          name: statusPage.name,
          uuid: statusPage.uuid,
        };
      },
      statusPageToDelete,
      dispatchDeleteStatusPage,
    };
  },
};
</script>
