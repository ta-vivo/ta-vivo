<template>
  <q-page padding>
    <div style="max-width: 600px">
      <p class="text-h3">{{ $t("common.about") }}</p>
      <p>{{ $t("messages.about.aboutTheProject") }}</p>
      <p class="text-h5">{{ $t("common.openSource") }}</p>
      <p>
        {{ $t("messages.about.theProjectIsOpenSource") }}
        <a href="https://github.com/ta-vivo">Github</a> ❤️.
      </p>
      <p class="text-h5">
        {{ $t("messages.about.GuaranteeOfOperationAndDataIntegrity") }}
      </p>
      <p>
        {{
          $t("messages.about.guaranteeOfOperationAndDataIntegrityDescription")
        }}
      </p>
      <p>{{ $t("messages.about.databaseAndBackups") }}</p>
      <p class="text-h5">{{ $t("common.contact") }}</p>
      Albert Hidalgo
      <div>
        {{ $t("common.email") }}:
        <a href="mailto:contact@albert.do">contact@albert.do</a>
      </div>
      <div>
        {{ $t("common.phone") }}: +1 (809) 998-2632 <i>(Dominican Republic)</i>
      </div>
      <div>
        Github:
        <a href="https://github.com/ta-vivo">https://github.com/ta-vivo</a>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageAbout",
};
</script>
