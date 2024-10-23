import React, { useState } from 'react';
import PDFViewer from './components/pdfViewer';
import SignatureDraggable from './components/signatureDrag';

interface Location {
    x: number;
    y: number;
}

const App: React.FC = () => {
    const [signatureLocation, setSignatureLocation] = useState<Location | null>(null);

    const handleSignatureLocationSelected = (location: Location) => {
        console.log("Local da assinatura selecionado:", location);
        setSignatureLocation(location);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
      console.log('Arraste finalizado:', event);
    };

    return (
      <div>
           <h1>Selecione o Local da Assinatura</h1>
              <PDFViewer
                  pdfUrl="/pdfs/teste.pdf" 
                  onSignatureLocationSelected={handleSignatureLocationSelected}
                  onDragEnd={handleDragEnd}
              />
              {signatureLocation && (
      <div>
          <h2>Local Selecionado:</h2>
          <p>X: {signatureLocation.x}, Y: {signatureLocation.y}</p>
      </div>
      )}
  </div>
    );
};

export default App;
