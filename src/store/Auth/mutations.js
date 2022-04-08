
export function SET_USER(state, user) {
  const { id, email, active, enabled, role, settings } = user;
  state.user = { id, email, active, enabled, role, settings };
}
