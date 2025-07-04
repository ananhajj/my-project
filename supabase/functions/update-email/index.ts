
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateEmailRequest {
  newEmail: string;
  isFirstTimeChange: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newEmail, isFirstTimeChange }: UpdateEmailRequest = await req.json();
    
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create regular client to get user info
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    console.log(`Updating email for user ${user.id} from ${user.email} to ${newEmail}`);

    if (isFirstTimeChange) {
      // For first-time changes (random emails), use admin update without confirmation
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { 
          email: newEmail,
          email_confirm: true // Skip email confirmation
        }
      );

      if (error) {
        console.error("Admin update error:", error);
        throw error;
      }

      console.log("Email updated successfully via admin API");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email updated directly without confirmation",
          data 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // For subsequent changes, use regular update with confirmation
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Confirmation email sent to both old and new email addresses",
          data 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

  } catch (error: any) {
    console.error("Error in update-email function:", error);
    
    let errorMessage = "حدث خطأ في تحديث البريد الإلكتروني";
    const errorMsg = error.message?.toLowerCase() || "";
    
    if (errorMsg.includes("email") && errorMsg.includes("invalid")) {
      errorMessage = "تنسيق البريد الإلكتروني غير صالح";
    } else if (errorMsg.includes("already") && errorMsg.includes("registered")) {
      errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل";
    } else if (errorMsg.includes("rate limit")) {
      errorMessage = "تم تجاوز الحد المسموح من المحاولات";
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: error.message 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
