import { useState, useEffect } from "react";
import { cmsFetch } from "@/lib/cms";
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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await cmsFetch("/faqs");
      setFaqs(response.data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    if (!question || !answer) {
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      if (editingFaq) {
        await cmsFetch(`/faqs/${editingFaq.id}`, {
          method: "PUT",
          body: JSON.stringify({ question, answer }),
        });
        toast.success("FAQ berhasil diupdate");
      } else {
        await cmsFetch("/faqs", {
          method: "POST",
          body: JSON.stringify({ question, answer }),
        });
        toast.success("FAQ berhasil ditambahkan");
      }
      fetchFaqs();
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsDialogOpen(true);
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm("Yakin ingin menghapus FAQ ini?")) return;

    try {
      await cmsFetch(`/faqs/${faq.id}`, {
        method: "DELETE",
      });
      toast.success("FAQ berhasil dihapus");
      fetchFaqs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
  };

  const columns = [
    { key: "question", label: "Pertanyaan" },
    { key: "answer", label: "Jawaban" },
    {
      key: "created_at",
      label: "Dibuat",
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Kelola pertanyaan dan jawaban</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? "Edit FAQ" : "Tambah FAQ Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Pertanyaan</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Masukkan pertanyaan..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Jawaban</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Masukkan jawaban..."
                  rows={5}
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
        data={faqs}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari FAQ..."
      />
    </div>
  );
};

export default FAQ;
