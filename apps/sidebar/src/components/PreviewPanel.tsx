import React, { useState } from 'react'

interface PreviewPanelProps {
  html: string
  isLoading: boolean
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ html, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview')

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Превью HTML</h3>
          <div className="btn-group btn-group-sm">
            <button 
              className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('preview')}
            >
              Превью
            </button>
            <button 
              className={`btn ${activeTab === 'html' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('html')}
            >
              HTML
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner mb-3"></div>
            <p>Генерация превью...</p>
          </div>
        ) : html ? (
          <>
            {activeTab === 'preview' ? (
              <div className="preview-container">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html lang="ru">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                        .bot-container { max-width: 100%; }
                        .bot-content p { margin-bottom: 10px; line-height: 1.6; }
                        h1 { color: #333; margin-bottom: 20px; }
                        h2 { color: #555; margin-bottom: 15px; }
                        h3 { color: #666; margin-bottom: 10px; }
                        img { max-width: 100%; height: auto; }
                        .bot-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                        .bot-btn { display: inline-block; padding: 8px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 4px; }
                        .bot-btn:hover { background-color: #0056b3; }
                      </style>
                    </head>
                    <body>
                      ${html}
                    </body>
                    </html>
                  `}
                  style={{
                    width: '100%',
                    height: '400px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    backgroundColor: '#fff'
                  }}
                  title="HTML Preview"
                />
              </div>
            ) : (
              <div className="html-container">
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '12px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  backgroundColor: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  margin: 0
                }}>
                  {html}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted">
            <p>Превью будет доступно после чтения документа</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewPanel
