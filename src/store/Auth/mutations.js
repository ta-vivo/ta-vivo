
export function SET_USER(state, user) {
  const { id, email, fullname, active, enabled, role, settings } = user;
  state.user = { id, email, fullname, active, enabled, role, settings };
}
