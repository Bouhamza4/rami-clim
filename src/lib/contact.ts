// Default/fallback contact info — actual values are loaded dynamically
// from the database via useContactInfo(). These are used only as backup.
export const CONTACT = {
  phone: "+212657109410",
  phoneDisplay: "+212 657-109410",
  email: "Younesrm07@gmail.com",
  whatsapp: "212657109410",
  instagram: "https://www.instagram.com/ramiclim",
  facebook: "https://www.facebook.com/share/1YpwyLGaTn",
  brand: "Rami Clim",
};

export const buildWhatsappLink = (msg: string, phone = CONTACT.whatsapp) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

export const buildSmsLink = (msg: string, phone = CONTACT.phone) =>
  `sms:${phone}?body=${encodeURIComponent(msg)}`;

export const buildMailLink = (subject: string, body: string, email = CONTACT.email) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
