import { generateKeyPairSync, createSign, createVerify, KeyObject } from 'crypto';


function generateKeyPair() {

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem', 
    },
    privateKeyEncoding: {
      type: 'pkcs8', 
      format: 'pem', 
    },
  });
  
  return { publicKey, privateKey };
}

function signMessage(privateKey: KeyObject, message: string): string {
  const sign = createSign('SHA256');
  sign.update(message);
  sign.end();
  
  const signature = sign.sign(privateKey, 'base64');
  return signature;
}

export { generateKeyPair, signMessage};