<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-center">
      <p>{{ $t("messages.information.discordIntegrationDescription") }}</p>
      <a
        style="text-decoration: none"
        href="https://discord.com/api/oauth2/authorize?client_id=946962652582776932&redirect_uri=https%3A%2F%2Ftavivo.do%2Fintegrations%2Fdiscord%2Fsuccess&response_type=code&scope=webhook.incoming"
      >
        <q-btn no-caps outline color="black">
          <q-icon style="color: #5865f2" :name="fabDiscord" class="q-mr-sm" />
          {{ $t("action.addToDiscord") }}
        </q-btn>
      </a>
    </div>
    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>
    <div class="col-12 text-center">
      <p class="text-bold">Discord</p>
      <p>{{ $t("messages.information.discordIntegrationInstructions") }}</p>
      <p>
        <q-img
          class="q-mt-md"
          src="~assets/discord/integration.png"
          spinner-color="white"
          style="max-width: 500px; border: 1px solid grey; border-radius: 5px"
        />
      </p>
    </div>
  </div>
</template>

<script>
import { fabDiscord } from "@quasar/extras/fontawesome-v5";
export default {
  name: "ComponentDiscordForm",
  setup() {
    return {
      fabDiscord,
    };
  },
};
</script>
