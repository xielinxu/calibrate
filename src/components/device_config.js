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
				self.adc = result["ADC值"]
				self.setADC()
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
			x1: null,
			x2: null,
			x3: null,
			adc: null,
            adc_ary: [null,null,null,null,null,null,null,null,null],
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
				self.seriaport.close()
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
		},
		setADC: function(){
            var self = this
            if(self.x1 == null){
                console.log("x1 null")
                if(self.adc_ary[0] == null){
                    self.adc_ary[0] = self.attr
                }else if(self.adc_ary[1] == null){
                    self.adc_ary[1] = self.attr
                }else if(self.adc_ary[2] == null){
                    self.adc_ary[2] = self.attr
                }else if(self.adc_ary[2] != null){
                    self.x1 = self.attr
                }
            }else if(self.x2 == null){
                console.log("x2 null")
                if(self.adc_ary[3] == null){
                    self.adc_ary[3] = self.attr
                }else if(self.adc_ary[4] == null){
                    self.adc_ary[4] = self.attr
                }else if(self.adc_ary[5] == null){
                    self.adc_ary[5] = self.attr
                }else if(self.adc_ary[5] != null){
                    self.x2 = self.attr
                }
            }else if(self.x3 == null){
                console.log("x3 null")
                if(self.adc_ary[6] == null){
                    self.adc_ary[6] = self.attr
                }else if(self.adc_ary[7] == null){
                    self.adc_ary[7] = self.attr
                }else if(self.adc_ary[8] == null){
                    self.adc_ary[8] = self.attr
                }else if(self.adc_ary[8] != null){
                    self.x3 = self.attr
                }
            }else if(self.x3 != null){
                console.log("x3 no null")
                self.seriaport.close()
            }
        }

    }
}

module.exports = DeviceConfig
