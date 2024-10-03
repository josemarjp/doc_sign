import { generateKeyPair, signMessage } from "./services/signature/signature"

async function main() {
    try {
  
      const { privateKey, publicKey } = await generateKeyPair();
      console.log("Chaves geradas com sucesso!");
      
   
      const message = "Este é um documento importante que precisa ser assinado.";
  
      const signature = signMessage(privateKey, message);
      console.log("Mensagem assinada com sucesso!");
      console.log(`Assinatura: ${signature}`);
  
    } catch (error) {
      console.error("Erro ao executar o script:", error);
    }
  }
  
  main();