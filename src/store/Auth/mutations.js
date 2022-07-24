
export function SET_USER(state, user) {
  const { id, email, fullname, active, enabled, role, settings, timezone } = user;
  state.user = { id, email, fullname, active, enabled, role, settings, timezone };
}
