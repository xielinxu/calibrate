var appVersion = require('electron').remote.app.getVersion();
const ENV = require('./env.js')
const shell = require('electron').shell




const Main = require('./components/main')

const DeviceConfig = require('./components/device_config')

const Storage = require('./storage');

const routes = [
  
  { path: '/main', component: Main },

  { path: '/device_config/:comName', name: "device_config", component: DeviceConfig}
]

const router = new VueRouter({
  routes
})


var vue = new Vue({
  el: "#app",
  router: router,
  data: {
    appName: ENV.name,
    appVersion: appVersion,
  },
  methods: {
    
  },
  computed: {
    manufacturerName: function() {
      if(this.currentUser.attr.manufacturer) {
        return this.currentUser.attr.manufacturer.name
      } else {
        return '[无]'
      }
    }
  }
})



// 值大于另一个字段的值 greet_than:other_field
const great_then = {
  getMessage(field, params, data) {
    return field + '必须大于' + params[0]
  },
  validate(value, args) {
    var targetName = args[0]
    var field = document.querySelector(("input[name='" + targetName + "']"));
    var targetValue = field.value

    return parseFloat(value) > parseFloat(targetValue)
  }
}






  router.push('/main')

 

window.addEventListener('dragover', event => {
  event.dataTransfer.dropEffect = 'none';
  event.preventDefault();
});