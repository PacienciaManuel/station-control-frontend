import CryptoJS from 'crypto-js';

const SECRET = process.env.SECRET!;

class CryptoManager {
    
    encrypt(text: string) {
        return CryptoJS.AES.encrypt(text, SECRET).toString();
    }

    decrypt(encoded: string) {
        try {
            return CryptoJS.AES.decrypt(encoded, SECRET).toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return null;
        }
    }
}

const cryptoManager = new CryptoManager();

export default cryptoManager;