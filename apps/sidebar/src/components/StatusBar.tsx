import React from 'react'

interface StatusBarProps {
  lastUpdate: Date | null
  isLoading: boolean
}

const StatusBar: React.FC<StatusBarProps> = ({ lastUpdate, isLoading }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="status-info">
            {isLoading ? (
              <span className="text-primary">
                <span className="spinner" style={{ width: '12px', height: '12px' }}></span>
                Обработка...
              </span>
            ) : lastUpdate ? (
              <span className="text-success">
                ✓ Обновлено: {formatTime(lastUpdate)}
              </span>
            ) : (
              <span className="text-muted">
                Готов к работе
              </span>
            )}
          </div>
          
          <div className="status-actions">
            <small className="text-muted">
              Bot HTML v1.0.0
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusBar
