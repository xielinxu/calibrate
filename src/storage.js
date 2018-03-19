const UserKey = 'currentUser'
const LastBinPath = 'lastBinPath'

module.exports = {
  getUser: function() {
    var value = window.localStorage.getItem(UserKey)
    if(!value) {
      return null
    }

    return JSON.parse(value)
  },

  setUser: function(user) {
    window.localStorage.setItem(UserKey, JSON.stringify(user))
  },

  removeUser: function() {
    window.localStorage.removeItem(UserKey)
  },

  
  setLastBinPath: function(path) {
    window.localStorage.setItem(LastBinPath, path)
  },

  removeLastBinPath: function() {
    window.localStorage.removeItem(LastBinPath)
  },

  lastBinPath: function() {
    return window.localStorage.getItem(LastBinPath)
  }
}