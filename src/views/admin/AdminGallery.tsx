import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, getApiBaseUrl } from "@/lib/api";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchGallery = async () => {
    const response = await apiRequest<{ items: GalleryItem[] }>("/admin/gallery");
    setItems(response.items || []);
  };

  useEffect(() => {
    fetchGallery().catch(() => toast.error("Failed to load gallery items"));
  }, []);

  const toImageSrc = (item: GalleryItem) => {
    if (item.imageUrl.startsWith("http://") || item.imageUrl.startsWith("https://")) {
      return item.imageUrl;
    }
    return `${getApiBaseUrl()}${item.imageUrl.replace(/^\/api/, "")}`;
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);

    setUploading(true);
    try {
      await apiRequest("/admin/gallery", {
        method: "POST",
        body: formData,
      });
      toast.success("Image uploaded");
      setTitle("");
      setDescription("");
      setFile(null);
      fetchGallery().catch(() => toast.error("Failed to refresh gallery"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (item: GalleryItem) => {
    try {
      await apiRequest(`/admin/gallery/${item.id}/active`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      toast.success(item.isActive ? "Image hidden from gallery" : "Image visible in gallery");
      fetchGallery().catch(() => toast.error("Failed to refresh gallery"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update image status"));
    }
  };

  const deleteItem = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.title}"?`)) {
      return;
    }
    try {
      await apiRequest(`/admin/gallery/${item.id}`, { method: "DELETE" });
      toast.success("Image deleted");
      fetchGallery().catch(() => toast.error("Failed to refresh gallery"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete image"));
    }
  };

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter((item) => {
      return item.title.toLowerCase().includes(search) || (item.description || "").toLowerCase().includes(search);
    });
  }, [items, query]);

  const visibleCount = items.filter((item) => item.isActive).length;
  const hiddenCount = items.length - visibleCount;

  return (
    <AdminLayout title="Gallery" subtitle="Upload and curate media shown on your public website">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{items.length}</p>
            <p className="mt-1 text-xs text-slate-500">Uploaded media assets</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Visible</p>
              <Eye className="h-4 w-4 text-violet-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-violet-700">{visibleCount}</p>
            <p className="mt-1 text-xs text-slate-500">Live on public gallery</p>
          </Card>
          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Hidden</p>
              <EyeOff className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-rose-700">{hiddenCount}</p>
            <p className="mt-1 text-xs text-slate-500">Not visible publicly</p>
          </Card>
        </div>

        <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="gallery-title">Title</Label>
                <Input
                  id="gallery-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Pediatric care wing"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gallery-description">Description</Label>
                <Textarea
                  id="gallery-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short description"
                  className="mt-1"
                  rows={1}
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
              <Label htmlFor="gallery-image">Image File</Label>
              <Input
                id="gallery-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                required
                className="mt-2"
              />
              <p className="mt-2 text-xs text-slate-500">
                {file ? `Selected: ${file.name}` : "Choose JPG, PNG, or WEBP files for best quality."}
              </p>
            </div>

            <Button type="submit" className="h-10 gap-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700" disabled={uploading}>
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </form>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search media by title or description..."
              className="h-10 border-slate-200 pl-9"
            />
          </div>
        </Card>

        {filteredItems.length === 0 ? (
          <Card className="border-slate-200/80 bg-white/90 p-10 text-center text-sm text-slate-500 shadow-sm">
            No gallery images found.
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-slate-200/80 bg-white/95 shadow-sm">
                <div className="relative">
                  <img src={toImageSrc(item)} alt={item.title} className="h-52 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                    <p className="truncate text-sm font-medium text-white">{item.title || "Untitled image"}</p>
                    <Badge variant="secondary" className={item.isActive ? "bg-violet-100 text-violet-700" : "bg-rose-100 text-rose-700"}>
                      {item.isActive ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-slate-500">
                    {item.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item)} />
                      <span className="text-xs text-slate-500">Show on public page</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => deleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
