import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = '#007bff' 
}) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const loaderStyle: React.CSSProperties = {
    border: `3px solid #f3f3f3`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    width: sizeMap[size],
    height: sizeMap[size],
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  };

  return (
    <div style={loaderStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
