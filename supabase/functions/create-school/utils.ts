
export async function generateSecurePassword(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function generateUniqueSubscriptionId(supabaseClient: any): Promise<string> {
  let counter = 1
  while (counter <= 9999) {
    const newId = 'SCH' + counter.toString().padStart(4, '0')
    const { data } = await supabaseClient
      .from('schools')
      .select('subscription_id')
      .eq('subscription_id', newId)
      .maybeSingle()
    
    if (!data) {
      return newId
    }
    counter++
  }
  throw new Error('لم نتمكن من توليد رقم اشتراك فريد')
}

export async function generateCredentials(supabaseClient: any, school_name: string, subscription_months: number) {
  // استخدام دالة قاعدة البيانات لإنشاء بريد إلكتروني صالح
  const { data: emailData, error: emailError } = await supabaseClient.rpc('generate_random_email')
  
  if (emailError) {
    console.error('Database function error:', emailError)
    // في حالة فشل دالة قاعدة البيانات، استخدم طريقة بديلة
    const randomPart = Math.random().toString(36).substring(2, 10)
    const email = `school_${randomPart}@schoolsystem.com`
    const password = await generateSecurePassword()
    
    const subscriptionEnd = new Date()
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + subscription_months)
    const subscriptionEndDate = subscriptionEnd.toISOString().split('T')[0]

    return { email, password, subscriptionEndDate }
  }
  
  const email = emailData
  const password = await generateSecurePassword()
  
  const subscriptionEnd = new Date()
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + subscription_months)
  const subscriptionEndDate = subscriptionEnd.toISOString().split('T')[0]

  return { email, password, subscriptionEndDate }
}
