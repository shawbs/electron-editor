const state = {
  theme: '',
  files: [],
  folder: ''
}

const mutations = {
  set_theme(state,data){
    state.theme = data
  },
  set_files (state,data) {
    state.files = data
  },
  set_folder (state,data) {
    state.folder = data
  },
}

const actions = {
  set_theme({commit},data){
    commit('set_theme',data)
  },
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
