class Packet {
  constructor(data) {
    this.data = data
    this._buffer = Buffer.from(data)
    this.command = data[2]
    this.protocol_version = data[3]
    this.dataBuffer = Buffer.from(data)
  }

  buffer() {
    return this._buffer
  }

  toString() {
    return this._buffer.toString('hex')
  }
}


module.exports = Packet
