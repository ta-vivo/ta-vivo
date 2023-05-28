import supabase from "boot/supabase";

const dispatchGoogleAuth = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "google",
  });
}
const dispatchDiscordAuth = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "discord",
  });
}
const dispatchSlackAuth = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "slack",
  });
}
const dispatchGithubAuth = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "github",
  })
}

export { dispatchGoogleAuth, dispatchDiscordAuth, dispatchSlackAuth, dispatchGithubAuth };
