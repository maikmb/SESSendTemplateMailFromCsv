const AWS = require("aws-sdk")

class s3Client {
  constructor() {
    this.s3 = new AWS.S3({ region: 'us-east-1',  accessKeyId: 'AKIA2IKUOQ65QL5QOQ6J', secretAccessKey: '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' })
    
  }

  async assinarUrlObjeto(Key) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: 'ms-escrituracao-prd',
      Key,
      Expires: 5 * 24 * 60 * 60
    })
  }

  async verificarExistenciaObjeto(Key) {
    try {
      await this.s3
        .headObject({
          Bucket: 'ms-escrituracao-prd',
          Key,
        })
        .promise()
      return true
    } catch (_) {
      return false
    }
  }
}

module.exports = s3Client
