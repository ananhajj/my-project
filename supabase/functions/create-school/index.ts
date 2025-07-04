
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { SchoolCreator } from './school-creator.ts'
import { SchoolCreationRequest, SchoolCreationResponse } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Starting school creation process ===')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const requestData: SchoolCreationRequest = await req.json()
    console.log('Request data:', { 
      school_name: requestData.school_name, 
      subscription_months: requestData.subscription_months 
    })

    const schoolCreator = new SchoolCreator(supabaseClient)
    const result = await schoolCreator.createSchool(requestData)

    console.log('=== School creation completed successfully ===')

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('=== School creation process failed ===', error)
    
    let errorMessage = 'حدث خطأ غير متوقع أثناء إنشاء المدرسة'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    const response: SchoolCreationResponse = { 
      success: false,
      error: errorMessage,
      details: error.toString()
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
