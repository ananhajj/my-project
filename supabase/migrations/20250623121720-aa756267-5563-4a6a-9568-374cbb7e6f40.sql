
-- إنشاء حساب مدير النظام مع التعامل الصحيح مع الحالات الموجودة
DO $$
DECLARE
    admin_user_id uuid;
    user_exists boolean := false;
BEGIN
    -- البحث عن المستخدم الموجود
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@school-system.com';
    
    -- إذا وُجد المستخدم، نستخدم ID الموجود
    IF admin_user_id IS NOT NULL THEN
        user_exists := true;
    ELSE
        -- إنشاء ID جديد للمستخدم
        admin_user_id := gen_random_uuid();
    END IF;
    
    -- إذا لم يكن المستخدم موجوداً، أنشئه
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token,
            aud,
            role,
            raw_user_meta_data,
            is_super_admin,
            last_sign_in_at
        ) VALUES (
            admin_user_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'admin@school-system.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '',
            '',
            '',
            '',
            'authenticated',
            'authenticated',
            '{"role": "admin", "full_name": "مدير النظام"}'::jsonb,
            false,
            now()
        );
    END IF;
    
    -- التعامل مع جدول profiles باستخدام UPSERT
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@school-system.com',
        'مدير النظام',
        'admin',
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = EXCLUDED.updated_at;
        
END $$;
