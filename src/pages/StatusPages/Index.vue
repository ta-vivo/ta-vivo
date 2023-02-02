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
  </q-table>
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
        label: $t('common.name'),
        field: "name",
        align: "left",
      },
      {
        name: "description",
        label: $t('common.description'),
        field: "description",
        align: "left",
      },
      {
        name: "enabled",
        label: $t('common.status'),
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

    return {
      loading,
      rows,
      pagination,
      columns,
      fetchStatusPages,
      breakDescription(description) {
        return description.length > 50
          ? description.substring(0, 50) + "..."
          : description;
      },
    };
  },
};
</script>
