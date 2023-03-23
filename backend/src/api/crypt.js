const crypto = require('crypto');
const fs = require('fs');
const { cryptOptions, privateKeyOptions } = require('./serverOptions');

exports.encryptData = async (data) => {
  const publicKey = fs.readFileSync('src/cryptoKeys/RSApublicKey.pem');
  const encStr = crypto
    .publicEncrypt({ key: publicKey, ...cryptOptions }, Buffer.from(data))
    .toString('base64')
    // @ts-ignore
    .toString('utf-8');

  return encStr;
};

exports.decryptData = async (data) => {
  const privateKey = fs.readFileSync('src/cryptoKeys/RSAprivateKey.pem');
  const decStr = crypto
    .privateDecrypt(
      {
        key: privateKey,
        ...privateKeyOptions,
        ...cryptOptions,
      },
      Buffer.from(data.toString('base64'), 'base64')
    )
    .toString('utf-8');

  return decStr;
};

// !! 패스워드 암호화 메소드 생성해야함 220126
exports.hashData = async (data) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const key = crypto
    .pbkdf2Sync(data.toString('base64'), salt, 100000, 64, 'sha256')
    .toString('base64')
    .toString('utf-8');
  salt.toString('utf-8');
  return { key, salt };
};

exports.encryptDataSync = (data) => {
  const publicKey = fs.readFileSync('src/cryptoKeys/RSApublicKey.pem');
  const encStr = crypto
    .publicEncrypt({ key: publicKey, ...cryptOptions }, Buffer.from(data))
    .toString('base64')
    // @ts-ignore
    .toString('utf-8');

  return encStr;
};

exports.decryptDataSync = (data) => {
  const privateKey = fs.readFileSync('src/cryptoKeys/RSAprivateKey.pem');
  const decStr = crypto
    .privateDecrypt(
      {
        key: privateKey,
        ...privateKeyOptions,
        ...cryptOptions,
      },
      Buffer.from(data.toString('base64'), 'base64')
    )
    .toString('utf-8');

  return decStr;
};

// !! 패스워드 암호화 메소드 생성해야함 220126
exports.hashDataSync = (data) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const key = crypto
    .pbkdf2Sync(data.toString('base64'), salt, 100000, 64, 'sha256')
    .toString('base64')
    .toString('utf-8');
  salt.toString('utf-8');
  return { key, salt };
};
