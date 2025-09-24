export type BankInfo = {
  name: string;
  logo: string;
  accountExtractor: (raw: string) => string;
  shebaFormatLength?: number;
};

export const banks: Record<string, BankInfo> = {
  "010": { name: "مرکزی", logo: "https://uploadkon.ir/uploads/dd2d19_25Bank-Markazi-Iran-logo-limo.png", accountExtractor: r => r, shebaFormatLength: 19 },
  "011": { name: "صنعت و معدن", logo: "https://static.idpay.ir/banks/industry-and-mine.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "012": { name: "ملت", logo: "https://static.idpay.ir/banks/mellat.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "013": { name: "رفاه کارگران", logo: "https://static.idpay.ir/banks/refah.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "014": { name: "مسکن", logo: "https://static.idpay.ir/banks/maskan.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "015": { name: "سپه", logo: "https://static.idpay.ir/banks/sepah.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "016": { name: "کشاورزی", logo: "https://static.idpay.ir/banks/keshavarzi.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "017": { name: "ملی ایران", logo: "https://static.idpay.ir/banks/melli.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "018": { name: "تجارت", logo: "https://static.idpay.ir/banks/tejarat.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "019": { name: "صادرات", logo: "https://static.idpay.ir/banks/saderat.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "020": { name: "توسعه صادرات", logo: "https://static.idpay.ir/banks/export-development.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "021": { name: "پست بانک", logo: "https://static.idpay.ir/banks/post-bank.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "022": { name: "توسعه تعاون", logo: "https://static.idpay.ir/banks/tosee-taavon.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "051": { name: "موسسه اعتباری توسعه", logo: "https://uploadkon.ir/uploads/834919_25etebari-tose.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "053": { name: "کارآفرین", logo: "https://static.idpay.ir/banks/karafarin.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "054": { name: "پارسیان", logo: "https://static.idpay.ir/banks/parsian.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "055": { name: "اقتصاد نوین", logo: "https://static.idpay.ir/banks/eghtesad-novin.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "056": { name: "سامان", logo: "https://static.idpay.ir/banks/saman.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "057": { name: "پاسارگاد", logo: "https://static.idpay.ir/banks/pasargad.png", accountExtractor: r => r, shebaFormatLength: 19 },
  "058": { name: "توسعه تعاون", logo: "https://static.idpay.ir/banks/tosee-taavon.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "059": { name: "سینا", logo: "https://static.idpay.ir/banks/sina.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "060": { name: "مهر ایران", logo: "https://static.idpay.ir/banks/mehr-iran.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "061": { name: "شهر", logo: "https://static.idpay.ir/banks/shahr.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "062": { name: "آینده", logo: "https://static.idpay.ir/banks/ayandeh.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "063": { name: "خاورمیانه", logo: "https://static.idpay.ir/banks/middle-east.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "064": { name: "گردشگری", logo: "https://static.idpay.ir/banks/tourism.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "065": { name: "حکمت ایرانیان", logo: "https://uploadkon.ir/uploads/31a219_25hekmat-iranian.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "066": { name: "دی", logo: "https://static.idpay.ir/banks/dey.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "069": { name: "ایران زمین", logo: "https://static.idpay.ir/banks/iran-zamin.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "070": { name: "قرض‌الحسنه رسالت", logo: "https://static.idpay.ir/banks/resalat.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
  "078": { name: "خاورمیانه", logo: "https://static.idpay.ir/banks/middle-east.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 }, // Duplicate, but keeping for safety
  "079": { name: "مهر اقتصاد", logo: "https://uploadkon.ir/uploads/c97b19_25mehr-eghtesad.png", accountExtractor: r => r.replace(/^0+/, ""), shebaFormatLength: 19 },
};
