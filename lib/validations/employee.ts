export interface EmployeeFormData {
  name: string
  name_kana?: string
  employee_number?: string
  gender?: string
  age?: number
  recruitment_type: string
  employment_type: string
  department: string
  role?: string
  join_date: string
  recruitment_cost?: number
  application_source?: string
}

export function validateEmployee(data: Partial<EmployeeFormData>): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // 必須項目のチェック
  if (!data.name?.trim()) {
    errors.name = '氏名は必須です'
  }

  if (!data.recruitment_type) {
    errors.recruitment_type = '採用区分は必須です'
  }

  if (!data.employment_type) {
    errors.employment_type = '雇用形態は必須です'
  }

  if (!data.department?.trim()) {
    errors.department = '部署は必須です'
  }

  if (!data.join_date) {
    errors.join_date = '入社日は必須です'
  }

  // 年齢の範囲チェック
  if (data.age !== undefined && (data.age < 18 || data.age > 100)) {
    errors.age = '年齢は18〜100の範囲で入力してください'
  }

  // 採用コストの範囲チェック
  if (data.recruitment_cost !== undefined && data.recruitment_cost < 0) {
    errors.recruitment_cost = '採用コストは0以上で入力してください'
  }

  // メールアドレス形式チェック（もしあれば）
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // if (data.email && !emailRegex.test(data.email)) {
  //   errors.email = 'メールアドレスの形式が正しくありません'
  // }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}