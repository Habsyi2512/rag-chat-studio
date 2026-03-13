import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO = ({ 
  title = "AI Chatbot Disdukcapil Kepulauan Anambas", 
  description = "Layanan informasi otomatis kependudukan dan pencatatan sipil Dinas Kependudukan dan Catatan Sipil Kabupaten Kepulauan Anambas.",
  keywords = "Dukcapil Anambas, Chatbot Dukcapil, Layanan Kependudukan, Kabupaten Kepulauan Anambas, RAG Chat",
  ogImage = "/anambas.png",
  ogUrl = "https://chatdukcapil.my.id/"
}: SEOProps) => {
  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
