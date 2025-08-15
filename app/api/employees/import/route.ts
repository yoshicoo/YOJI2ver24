import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// CSVデータをパース
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    
    headers.forEach((header, index) => {
      const value = values[index]
      
      // ヘッダー名を英語フィールド名にマッピング
      const fieldMap: { [key: string]: string } = {
        '社員番号': 'employee_number',
        '氏名': 'name',
        'ふりがな': 'name_kana',
        '性別': 'gender',
        '年齢': 'age',
        '採用区分': 'recruitment_type',
        '雇用形態': 'employment_type',
        'ロール': 'role',
        '部署': 'department',
        '入社日': 'join_date',
        '採用コスト': 'recruitment_cost',
        '応募経路': 'application_source'
      }
      
      const fieldName = fieldMap[header] || header
      
      // 数値フィールドの変換
      if (['age', 'recruitment_cost'].includes(fieldName) && value) {
        row[fieldName] = parseInt(value.replace(/[^0-9]/g, ''))
      }
      // 日付フィールドの変換
      else if (fieldName === 'join_date' && value) {
        // YYYY/MM/DD or YYYY-MM-DD形式をサポート
        row[fieldName] = value.replace(/\//g, '-')
      }
      // 採用区分のマッピング
      else if (fieldName === 'recruitment_type') {
        const typeMap: { [key: string]: string } = {
          '新卒': 'new_graduate',
          '中途': 'mid_career',
          '契約': 'contract',
          'パート': 'part_time',
          'インターン': 'intern'
        }
        row[fieldName] = typeMap[value] || value
      }
      // 雇用形態のマッピング
      else if (fieldName === 'employment_type') {
        const typeMap: { [key: string]: string } = {
          '正社員': 'full_time',
          '契約社員': 'contract',
          'パート': 'part_time',
          '派遣': 'temporary',
          'インターン': 'intern'
        }
        row[fieldName] = typeMap[value] || value
      }
      else {
        row[fieldName] = value || null
      }
    })
    
    data.push(row)
  }
  
  return data
}

// 従業員データのインポート
export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }
    
    const text = await file.text()
    const employees = parseCSV(text)
    
    if (employees.length === 0) {
      return NextResponse.json({ error: 'インポート可能なデータがありません' }, { status: 400 })
    }
    
    // データの検証
    const errors = []
    const validEmployees = []
    
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i]
      const rowNum = i + 2 // ヘッダー行を考慮
      
      // 必須フィールドのチェック
      if (!emp.name) {
        errors.push(`行${rowNum}: 氏名は必須です`)
        continue
      }
      
      // 採用区分の検証
      if (emp.recruitment_type && !['new_graduate', 'mid_career', 'contract', 'part_time', 'intern'].includes(emp.recruitment_type)) {
        errors.push(`行${rowNum}: 採用区分が不正です`)
        continue
      }
      
      // 雇用形態の検証
      if (emp.employment_type && !['full_time', 'contract', 'part_time', 'temporary', 'intern'].includes(emp.employment_type)) {
        errors.push(`行${rowNum}: 雇用形態が不正です`)
        continue
      }
      
      // 作成者情報を追加
      emp.created_by = user.id
      emp.created_at = new Date().toISOString()
      emp.updated_at = new Date().toISOString()
      
      validEmployees.push(emp)
    }
    
    if (validEmployees.length === 0) {
      return NextResponse.json({ 
        error: 'インポート可能なデータがありません',
        details: errors
      }, { status: 400 })
    }
    
    // データベースに保存
    const { data, error } = await supabase
      .from('employees')
      .insert(validEmployees)
      .select()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data,
      success: true,
      imported: data.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${data.length}件のデータをインポートしました${errors.length > 0 ? `（${errors.length}件のエラー）` : ''}`
    })
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: 'ファイルの処理中にエラーが発生しました' 
    }, { status: 500 })
  }
}