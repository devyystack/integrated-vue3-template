import { createStore } from 'vuex'
import getters from './getters'
import account from './modules/account'

const store = createStore({
    modules: {
        account,
    },
    getters,
  })
export default store