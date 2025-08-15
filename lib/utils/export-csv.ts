export function exportToCSV(data: any[], filename: string = 'export.csv') {
  if (!data || data.length === 0) {
    alert('エクスポートするデータがありません')
    return
  }

  // ヘッダー行を作成
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')

  // データ行を作成
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // カンマや改行を含む値は引用符で囲む
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value ?? ''
    }).join(',')
  })

  // CSVコンテンツを結合
  const csvContent = [csvHeaders, ...csvRows].join('\n')

  // BOMを追加（Excelで開いた時の文字化け対策）
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })

  // ダウンロードリンクを作成
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}