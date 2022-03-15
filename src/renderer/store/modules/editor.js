const state = {
  files: [],
  folder: null
}

const mutations = {
  set_files (state,data) {
    state.files = data
  },
  set_folder (state,data) {
    state.folder = data
  },
}

const actions = {
  set_files({commit},data){
    commit('set_files',data)
  },
  set_folder ({commit},data) {
    commit('set_folder',data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
