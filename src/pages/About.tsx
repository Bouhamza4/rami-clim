import { AboutSection } from "@/components/sections/AboutSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container text-center"
        >
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4">
            <span className="text-gradient-fire-ice">{t("about.title")}</span>
          </h1>
          <p className="text-lg text-muted-foreground">{t("about.subtitle")}</p>
        </motion.div>
      </section>
      <AboutSection />
      <Testimonials />
      <CTA />
    </>
  );
};

export default About;
