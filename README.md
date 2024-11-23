# Assinatura Eletrônica Simples

Este repositório implementa uma API para um sistema de **assinatura eletrônica simples**, utilizando criptografia baseada em _private key_ para garantir a segurança. O projeto permite o upload de arquivos PDF, visualização do conteúdo, seleção de locais para assinatura através de arraste e, por fim, a assinatura do documento.

## 🚀 Funcionalidades

1. **Upload de Arquivo PDF**  
   Envie arquivos PDF para serem processados e armazenados.

2. **Visualizar Arquivo**  
   Exiba o arquivo PDF enviado diretamente na interface.

3. **Arrastar e Soltar Assinatura**  
   Use um sistema de _drag and drop_ para selecionar a posição da assinatura no documento.

4. **Assinar Documento**  
   Realize a assinatura eletrônica utilizando uma chave privada (_private key_) gerenciada pelo sistema.

5. **Gerenciamento de Arquivos e Assinaturas**  
   Registre o ID da assinatura e os metadados em uma base de dados para consultas futuras.

## 🛠️ Tecnologias Utilizadas

### Backend
- Framework: [NestJS](https://nestjs.com/)
- Linguagem: TypeScript
- Criptografia: Node.js Crypto API
- Armazenamento de Arquivos: Sistema de diretórios local
