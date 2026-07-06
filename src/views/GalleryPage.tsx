import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { apiRequest, getApiBaseUrl } from "@/lib/api";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiRequest<{ items: GalleryItem[] }>("/public/gallery");
        setItems(response.items || []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery().catch(() => {
      setItems([]);
      setIsLoading(false);
    });
  }, []);

  const toImageSrc = (item: GalleryItem) => {
    if (item.imageUrl.startsWith("http://") || item.imageUrl.startsWith("https://")) {
      return item.imageUrl;
    }
    return `${getApiBaseUrl()}${item.imageUrl.replace(/^\/api/, "")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-primary">Gallery</p>
          <h1 className="text-3xl font-bold text-foreground">Hospital Gallery</h1>
          <p className="text-muted-foreground">Photos uploaded by admin are shown here.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse overflow-hidden">
                <div className="h-56 w-full bg-muted" />
                <div className="p-4">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No gallery images uploaded yet.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img src={toImageSrc(item)} alt={item.title} className="h-56 w-full object-cover" loading="lazy" />
                <div className="space-y-1 p-4">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
