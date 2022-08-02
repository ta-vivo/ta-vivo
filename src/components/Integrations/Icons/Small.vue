<template>
  <span @click="$emit('click')">
    <q-img
      v-if="type === 'slack'"
      :src="getIntegrationIcon(type).icon"
      :style="`width: ${size === 'sm' ? '20px' : '24px'}`"
      spinner-color="white"
    />
    <q-icon
      v-else
      :size="size"
      :name="getIntegrationIcon(type).icon"
      :color="getIntegrationIcon(type).color"
      :style="getIntegrationIcon(type).style || ''"
    />
    <slot />
  </span>
</template>

<script>
import {
  fabTelegram,
  farEnvelope,
  fabDiscord,
  fabWhatsapp
} from "@quasar/extras/fontawesome-v5";
import slackImage from "assets/slack-logo.png";

export default {
  name: "ComponentSmallIntegrationIcon",
  props: {
    type: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "sm",
    },
  },
  methods: {
    getIntegrationIcon(integration) {
      switch (integration) {
        case "telegram":
          return { icon: fabTelegram, color: "blue" };
        case "email":
          return { icon: farEnvelope, color: "grey" };
        case "slack":
          return { icon: slackImage };
        case "discord":
          return { icon: fabDiscord, style: "color: #5865F2" };
        case "whatsapp":
          return {icon: fabWhatsapp, style: "color: #41C353"}
        default:
          return "";
      }
    },
  },
};
</script>
