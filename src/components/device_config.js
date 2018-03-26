var SerialPortWrapper = require('./../serialport-wrapper')
//const HouseKeeper = require('./../housekeeper')

const DeviceConfig = {
    created: function () {
        console.log("config", this.$route.params)
        var serialPortWrapper = new SerialPortWrapper(this.$route.params.comName, this.$route.params.port)
        this.seriaport = serialPortWrapper
        var self = this
        serialPortWrapper.onError(function(msg) {
            vex.dialog.alert("串口出错：" + msg)
        })
        serialPortWrapper.onDeviceParamLoad(function (result) {
            if(result) {
				
                self.message = '查询成功'
                self.attr = result["ADC值"]
				self.adc1 = self.adc2
				self.adc2 = self.adc3
				self.adc3 = result["ADC值"]
				
                setTimeout(function(){self.message = ''},2000)
				
            }else {
                vex.dialog.alert('查询失败')
            }
        })		

        serialPortWrapper.start()
    },
    destroyed: function(){
      console.log("destroyed")
      this.seriaport.close()
    },
    template: '#device-config-template',
    data: function () {
        return {
            productName: null,
            attr: null,
			y1: 0,
			y2: 1000,
			y3: 10000,
			time: 0,
			x1: null,
			x2: null,
			x3: null,
			adc1: null,
			adc2: null,
			adc3: null,			
            message: '',
			result: "",
        }
    },

    methods: {
             
        close: function () {
            this.seriaport.close()
            this.$router.push('/main')
        },
		selectADC: function(){
			var self = this
			if(self.x1 == null){
				console.log("x1")
				self.x1 = self.attr				
			}else if(self.x2 == null){
				console.log("x2")
				self.x2 = self.attr
			}else if(self.x3 == null){
				console.log("x3")
				self.x3 = self.attr
				this.seriaport.close()				
			}
		},
		getResult: function(){
			var self = this
			var k1,k2,b1,b2
			k1 = ((self.y2 - self.y1) / (self.x2 - self.x1))
			b1 = (self.y1 - self.x1 * k1).toFixed(2)
			k2 = ((self.y3 - self.y2) / (self.x3 - self.x2))
			b2 = (self.y2 - self.x2 * k2).toFixed(2)
			self.result = "公式一:y1 = x1 * "	+ k1.toFixed(2) +" + " + b1 + ";公式二:y2 = x2 * "	+ k2.toFixed(2) +" + " + b2
		}

    }
}

module.exports = DeviceConfig
