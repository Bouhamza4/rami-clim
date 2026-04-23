import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/lib/contact";

export type ContactInfo = {
  id?: string;
  phone: string;
  phone_display: string;
  email: string;
  address: string | null;
  city: string | null;
  whatsapp: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  maps_url: string | null;
};

const FALLBACK: ContactInfo = {
  phone: CONTACT.phone,
  phone_display: CONTACT.phoneDisplay,
  email: CONTACT.email,
  address: "Tanger",
  city: "Tanger & Tétouan",
  whatsapp: CONTACT.whatsapp,
  facebook_url: CONTACT.facebook,
  instagram_url: CONTACT.instagram,
  maps_url: null,
};

export const useContactInfo = () => {
  const [info, setInfo] = useState<ContactInfo>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("contact_info")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setInfo({
            id: data.id,
            phone: data.phone || FALLBACK.phone,
            phone_display: data.phone_display || FALLBACK.phone_display,
            email: data.email || FALLBACK.email,
            address: data.address,
            city: data.city,
            whatsapp: data.whatsapp,
            facebook_url: data.facebook_url,
            instagram_url: data.instagram_url,
            maps_url: data.maps_url,
          });
        }
        setLoading(false);
      });
  }, []);

  return { info, loading };
};
