import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ServicesDetail } from "@/components/sections/ServicesDetail";
import { CTA } from "@/components/sections/CTA";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Services = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full gradient-ice blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full gradient-fire blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container text-center"
        >
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4">
            <span className="text-gradient-fire-ice">{t("services.title")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("services.subtitle")}</p>
        </motion.div>
      </section>
      <ServicesGrid />
      <ServicesDetail />
      <CTA />
    </>
  );
};

export default Services;
