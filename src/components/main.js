var SerialPort = require('serialport')
var SerialPortWrapper = require('./../serialport-wrapper')

const Main = {
  template: '#main-template',
  created: function() {
    this.refreshSerialPorts()
  },
  data: function() {
    return {
      ports: [],
      selected: [],
    }
  },
  computed: {
    // 从 multiple select 中选择第一个
    selectedComName: function() {
      if(this.selected && this.selected.length > 0){
        return this.selected[0]
      }
      return null
    }
  },
  methods: {
    refreshSerialPorts: function() {
      let self = this;
      SerialPort.list(function(err, ports) {
        self.ports = []
        ports.forEach(function(port) {
          self.ports.push(port);
        });
      })
    },
    // 双击进入配置
    toDeviceConfig: function() {
      if(this.selected.length > 0) {
        this.$router.push({ 
          name: "device_config", 
          params: { 
            comName: this.selectedComName, 
          }
        })
      }
    }
  }
}

module.exports = Main
