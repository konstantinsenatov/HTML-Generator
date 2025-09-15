import React from 'react'

interface ActionButtonsProps {
  onCopyHTML: () => void
  onCopyHTMLWithCSS: () => void
  onOpenPreview: () => void
  onSavePDF: () => void
  disabled: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopyHTML,
  onCopyHTMLWithCSS,
  onOpenPreview,
  onSavePDF,
  disabled
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">Действия</h3>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-2">
          <button 
            className="btn btn-outline"
            onClick={onCopyHTML}
            disabled={disabled}
            title="Копировать HTML без стилей"
          >
            📋 Копировать HTML
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={onCopyHTMLWithCSS}
            disabled={disabled}
            title="Копировать HTML с встроенными стилями"
          >
            🎨 Копировать HTML+CSS
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={onOpenPreview}
            disabled={disabled}
            title="Открыть полное превью в новой вкладке"
          >
            👁️ Открыть превью
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={onSavePDF}
            disabled={disabled}
            title="Сохранить как PDF"
          >
            📄 Сохранить PDF
          </button>
        </div>
        
        <div className="mt-3">
          <small className="text-muted">
            <strong>Советы:</strong><br/>
            • HTML - для встраивания в сайты<br/>
            • HTML+CSS - переносится "как есть"<br/>
            • Превью - для проверки результата<br/>
            • PDF - для печати и сохранения
          </small>
        </div>
      </div>
    </div>
  )
}

export default ActionButtons
