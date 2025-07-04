import { generateCredentials, generateUniqueSubscriptionId } from './utils.ts'
import { SchoolCreationRequest, GeneratedCredentials } from './types.ts'

export class SchoolCreator {
  private supabaseClient: any

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient
  }

  async createSchool(requestData: SchoolCreationRequest) {
    const { school_name, phone, subscription_months } = requestData
    
    // Validate input
    if (!school_name || !subscription_months) {
      throw new Error('اسم المدرسة وفترة الاشتراك مطلوبان')
    }

    // Generate credentials and subscription ID using database functions
    const { email, password, subscriptionEndDate } = await generateCredentials(this.supabaseClient, school_name, subscription_months)
    const subscriptionId = await generateUniqueSubscriptionId(this.supabaseClient)

    console.log('Generated credentials:', { email, subscriptionId, subscriptionEndDate })

    let authUserId: string | null = null

    try {
      // Step 1: Create auth user - trigger will create profile with NULL school_id
      authUserId = await this.createAuthUser(email, password, school_name)
      
      // Step 2: Create school record using auth user ID
      const schoolData = await this.createSchoolRecord(authUserId, school_name, email, phone, subscriptionId, subscriptionEndDate)
      
      // Step 3: Update profile with correct school_id now that school exists
      await this.updateProfileWithSchoolId(authUserId)
      
      // Step 4: Create default school settings
      await this.createSchoolSettings(authUserId, school_name)

      return {
        success: true,
        school: schoolData,
        credentials: { email, password, subscription_id: subscriptionId },  
        message: 'تم إنشاء المدرسة بنجاح'
      }

    } catch (error) {
      await this.rollback(authUserId)
      throw error
    }
  }

  private async createAuthUser(email: string, password: string, school_name: string): Promise<string> {
    console.log('Creating auth user...')
    
    // Create user - the trigger will now handle profile creation safely
    const { data: authData, error: authError } = await this.supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'school',
        school_name: school_name,
        full_name: school_name
      }
    })

    if (authError) {
      console.error('Auth user creation failed:', authError)
      throw new Error(`فشل في إنشاء حساب المستخدم: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('لم يتم إنشاء المستخدم بشكل صحيح')
    }

    console.log('Auth user created successfully:', authData.user.id)
    return authData.user.id
  }

  private async createSchoolRecord(authUserId: string, school_name: string, email: string, phone: string | undefined, subscriptionId: string, subscriptionEndDate: string) {
    console.log('Creating school record...')
    
    const { data: schoolData, error: schoolError } = await this.supabaseClient
      .from('schools')
      .insert([{
        id: authUserId, // Use auth user ID as school ID
        subscription_id: subscriptionId,
        school_name,
        email,
        phone: phone || null,
        status: 'active',
        subscription_end: subscriptionEndDate,
        students_count: 0
      }])
      .select()
      .single()

    if (schoolError) {
      console.error('School creation failed:', schoolError)
      throw new Error(`فشل في إنشاء سجل المدرسة: ${schoolError.message}`)
    }

    console.log('School record created successfully:', schoolData)
    return schoolData
  }

  private async updateProfileWithSchoolId(authUserId: string) {
    console.log('Updating profile with school_id...')
    
    // Update the profile with the correct school_id
    const { error: profileUpdateError } = await this.supabaseClient
      .from('profiles')
      .update({ 
        school_id: authUserId
      })
      .eq('id', authUserId)

    if (profileUpdateError) {
      console.error('Profile update failed:', profileUpdateError)
      throw new Error(`فشل في تحديث الملف الشخصي: ${profileUpdateError.message}`)
    }

    console.log('Profile updated with school_id successfully')
  }

  private async createSchoolSettings(authUserId: string, school_name: string) {
    console.log('Creating school settings...')
    const defaultStages = [
      {
        id: 'kindergarten',
        name: 'مرحلة الروضة',
        enabled: false,
        grades: [
          { id: 'grade_kg1', name: 'الأول', sections: ['أ'] },
          { id: 'grade_kg2', name: 'الثاني', sections: ['أ'] },
          { id: 'grade_prep', name: 'التمهيدي', sections: ['أ'] }
        ]
      },
      {
        id: 'elementary',
        name: 'المرحلة الابتدائية',
        enabled: true,
        grades: [
          { id: 'grade_1', name: 'الصف الأول', sections: ['أ'] },
          { id: 'grade_2', name: 'الصف الثاني', sections: ['أ'] },
          { id: 'grade_3', name: 'الصف الثالث', sections: ['أ'] },
          { id: 'grade_4', name: 'الصف الرابع', sections: ['أ'] },
          { id: 'grade_5', name: 'الصف الخامس', sections: ['أ'] },
          { id: 'grade_6', name: 'الصف السادس', sections: ['أ'] }
        ]
      },
      {
        id: 'middle',
        name: 'المرحلة المتوسطة',
        enabled: false,
        grades: [
          { id: 'grade_7', name: 'الصف الأول المتوسط', sections: ['أ'] },
          { id: 'grade_8', name: 'الصف الثاني المتوسط', sections: ['أ'] },
          { id: 'grade_9', name: 'الصف الثالث المتوسط', sections: ['أ'] }
        ]
      },
      {
        id: 'high',
        name: 'المرحلة الثانوية',
        enabled: false,
        grades: [
          { id: 'grade_10', name: 'الصف الأول الثانوي', sections: ['أ'] },
          { id: 'grade_11', name: 'الصف الثاني الثانوي', sections: ['أ'] },
          { id: 'grade_12', name: 'الصف الثالث الثانوي', sections: ['أ'] }
        ]
      }
    ]

    const { error: settingsError } = await this.supabaseClient
      .from('school_settings')
      .insert([{
        school_id: authUserId,
        school_name: school_name,
        stages: defaultStages,
        attendance_type: 'daily',
        periods_per_day: 6
      }])

    if (settingsError) {
      console.error('School settings creation failed:', settingsError)
      throw new Error(`فشل في إنشاء إعدادات المدرسة: ${settingsError.message}`)
    } else {
      console.log('School settings created successfully')
    }
  }

  private async rollback(authUserId: string | null) {
    console.error('Rolling back due to error')
    try {
      if (authUserId) {
        // Delete in reverse order
        await this.supabaseClient
          .from('school_settings')
          .delete()
          .eq('school_id', authUserId)

        await this.supabaseClient
          .from('schools')
          .delete()
          .eq('id', authUserId)

        await this.supabaseClient.auth.admin.deleteUser(authUserId)
        
        console.log('Successfully rolled back all changes')
      }
    } catch (rollbackError) {
      console.error('Failed to rollback:', rollbackError)
    }
  }
}
