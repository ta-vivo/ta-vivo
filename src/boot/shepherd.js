import { boot } from 'quasar/wrappers'
import VueShepherdPlugin from 'vue-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

export default boot(({ app }) => {
  app.use(VueShepherdPlugin)
})
