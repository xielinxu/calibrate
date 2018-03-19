var SerialPort = require('serialport')
var fs = require('fs');
var Packet = require('./packet')
var crc = require('crc-hash')

var nothing0 = []
nothing0[32] = 0x00
nothing0.fill(0x00, 0, 31)
nothing0 = Buffer.from(nothing0)

// TODO: unused
var nothingf = []
nothingf[32] = 0xff
nothingf.fill(0x00, 0, 31)
nothingf = Buffer.from(nothingf)

class SerialPortWrapper {
  constructor(comName, port) {
    this.comName = comName;
    // 是否复用 port, 从刷机界面跳过来需要复用 port
    if(port) {
      console.log("reuse port")
      this.port = port;
    } else {
      this.port = new SerialPort(comName, {
        baudRate: 115200
      })
    }
    // 是否已经销毁，如果已经销毁则不会触发 onError 回调
    this.closed = false
    this.agreement = 0x02;
    this.product = null;
  }

  start() {
    var self = this
    let port = this.port;
    var initHandle = function() {
      //self.startHandShake()
      var buffer = [];
      port.on('data', (data) => {
		  
        buffer = buffer.concat([...data.values()])
		//判断数据
		
        while (buffer.length >= 5) {
          //传输数据有帧头，用于判断
		  
		  
		  if (buffer[0] == 35){
			if (buffer[buffer.length -1] != 42){
				break
			}  
			var packetData = buffer.splice(0, buffer.length)
			self.packetReceive(packetData)
		  } else{
			buffer.shift()
		  }
        }
      });
    }

    // 复用的  port 可能已经打开了
    if(port.isOpen()){
      initHandle()
    } else {
      port.on('open', () => {
        console.log('port open')
        initHandle()
      })
    }

    port.on('error', function(err) {
      
      console.log('Error: ', err.message);
      if(!self.closed && self.onErrorCallback) {
        self.onErrorCallback(err.message);
      }
    })
  }



  packetReceive(packetData) {
	//读取数据
    //console.log("receive", Buffer.from(packetData).toString('hex').toUpperCase())
	console.log("receive", Buffer.from(packetData).toString())
    let str = Buffer.from(packetData).toString()
	let adc = str.slice(1,str.indexOf("?"))
	let type = str.slice(str.indexOf("?")+1,str.length - 1)
    if(this.deviceParamLoadCallback){
        this.deviceParamLoadCallback({"ADC值":adc,"设备类型":type})
    }	
	
  }
  
  onDeviceParamLoad(func){
    this.deviceParamLoadCallback = func
  }

  onError(func) {
    this.onErrorCallback = func
  }


  query_device_param(){
      this.port.write(this.write_command(Packet.Command.READ))
  }

  close() {
    if(this.closed) {
      return
    }
    console.log("关闭链接")
    this.closed = true
    if (this.port) {
      this.close_port()
    }
  }

  close_port(){
    
    this.port.flush()
    var self = this;
    this.closeTimeout = setTimeout(function(){
      console.log("real close")
      self.port.close()
    }, 1000)
  }
}

module.exports = SerialPortWrapper;
