import React from 'react';

interface SignatureDraggableProps {
    onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  }
  
  const SignatureDraggable: React.FC<SignatureDraggableProps> = ({ onDragEnd }) => {
  
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'signature' }));
    };
  
    return (
         <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            style={{
            width: '300px',
            height: '500px',
            backgroundColor: '#FFD700',
            textAlign: 'center',
            lineHeight: '500px',
            cursor: 'grab',
            borderRadius: '50px'
            }}
        >
        Assinatura
        </div>
    );
};

export default SignatureDraggable;
