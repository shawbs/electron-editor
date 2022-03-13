const state = {
  files: [],
  folders: []
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
}

export default {
  state,
  mutations,
  actions
}
