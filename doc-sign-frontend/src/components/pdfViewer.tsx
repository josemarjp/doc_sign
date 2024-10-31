import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.mjs";


interface Location {
    x: number;
    y: number;
}

interface PDFViewerProps {
    pdfUrl: string;
    name: string | null; 
    email: string | null; 
    onSignatureLocationSelected: (location: { x: number; y: number }) => void;
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;  
}


const PDFViewer: React.FC<PDFViewerProps> = ({ onSignatureLocationSelected, onDragEnd }) => {
    const { pdfId, name, email } = useParams<{ pdfId: string; name: string; email: string }>();

    const [pdfUrl, setPdfUrl] = useState<string>('');

    useEffect(() => {
        if (pdfId) {
            setPdfUrl(`/pdfs/${pdfId}.pdf`); 
        }
    }, [pdfId]);
    
    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        onDragEnd(event); 
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            <Document file={pdfUrl}>
                <Page pageNumber={1} width={600} />
            </Document>
            <div
                draggable
                onDragEnd={handleDragEnd}
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    width: '200px',
                    height: '60px',
                    backgroundColor: 'yellow',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid black',
                    borderRadius: '5px',
                }}
                >
                <div>
                    <strong>Assinado por:</strong> {name}<br />
                    <strong>Email:</strong> {email}
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
