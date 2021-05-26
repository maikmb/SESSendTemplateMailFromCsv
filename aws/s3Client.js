const AWS = require("aws-sdk")
const s3Key = require('../aws-s3-key')
class s3Client {
  constructor() {
    
    this.s3 = new AWS.S3({ region: s3Key.region,  accessKeyId: s3Key.accessKeyId, secretAccessKey: s3Key.secretAccessKey })    
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
