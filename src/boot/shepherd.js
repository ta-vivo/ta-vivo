import { boot } from 'quasar/wrappers'
import VueShepherdPlugin from 'vue-shepherd';

export default boot(({ app }) => {
  app.use(VueShepherdPlugin)
})
