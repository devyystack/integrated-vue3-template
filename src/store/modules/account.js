const getDefaultState = () => {
    return {
        _addr :'',
        name: '',
        _id : '',
        role: 10, // 0: superwarden, 1: warden, 2: master, 3: villager but create proposal, 4: villager 10: not joined
    }
  }
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ACCOUNT: (state, account) => {
    state._addr = account.address
    state.name = account.name
    state._id = account._id
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
}

const actions = {
  resetState({ commit }) {
    return new Promise(() => {
      commit('RESET_STATE')
    })
  },
  setAccount({ commit }, account) {
    commit('SET_ACCOUNT', account)
  },
  setRole({commit}, role){
    commit('SET_ROLE', role)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}