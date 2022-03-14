const state = {
  files: [],
  folder: null
}

const mutations = {
  set_files (state,data) {
    state.files = data
  },
  set_folders (state,data) {
    state.folders = data
  },
}

const actions = {
  set_files({commit},data){
    commit('set_files',data)
  },
  set_folders ({commit},data) {
    commit('set_folders',data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
