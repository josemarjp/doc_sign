import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
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
    onSignatureLocationSelected: (location: { x: number; y: number }) => void;
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void; 
}


const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onSignatureLocationSelected, onDragEnd }) => {
    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        onDragEnd(event); 
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            <Document file={pdfUrl}>
                <Page pageNumber={1} width={600} />
            </Document>
            {/* Elemento arrastável para a assinatura */}
            <div
                draggable
                onDragEnd={handleDragEnd}
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    width: '100px',
                    height: '40px',
                    backgroundColor: 'yellow',
                    cursor: 'move',
                }}
            >
                Arraste para assinar
            </div>
        </div>
    );
};

export default PDFViewer;
