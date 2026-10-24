
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const IMAGE_ITEMS = [
  { key: "hero", label: "Foto utama halaman depan" },
  { key: "kuliah", label: "Foto Kuliah" },
  { key: "kerja", label: "Foto Kerja" },
  { key: "desain", label: "Foto Desain & Kreatif" },
  { key: "gaming", label: "Foto Gaming Ringan" },
];

const BUCKET = "product-images";

export default function SiteImagesManager() {
  const [images, setImages] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadImages() {
      const { data, error } = await supabase
        .from("site_images")
        .select("image_key, image_url");

      if (error) {
        setMessage("Gagal memuat foto: " + error.message);
      } else {
        const result = {};
        (data || []).forEach((item) => {
          result[item.image_key] = item.image_url;
        });
        setImages(result);
      }

      setLoading(false);
    }

    loadImages();
  }, []);

  async function saveImage(key) {
    setSaving(key);
    setMessage("");

    try {
      let imageUrl = images[key] || "";
      const file = files[key];

      if (file) {
        const extension = (
          file.name.split(".").pop() || "jpg"
        ).toLowerCase().replace(/[^a-z0-9]/g, "");

        const path =
          `website/${key}-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        imageUrl = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path).data.publicUrl;
      }

      if (!imageUrl.trim()) {
        throw new Error("Pilih foto atau masukkan URL gambar.");
      }

      const { error } = await supabase
        .from("site_images")
        .upsert({
          image_key: key,
          image_url: imageUrl.trim(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "image_key" });

      if (error) throw error;

      setImages((current) => ({
        ...current,
        [key]: imageUrl,
      }));

      setFiles((current) => ({
        ...current,
        [key]: null,
      }));

      setMessage("Foto berhasil disimpan. Periksa website untuk melihat hasilnya.");
    } catch (error) {
      setMessage("Gagal menyimpan: " + error.message);
    } finally {
      setSaving("");
    }
  }

  if (loading) {
    return <div className="ap-panel">Memuat pengaturan foto...</div>;
  }

  return (
    <section className="ap-panel" id="ap-site-images">
      <div className="ap-panel-heading">
        <div className="ap-panel-icon">▧</div>
        <div>
          <h3>Manajemen foto website</h3>
          <p>Ganti foto halaman depan tanpa mengubah data produk.</p>
        </div>
      </div>

      {IMAGE_ITEMS.map((item) => (
        <div
          key={item.key}
          style={{
            padding: "18px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <label className="ap-label">
            {item.label}
          </label>

          {(files[item.key] || images[item.key]) && (
            <img
              src={
                files[item.key]
                  ? URL.createObjectURL(files[item.key])
                  : images[item.key]
              }
              alt={item.label}
              style={{
                display: "block",
                width: "100%",
                maxWidth: "420px",
                maxHeight: "220px",
                objectFit: "cover",
                borderRadius: "14px",
                margin: "10px 0",
              }}
            />
          )}

          <input
            className="ap-input"
            type="url"
            value={images[item.key] || ""}
            onChange={(event) =>
              setImages((current) => ({
                ...current,
                [item.key]: event.target.value,
              }))
            }
            placeholder="Tempel URL gambar (opsional jika unggah foto)"
          />

          <label className="ap-label">
            Pilih foto dari galeri HP
          </label>

          <input
            className="ap-input ap-file-input"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setFiles((current) => ({
                ...current,
                [item.key]: event.target.files?.[0] || null,
              }))
            }
          />

          <button
            type="button"
            className="ap-button ap-button-primary"
            disabled={saving === item.key}
            onClick={() => saveImage(item.key)}
            style={{ marginTop: "12px" }}
          >
            {saving === item.key ? "Menyimpan..." : "Simpan foto"}
          </button>
        </div>
      ))}

      {message && (
        <div className="ap-notice info" role="status">
          {message}
        </div>
      )}
    </section>
  );
      }
            
