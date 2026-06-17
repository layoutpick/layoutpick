// Chromium native-messaging stdio framing: 4-byte LE length prefix + UTF-8 JSON.
export function encodeMessage(obj: unknown): Buffer {
  const json = Buffer.from(JSON.stringify(obj), 'utf8')
  const header = Buffer.alloc(4)
  header.writeUInt32LE(json.length, 0)
  return Buffer.concat([header, json])
}

export class FrameReader {
  private buf: Buffer

  constructor() {
    this.buf = Buffer.alloc(0)
  }

  // Append a chunk; invoke onMessage(obj) for each fully-received frame.
  push(chunk: Buffer, onMessage: (obj: any) => void): void {
    this.buf = Buffer.concat([this.buf, chunk])
    while (this.buf.length >= 4) {
      const len = this.buf.readUInt32LE(0)
      if (this.buf.length < 4 + len)
        break
      const body = this.buf.subarray(4, 4 + len)
      this.buf = this.buf.subarray(4 + len)
      onMessage(JSON.parse(body.toString('utf8')))
    }
  }
}
