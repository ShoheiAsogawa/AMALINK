import { DocumentLang } from "@/components/i18n/DocumentLang";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocumentLang locale="en" />
      {children}
    </>
  );
}
