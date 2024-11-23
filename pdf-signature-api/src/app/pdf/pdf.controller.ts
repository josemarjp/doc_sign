import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    Body,
    Res,
    Query,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import { PdfService } from './pdf.service';
  import { SignPdfDto } from './dto/sign-pdf.dto';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { v4 as uuidv4 } from 'uuid';
  
  @Controller('api/v1/pdf')
  export class PdfController {
    constructor(private readonly pdfService: PdfService) {}
  
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('pdf', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = uuidv4();
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(pdf)$/)) {
            return callback(new Error('Only PDF files are allowed!'), false);
          }
          callback(null, true);
        },
      }),
    )
    async uploadPdf(@UploadedFile() file: Express.Multer.File) {
      return {
        id: file.filename,
      };
    }
  
    @Get('view/:filename')
    async viewPdf(
      @Param('filename') filename: string,
      @Query('name') name: string,
      @Query('email') email: string,
      @Res() res: Response,
    ) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sign PDF</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
            <style>
              body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                  min-height: 100vh;
                  overflow-y: auto;
              }
              
              .container {
                  max-width: 1200px;
                  margin: 0 auto;
                  padding: 20px;
              }
              
              .pdf-container {
                  background: white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  overflow: hidden;
                  margin-bottom: 20px;
              }
              
              .page-container {
                  position: relative;
                  margin-bottom: 20px;
              }
              
              canvas {
                  width: 100%;
                  height: auto;
                  display: block;
              }
              
              .signature-box {
                  position: absolute;
                  width: 220px;
                  background: rgba(248, 249, 250, 0.9);
                  border: 2px solid #007bff;
                  border-radius: 4px;
                  padding: 10px 15px;
                  cursor: move;
                  user-select: none;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  z-index: 1000;
                  display: none;
              }
              
              .signature-box p {
                  margin: 5px 0;
                  color: #495057;
                  font-size: 14px;
              }
              
              .signature-box .signature-title {
                  font-weight: bold;
                  color: #212529;
                  margin-bottom: 8px;
                  font-size: 16px;
              }
              
              .toolbar {
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  display: flex;
                  gap: 10px;
                  z-index: 1000;
              }
              
              .button {
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                  transition: background-color 0.3s;
              }
              
              .button:hover {
                  background: #0056b3;
              }
              
              .button.secondary {
                  background: #6c757d;
              }
              
              .button.secondary:hover {
                  background: #545b62;
              }
  
              .page-number {
                  position: absolute;
                  bottom: 10px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(0, 0, 0, 0.5);
                  color: white;
                  padding: 5px 10px;
                  border-radius: 4px;
                  font-size: 12px;
              }
  
              .loading {
                  text-align: center;
                  padding: 20px;
                  font-size: 16px;
                  color: #666;
              }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="pdf-container" id="pdfContainer"></div>
            </div>
  
            <div class="signature-box" id="signatureBox">
                <p class="signature-title">Assinatura Digital</p>
                <p>Nome: ${name}</p>
                <p>Email: ${email}</p>
            </div>
            
            <div class="toolbar">
                <button class="button secondary" id="addSignature">Adicionar Assinatura</button>
                <button class="button" id="signButton" style="display: none;">Assinar Documento</button>
            </div>
  
            <script>
              // Configuração inicial do PDF.js
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
              // Variáveis globais
              let currentSignatureBox = null;
              let pdfDoc = null;
              let currentPage = 1;
              let pageCount = 0;
              let selectedPage = null;
              let scale = 1.5;
  
              async function initPDF() {
                  try {
                      // Carregar o PDF
                      const loadingTask = pdfjsLib.getDocument('/uploads/${filename}');
                      pdfDoc = await loadingTask.promise;
                      pageCount = pdfDoc.numPages;
  
                      // Renderizar todas as páginas
                      const container = document.getElementById('pdfContainer');
                      container.innerHTML = ''; // Limpar container
  
                      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
                          await renderPage(pageNum);
                      }
                  } catch (error) {
                      console.error('Erro ao carregar o PDF:', error);
                      alert('Erro ao carregar o PDF. Por favor, tente novamente.');
                  }
              }
  
              async function renderPage(pageNum) {
                  const page = await pdfDoc.getPage(pageNum);
                  const viewport = page.getViewport({ scale });
  
                  // Criar container para a página
                  const pageContainer = document.createElement('div');
                  pageContainer.className = 'page-container';
                  pageContainer.setAttribute('data-page', pageNum);
  
                  // Criar canvas
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
  
                  // Adicionar número da página
                  const pageNumber = document.createElement('div');
                  pageNumber.className = 'page-number';
                  pageNumber.textContent = 'Página ' + pageNum + ' de ' + pageCount;
  
                  pageContainer.appendChild(canvas);
                  pageContainer.appendChild(pageNumber);
                  document.getElementById('pdfContainer').appendChild(pageContainer);
  
                  // Renderizar PDF no canvas
                  const renderContext = {
                      canvasContext: context,
                      viewport: viewport
                  };
                  await page.render(renderContext);
              }
  
              // Inicialização do PDF
              initPDF();
  
              // Configuração dos botões e eventos
              const addSignatureButton = document.getElementById('addSignature');
              const signButton = document.getElementById('signButton');
              const signatureBox = document.getElementById('signatureBox');
  
              addSignatureButton.addEventListener('click', () => {
                  if (currentSignatureBox) {
                      currentSignatureBox.remove();
                      signButton.style.display = 'none';
                      addSignatureButton.textContent = 'Adicionar Assinatura';
                  } else {
                      addSignatureButton.textContent = 'Cancelar';
                      signButton.style.display = 'inline-block';
                      initializeSignatureBox();
                  }
              });
  
              function initializeSignatureBox() {
                  const newSignatureBox = signatureBox.cloneNode(true);
                  newSignatureBox.style.display = 'block';
                  currentSignatureBox = newSignatureBox;
  
                  // Adicionar eventos de arrastar
                  let isDragging = false;
                  let currentX;
                  let currentY;
                  let initialX;
                  let initialY;
  
                  newSignatureBox.addEventListener('mousedown', dragStart);
                  document.addEventListener('mousemove', drag);
                  document.addEventListener('mouseup', dragEnd);
  
                  function dragStart(e) {
                      initialX = e.clientX - newSignatureBox.offsetLeft;
                      initialY = e.clientY - newSignatureBox.offsetTop;
                      
                      if (e.target === newSignatureBox || e.target.parentNode === newSignatureBox) {
                          isDragging = true;
                      }
                  }
  
                  function drag(e) {
                      if (isDragging) {
                          e.preventDefault();
                          
                          currentX = e.clientX - initialX;
                          currentY = e.clientY - initialY;
  
                          // Encontrar a página atual baseado na posição Y
                          const pages = document.querySelectorAll('.page-container');
                          let foundPage = null;
                          
                          pages.forEach(page => {
                              const rect = page.getBoundingClientRect();
                              if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                                  foundPage = page;
                              }
                          });
  
                          if (foundPage) {
                              selectedPage = parseInt(foundPage.getAttribute('data-page'));
                              const pageRect = foundPage.getBoundingClientRect();
                              
                              // Limitar movimento dentro da página
                              currentX = Math.max(pageRect.left, Math.min(currentX, pageRect.right - newSignatureBox.offsetWidth));
                              currentY = Math.max(pageRect.top, Math.min(currentY, pageRect.bottom - newSignatureBox.offsetHeight));
                              
                              newSignatureBox.style.left = currentX + 'px';
                              newSignatureBox.style.top = currentY + 'px';
                          }
                      }
                  }
  
                  function dragEnd() {
                      initialX = currentX;
                      initialY = currentY;
                      isDragging = false;
                  }
  
                  document.body.appendChild(newSignatureBox);
              }
  
              signButton.addEventListener('click', async () => {
                if (!currentSignatureBox || !selectedPage) {
                    alert('Por favor, posicione a assinatura em uma página do documento.');
                    return;
                }

                // Correção aqui
                const pageContainer = document.querySelector('[data-page="' + selectedPage + '"]')
                const pageRect = pageContainer.getBoundingClientRect();
                const signatureRect = currentSignatureBox.getBoundingClientRect();

                // Validar os valores antes de enviar
                const x = (signatureRect.left - pageRect.left) / scale;
                const y = (signatureRect.top - pageRect.top) / scale;
                const page = selectedPage;

                // Verificar se os valores são números válidos
                if (isNaN(x) || isNaN(y) || isNaN(page)) {
                    alert('Erro ao calcular a posição da assinatura. Por favor, tente novamente.');
                    return;
                }

                const requestData = {
                    filename: '${filename}',
                    name: '${name}',
                    email: '${email}',
                    position: {
                        x: Number(x),
                        y: Number(y),
                        page: Number(page)
                    }
                };

                console.log('Dados enviados:', requestData); // Debug

                try {
                    const response = await fetch('/api/v1/pdf/sign', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erro na resposta do servidor');
                    }

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "documento_assinado.pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);

                } catch (error) {
                    console.error('Erro detalhado:', error);
                    alert('Erro ao assinar o documento: ' + error.message);
                }
            });
            </script>
        </body>
        </html>
      `;
      
      res.send(htmlContent);
    }
  
    @Post('sign')
    async signPdf(@Body() signPdfDto: SignPdfDto, @Res() res: Response) {
        try {
            console.log('Dados recebidos:', signPdfDto); 

            if (!signPdfDto.filename || !signPdfDto.name || !signPdfDto.email) {
                return res.status(400).json({
                    message: 'Dados incompletos',
                    details: 'Filename, name e email são obrigatórios'
                });
            }

            if (!signPdfDto.position || typeof signPdfDto.position !== 'object') {
                return res.status(400).json({
                    message: 'Posição inválida',
                    details: 'O objeto position é obrigatório'
                });
            }

            const { x, y, page } = signPdfDto.position;
            if (typeof x !== 'number' || typeof y !== 'number' || typeof page !== 'number') {
                return res.status(400).json({
                    message: 'Formato de posição inválido',
                    details: 'x, y e page devem ser números'
                });
            }

            const signedPdfBuffer = await this.pdfService.signPdf(signPdfDto);
            
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=signed_document.pdf',
            });
            
            res.send(signedPdfBuffer);
        } catch (error) {
            console.error('Erro ao processar assinatura:', error);
            res.status(500).json({
                message: 'Erro ao assinar o documento',
                error: error.message,
                details: error.stack
            });
        }
    }
}