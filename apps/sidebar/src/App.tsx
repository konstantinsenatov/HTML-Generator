import React, { useState, useEffect } from 'react'
import { OfficeContext } from './hooks/useOffice'
import DocumentReader from './components/DocumentReader'
import PreviewPanel from './components/PreviewPanel'
import ActionButtons from './components/ActionButtons'
import StatusBar from './components/StatusBar'
import './App.css'

function App() {
  const [isOfficeReady, setIsOfficeReady] = useState(false)
  const [documentContent, setDocumentContent] = useState('')
  const [previewHTML, setPreviewHTML] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Инициализация Office.js
    const initOffice = async () => {
      try {
        // Ждем загрузки Office.js
        await new Promise<void>((resolve) => {
          if (window.Office) {
            resolve()
          } else {
            const checkOffice = () => {
              if (window.Office) {
                resolve()
              } else {
                setTimeout(checkOffice, 100)
              }
            }
            checkOffice()
          }
        })

        // Инициализируем Office.js
        Office.onReady(() => {
          setIsOfficeReady(true)
          console.log('Office.js готов к работе')
        })
      } catch (err) {
        console.error('Ошибка инициализации Office.js:', err)
        setError('Не удалось инициализировать Office.js')
      }
    }

    initOffice()
  }, [])

  const handleRefresh = async () => {
    if (!isOfficeReady) return

    setIsLoading(true)
    setError(null)

    try {
      // Читаем содержимое документа
      const content = await readDocumentContent()
      setDocumentContent(content)
      
      // Генерируем HTML превью
      const html = await generatePreview(content)
      setPreviewHTML(html)
      
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Ошибка обновления:', err)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const readDocumentContent = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      Word.run(async (context) => {
        try {
          const body = context.document.body
          const paragraphs = body.paragraphs
          paragraphs.load('text')
          
          await context.sync()
          
          let content = ''
          for (const paragraph of paragraphs.items) {
            if (paragraph.text.trim()) {
              content += paragraph.text + '\n'
            }
          }
          
          resolve(content)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  const generatePreview = async (content: string): Promise<string> => {
    // Здесь будет использоваться парсер Bot HTML
    // Пока возвращаем простой HTML
    return `
      <div class="bot-container">
        <h1>Превью документа</h1>
        <div class="bot-content">
          ${content.split('\n').map(line => 
            line.trim() ? `<p>${line}</p>` : ''
          ).join('')}
        </div>
      </div>
    `
  }

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(previewHTML).then(() => {
      console.log('HTML скопирован в буфер обмена')
    }).catch(err => {
      console.error('Ошибка копирования:', err)
      setError('Не удалось скопировать HTML')
    })
  }

  const handleCopyHTMLWithCSS = () => {
    const htmlWithCSS = `
<style>
${getBotCSS()}
</style>
${previewHTML}
    `
    
    navigator.clipboard.writeText(htmlWithCSS).then(() => {
      console.log('HTML с CSS скопирован в буфер обмена')
    }).catch(err => {
      console.error('Ошибка копирования:', err)
      setError('Не удалось скопировать HTML с CSS')
    })
  }

  const handleOpenPreview = () => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bot HTML Preview</title>
          <style>
            ${getBotCSS()}
          </style>
        </head>
        <body>
          ${previewHTML}
        </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const handleSavePDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bot HTML PDF</title>
          <style>
            ${getBotCSS()}
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            @page {
              margin: 1in;
              size: A4;
            }
          </style>
        </head>
        <body>
          ${previewHTML}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Простая функция для получения CSS (временно)
  const getBotCSS = () => {
    return `
      .bot-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
      .bot-content p { margin-bottom: 10px; line-height: 1.6; }
      h1 { color: #333; margin-bottom: 20px; }
    `
  }

  if (!isOfficeReady) {
    return (
      <div className="ms-TaskPane">
        <div className="ms-TaskPane-content">
          <div className="card">
            <div className="card-body text-center">
              <div className="spinner mb-3"></div>
              <p>Инициализация Office.js...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <OfficeContext.Provider value={{ isOfficeReady, isLoading, error }}>
      <div className="ms-TaskPane">
        <div className="ms-TaskPane-content">
          <DocumentReader 
            content={documentContent}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="error">
              {error}
            </div>
          )}
          
          <PreviewPanel 
            html={previewHTML}
            isLoading={isLoading}
          />
          
          <ActionButtons
            onCopyHTML={handleCopyHTML}
            onCopyHTMLWithCSS={handleCopyHTMLWithCSS}
            onOpenPreview={handleOpenPreview}
            onSavePDF={handleSavePDF}
            disabled={!previewHTML || isLoading}
          />
          
          <StatusBar 
            lastUpdate={lastUpdate}
            isLoading={isLoading}
          />
        </div>
      </div>
    </OfficeContext.Provider>
  )
}

export default App
