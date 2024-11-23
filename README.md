Assinatura Eletrônica Simples
Este repositório implementa uma API e uma interface para um sistema de assinatura eletrônica simples, utilizando criptografia baseada em private key para garantir a segurança. O projeto permite o upload de arquivos PDF, visualização do conteúdo, seleção de locais para assinatura através de arraste e, por fim, a assinatura do documento.

🚀 Funcionalidades
Upload de Arquivo PDF
Envie arquivos PDF para serem processados e armazenados.

Visualizar Arquivo
Exiba o arquivo PDF enviado diretamente na interface.

Arrastar e Soltar Assinatura
Use um sistema de drag and drop para selecionar a posição da assinatura no documento.

Assinar Documento
Realize a assinatura eletrônica utilizando uma chave privada (private key) gerenciada pelo sistema.

Gerenciamento de Arquivos e Assinaturas
Registre o ID da assinatura e os metadados em uma base de dados para consultas futuras.

🛠️ Tecnologias Utilizadas
Backend:

Framework: NestJS
Linguagem: TypeScript
Criptografia: Node.js Crypto API
Armazenamento de Arquivos: Sistema de diretórios local
Banco de Dados: PostgreSQL (ou sua escolha, configurável)
