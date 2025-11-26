import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  status: "pending" | "processing" | "completed" | "rejected";
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
    status: "pending" as Tracking["status"],
    note: "",
    estimated_completion_date: "",
  });

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    const { data, error } = await supabase
      .from("document_tracking")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat tracking");
    } else {
      setTrackings(data || []);
    }
  };

  const handleSave = async () => {
    if (!formData.tracking_number || !formData.document_type) {
      toast.error("Nomor tracking dan tipe dokumen harus diisi");
      return;
    }

    const dataToSave = {
      ...formData,
      completed_at:
        formData.status === "completed" ? new Date().toISOString() : null,
    };

    if (editingTracking) {
      const { error } = await supabase
        .from("document_tracking")
        .update(dataToSave)
        .eq("id", editingTracking.id);

      if (error) {
        toast.error("Gagal mengupdate tracking");
      } else {
        toast.success("Tracking berhasil diupdate");
        fetchTrackings();
        handleClose();
      }
    } else {
      const { error } = await supabase
        .from("document_tracking")
        .insert([dataToSave]);

      if (error) {
        toast.error("Gagal menambah tracking");
      } else {
        toast.success("Tracking berhasil ditambahkan");
        fetchTrackings();
        handleClose();
      }
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

    const { error } = await supabase
      .from("document_tracking")
      .delete()
      .eq("id", tracking.id);

    if (error) {
      toast.error("Gagal menghapus tracking");
    } else {
      toast.success("Tracking berhasil dihapus");
      fetchTrackings();
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingTracking(null);
    setFormData({
      tracking_number: "",
      document_type: "",
      status: "pending",
      note: "",
      estimated_completion_date: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.toUpperCase()}
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
                <Input
                  id="document_type"
                  value={formData.document_type}
                  onChange={(e) =>
                    setFormData({ ...formData, document_type: e.target.value })
                  }
                  placeholder="KTP, Surat, dll"
                />
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                <Button onClick={handleSave}>Simpan</Button>
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
      />
    </div>
  );
};

export default DocumentTracking;
