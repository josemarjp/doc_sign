import React, { useEffect, useState } from 'react';
import PDFViewer from './components/pdfViewer';
import { useParams } from 'react-router-dom';

interface Location {
    x: number;
    y: number;
}

const App: React.FC = () => {
    const { pdfId, name, email } = useParams<{ pdfId: string; name: string; email: string }>();
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
                pdfUrl={`/pdfs/${pdfId}.pdf`}
                name={name || 'nome'}
                email={email || 'email'}
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
