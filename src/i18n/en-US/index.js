// This is just an example,
// so you can safely delete all default props below

export default {
  common: {
    login: 'Login',
    username: 'Username',
    password: 'Password',
    checks: 'Checks',
    integrations: 'Integrations',
    name: 'Name',
    target: 'Target',
    period: 'Period',
    basicInformation: 'Basic Information',
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled',
    assignments: 'Assignments',
    uniqueCode: 'Unique Code',
    check: 'Check',
    at: 'at',
    date: 'Date',
    mostRecentsLogs: 'Most recent logs',
    incidentFound: 'Incident found',
    noIncident: 'No incident found in the last hour',
    isNoReachable: 'is not reachable',
    email: 'Email',
    emailConfirmationCode: 'Email confirmation code',
    termsAndConditions: 'Terms and conditions',
    privacyPolicy: 'Privacy policy'
  },
  action: {
    addCheck: 'Add Check',
    editCheck: 'Edit Check',
    save: 'Save',
    checkCreated: 'Check created',
    checkUpdated: 'Check updated',
    addIntegration: 'Add Integration',
    delete: 'Delete',
    noKeepIt: 'No, keep it',
    backToTheList: 'Back to the list',
    integrationCreated: 'Integration created',
    editIntegration: 'Edit Integration',
    integrationUpdated: 'Integration updated',
    requestCode: 'Request code'
  },
  messages: {
    information: {
      noIntegrationFound: 'No integration found',
      areYouSureYouWantToDelete: 'Are you sure you want to delete [ITEM]?',
      uniqueCodeGetFromTelegram: 'Unique code get from Telegram',
      telegramSetupInformation: 'You can receive direct messages on Telegram with the integration of the ta-vivo bot.',
      telegramSetupBot: 'Search Telegram',
      telegramSetupBotCommand: 'Type /start command. The bot will respond with a unique code.',
      telegramIntegrationNamePlaceholder: 'The name is to identify it in the list of integrations',
      emailVerification: 'A unique 1-use code was sent to [EMAIL]. Please check your spam folder if you don`t see the email in your main inbox.'
    },
    errors: {
      requireField: 'This field is required',
      notValidEmail: 'This is not a valid email',
    }
  }
}