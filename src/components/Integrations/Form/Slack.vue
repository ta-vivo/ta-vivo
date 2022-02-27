<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-center">
      <p>{{$t('messages.information.slackIntegrationDescription')}}</p>
      <a href="https://slack.com/oauth/v2/authorize?client_id=3140526386388.3131587795430&scope=chat:write,incoming-webhook&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
    </div>
    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>
    <div class="col-12 text-center">
      <p class="text-bold">Slack</p>
      <p>{{$t('messages.information.slackIntegrationInstructions')}}</p>
      <p>
        <q-img
          class="q-mt-md"
          src="~assets/slack/slack-integration.png"
          spinner-color="white"
          style="max-width: 500px; border: 1px solid grey; border-radius: 5px;"
        />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentSlackForm",
  setup() {
  }
};
</script>
