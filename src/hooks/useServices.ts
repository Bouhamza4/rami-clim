import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  slug: string;
  icon: string | null;
  title: string;
  short_description: string;
  what_we_do: string | null;
  what_we_install: string | null;
  problems_solutions: string | null;
  display_order: number;
  active: boolean;
};

export const useServices = (includeInactive = false) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("services").select("*").order("display_order");
    if (!includeInactive) q = q.eq("active", true);
    const { data } = await q;
    setServices((data as Service[]) || []);
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => { load(); }, [load]);

  return { services, loading, reload: load };
};
