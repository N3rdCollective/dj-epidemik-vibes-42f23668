import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

export const Auth = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-20">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Welcome to DJ Epidemik
      </h2>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#22c55e',
                brandAccent: '#16a34a',
              },
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
};