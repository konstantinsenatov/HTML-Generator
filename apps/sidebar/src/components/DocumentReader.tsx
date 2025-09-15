import React from 'react'

interface DocumentReaderProps {
  content: string
  onRefresh: () => void
  isLoading: boolean
}

const DocumentReader: React.FC<DocumentReaderProps> = ({ 
  content, 
  onRefresh, 
  isLoading 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Документ Word</h3>
          <button 
            className={`btn btn-primary btn-sm ${isLoading ? 'loading' : ''}`}
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Обновление...
              </>
            ) : (
              'Обновить'
            )}
          </button>
        </div>
      </div>
      <div className="card-body">
        {content ? (
          <div className="document-content">
            <h5>Содержимое документа:</h5>
            <div className="content-preview">
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '12px', 
                maxHeight: '200px', 
                overflow: 'auto',
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                {content}
              </pre>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Строк: {content.split('\n').length} | 
                Символов: {content.length}
              </small>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>Нажмите "Обновить" для чтения документа</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentReader
