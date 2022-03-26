<template>
  <q-badge
    outline
    :color="roleSettings.backgroundColor"
    :text-color="roleSettings.textColor"
    :label="roleSettings.role"
  />
</template>

<script>
export default {
  name: "ComponentUserBadge",
  props: {
    role: String
  },
  setup(props) {
    const roleSettings = {
      textColor: "white",
      backgroundColor: "primary",
      role: "Basic",
    };

    switch (props.role.toLowerCase()) {
      case "basic":
        roleSettings.backgroundColor = "black";
        roleSettings.role = "Basic";
        break;
      case "pro":
        roleSettings.backgroundColor = "primary";
        roleSettings.role = "Pro";
        break;
      case "enterprise":
        roleSettings.backgroundColor = "orange";
        roleSettings.role = "Enterprise";
        break;
      case "enterprise+":
        roleSettings.backgroundColor = "purple";
        roleSettings.role = "Enterprise+";
        break;
      case 'administrator':
        roleSettings.backgroundColor = 'red';
        roleSettings.role = 'Administrator';
        break;
      default:
        roleSettings.textColor = "black";
        roleSettings.backgroundColor = "primary";
    }
    return {
      roleSettings,
    };
  },
};
</script>
