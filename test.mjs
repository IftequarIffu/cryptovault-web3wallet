import crypto from 'crypto'


const encrypt = (plainText, password) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex');

  } catch (error) {
    console.log(error);
  }
}

const decrypt = (encryptedText, password) => {
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');

    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    const decrypted = decipher.update(encryptedData);
    const decryptedText = Buffer.concat([decrypted, decipher.final()]);
    return decryptedText.toString();
  } catch (error) {
    console.log(error)
  }
}

console.log(encrypt("Yoyo", '12345678'))

console.log(decrypt('9ebe612bbc72e43dc3489bf4327d87b6:70739de985f42c2c18936a34dbdb4aad', '12345678'))