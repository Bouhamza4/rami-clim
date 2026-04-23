-- 1) Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Auto-grant admin to specific email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'bouhamzamohammed557@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Generic timestamp updater
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4) Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  what_we_do TEXT,
  what_we_install TEXT,
  problems_solutions TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are public"
ON public.services FOR SELECT
TO anon, authenticated
USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage services"
ON public.services FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Contact info (single row)
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  phone_display TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  whatsapp TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  maps_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact info is public"
ON public.contact_info FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage contact info"
ON public.contact_info FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER contact_info_set_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.contact_info (phone, phone_display, email, address, city, whatsapp)
VALUES ('+212600000000', '+212 6 00 00 00 00', 'contact@ramiclim.ma', 'Tanger', 'Tanger & Tétouan', '+212600000000');

-- 6) Allow admins to moderate reviews (approve/reject/delete)
CREATE POLICY "Admins can view all reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7) Seed initial services
INSERT INTO public.services (slug, icon, title, short_description, what_we_do, what_we_install, problems_solutions, display_order) VALUES
('clim', 'snowflake', 'Climatisation', 'Installation, entretien et réparation de tous types de climatiseurs.', 'Étude des besoins, dimensionnement BTU, installation complète, mise en service et maintenance préventive.', 'Split mural, multi-split, cassette, gainable, VRV/VRF des marques LG, Samsung, Daikin, Mitsubishi.', 'Fuite de gaz, mauvais refroidissement, bruit anormal, mauvaises odeurs — diagnostic rapide et réparation garantie.', 1),
('chauffage', 'flame', 'Chauffage', 'Pompes à chaleur, chaudières et radiateurs pour un confort hivernal optimal.', 'Conseil énergétique, installation, raccordement et entretien annuel de votre système de chauffage.', 'Pompes à chaleur air/eau, chaudières gaz à condensation, radiateurs basse température et planchers chauffants.', 'Chaudière en panne, fuites, surconsommation — interventions rapides 7j/7.', 2),
('solaire', 'sun', 'Énergie Solaire', 'Chauffe-eau solaires et installations photovoltaïques.', 'Étude de toiture, dimensionnement, pose des panneaux et mise en service complète.', 'Chauffe-eau solaire 200-500L, panneaux photovoltaïques, onduleurs et batteries lithium.', 'Faible rendement, défaut onduleur, calcaire dans le ballon — entretien et nettoyage professionnels.', 3),
('ventilation', 'wind', 'Ventilation (VMC)', 'Ventilation mécanique contrôlée pour un air sain.', 'Installation de VMC simple ou double flux dans habitations et locaux professionnels.', 'VMC simple flux hygro, double flux avec récupération de chaleur, extracteurs salle de bain et cuisine.', 'Humidité, moisissures, mauvaise qualité d''air — solutions sur-mesure.', 4),
('frigorifique', 'refrigerator', 'Froid Commercial', 'Chambres froides, vitrines et froid industriel.', 'Conception, installation et maintenance de tous équipements frigorifiques pour restaurants et commerces.', 'Chambres froides positives/négatives, vitrines réfrigérées, congélateurs professionnels.', 'Perte de froid, givrage, compresseur défaillant — service d''urgence 24/7.', 5),
('plomberie', 'wrench', 'Plomberie', 'Plomberie générale et raccordements sanitaires.', 'Installation, réparation et rénovation des réseaux d''eau chaude et froide.', 'Tuyauterie cuivre/PER/multicouche, robinetterie, chauffe-eau, sanitaires complets.', 'Fuites, canalisations bouchées, faible pression — interventions rapides.', 6),
('maintenance', 'shield-check', 'Maintenance & Contrats', 'Contrats annuels pour particuliers et entreprises.', 'Visites programmées, nettoyage, vérification des performances et rapport détaillé.', 'Contrats Bronze, Silver et Gold adaptés à votre installation.', 'Pannes répétées, baisse de performance — la maintenance préventive divise les pannes par 3.', 7);