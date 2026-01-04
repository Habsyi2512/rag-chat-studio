import { useState, useEffect } from "react";
import { cmsFetch } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Tracking {
  id: string;
  tracking_number: string;
  document_type: string;
  status: "Verifikasi Berkas (Front Office)" | "Menunggu Verifikasi Pusat" | "Sedang Diproses (Operator)" | "Menunggu TTE (Tanda Tangan Elektronik)" | "Dokumen Terbit / Siap Cetak" | "Siap Diambil";
  note: string | null;
  estimated_completion_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const DocumentTracking = () => {
  const [trackings, setTrackings] = useState<Tracking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTracking, setEditingTracking] = useState<Tracking | null>(null);
  const [formData, setFormData] = useState({
    tracking_number: "",
    document_type: "",
    status: "Verifikasi Berkas (Front Office)" as Tracking["status"],
    note: "",
    estimated_completion_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTrackings(1, "");
  }, []);

  const fetchTrackings = async (page: number, query: string) => {
    setIsFetching(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      if (query) queryParams.append("search", query);

      const response = await cmsFetch(`/document-tracking?${queryParams.toString()}`);
      setTrackings(response.data || []);
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTrackings(page, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchTrackings(1, query);
  };

  const handleSave = async () => {
    if (!formData.tracking_number || !formData.document_type) {
      toast.error("Nomor tracking dan tipe dokumen harus diisi");
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      ...formData,
      completed_at:
        formData.status === "Siap Diambil" ? new Date().toISOString() : null,
      applicant_name: "Applicant", // Default for now
    };

    try {
      if (editingTracking) {
        await cmsFetch(`/document-tracking/${editingTracking.id}`, {
          method: "PUT",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Tracking berhasil diupdate");
      } else {
        await cmsFetch("/document-tracking", {
          method: "POST",
          body: JSON.stringify(dataToSave),
        });
        toast.success("Tracking berhasil ditambahkan");
      }
      fetchTrackings(currentPage, searchQuery);
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tracking: Tracking) => {
    setEditingTracking(tracking);
    setFormData({
      tracking_number: tracking.tracking_number,
      document_type: tracking.document_type,
      status: tracking.status,
      note: tracking.note || "",
      estimated_completion_date: tracking.estimated_completion_date || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tracking: Tracking) => {
    if (!confirm("Yakin ingin menghapus tracking ini?")) return;

    try {
      await cmsFetch(`/document-tracking/${tracking.id}`, {
        method: "DELETE",
      });
      toast.success("Tracking berhasil dihapus");
      fetchTrackings(currentPage, searchQuery);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingTracking(null);
    setFormData({
      tracking_number: "",
      document_type: "",
      status: "Verifikasi Berkas (Front Office)",
      note: "",
      estimated_completion_date: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "Verifikasi Berkas (Front Office)": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "Menunggu Verifikasi Pusat": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      "Sedang Diproses (Operator)": "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "Menunggu TTE (Tanda Tangan Elektronik)": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "Dokumen Terbit / Siap Cetak": "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      "Siap Diambil": "bg-green-100 text-green-800 hover:bg-green-200",
    };

    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const columns = [
    { key: "tracking_number", label: "No. Tracking" },
    { key: "document_type", label: "Tipe Dokumen" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    { key: "note", label: "Catatan" },
    {
      key: "estimated_completion_date",
      label: "Est. Selesai",
      render: (value: string | null) =>
        value ? new Date(value).toLocaleDateString("id-ID") : "-",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Tracking</h1>
          <p className="text-muted-foreground">
            Kelola pelacakan dokumen
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Tracking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTracking ? "Edit Tracking" : "Tambah Tracking Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking_number">Nomor Tracking</Label>
                <Input
                  id="tracking_number"
                  value={formData.tracking_number}
                  onChange={(e) =>
                    setFormData({ ...formData, tracking_number: e.target.value })
                  }
                  placeholder="TRK-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document_type">Tipe Dokumen</Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, document_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kartu Keluarga (KK)">Kartu Keluarga (KK)</SelectItem>
                    <SelectItem value="KTP Elektronik (KTP-el)">KTP Elektronik (KTP-el)</SelectItem>
                    <SelectItem value="Surat Keterangan Pindah WNI (SKPWNI)">Surat Keterangan Pindah WNI (SKPWNI)</SelectItem>
                    <SelectItem value="Pencatatan Biodata WNI">Pencatatan Biodata WNI</SelectItem>
                    <SelectItem value="Kartu Identitas Anak (KIA)">Kartu Identitas Anak (KIA)</SelectItem>
                    <SelectItem value="Akta Kelahiran">Akta Kelahiran</SelectItem>
                    <SelectItem value="Akta Kematian">Akta Kematian</SelectItem>
                    <SelectItem value="Akta Perceraian">Akta Perceraian</SelectItem>
                    <SelectItem value="Akta Perkawinan">Akta Perkawinan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Tracking["status"]) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verifikasi Berkas (Front Office)">Verifikasi Berkas (Front Office)</SelectItem>
                    <SelectItem value="Menunggu Verifikasi Pusat">Menunggu Verifikasi Pusat</SelectItem>
                    <SelectItem value="Sedang Diproses (Operator)">Sedang Diproses (Operator)</SelectItem>
                    <SelectItem value="Menunggu TTE (Tanda Tangan Elektronik)">Menunggu TTE (Tanda Tangan Elektronik)</SelectItem>
                    <SelectItem value="Dokumen Terbit / Siap Cetak">Dokumen Terbit / Siap Cetak</SelectItem>
                    <SelectItem value="Siap Diambil">Siap Diambil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_completion_date">
                  Estimasi Selesai
                </Label>
                <Input
                  id="estimated_completion_date"
                  type="date"
                  value={formData.estimated_completion_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_completion_date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Catatan</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder="Tambahkan catatan..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={trackings}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari tracking..."
        isLoading={isFetching}
        onSearch={handleSearch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DocumentTracking;
