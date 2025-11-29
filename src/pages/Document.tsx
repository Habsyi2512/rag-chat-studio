import { useState, useEffect } from "react";
import { cmsFetch } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  updated_at: string;
}

const Document = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await cmsFetch("/documents");
      setDocuments(response.data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      await cmsFetch("/documents", {
        method: "POST",
        body: formData,
      });
      toast.success("Dokumen berhasil diupload");
      fetchDocuments();
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;

    try {
      await cmsFetch(`/documents/${doc.id}`, {
        method: "DELETE",
      });
      toast.success("Dokumen berhasil dihapus");
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const columns = [
    { key: "file_name", label: "Nama File" },
    {
      key: "file_size",
      label: "Ukuran",
      render: (value: number) => formatFileSize(value),
    },
    { key: "file_type", label: "Tipe" },
    {
      key: "created_at",
      label: "Diupload",
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Kelola dokumen eksternal</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Pilih File</Label>
                <div className="flex gap-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".pdf,.txt,.docx,.doc"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: PDF, TXT, DOCX (Max 20MB)
                </p>
              </div>
              {file && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Batal
                </Button>
                <Button onClick={handleUpload} disabled={!file}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        onDelete={handleDelete}
        searchPlaceholder="Cari dokumen..."
      />
    </div>
  );
};

export default Document;
