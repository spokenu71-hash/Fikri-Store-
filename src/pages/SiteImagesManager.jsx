import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { Images, ChevronDown, CheckCircle2, CircleDashed } from "lucide-react";

const ITEMS = [
  { key: "hero", label: "Foto utama halaman depan", description: "Visual utama yang pertama dilihat pengunjung." },
  { key: "kuliah", label: "Foto Kuliah", description: "Visual untuk kebutuhan belajar dan perkuliahan." },
  { key: "kerja", label: "Foto Kerja", description: "Visual untuk produktivitas dan pekerjaan." },
  { key: "desain", label: "Foto Desain & Kreatif", description: "Visual untuk aktivitas desain dan konten kreatif." },
  { key: "gaming", label: "Foto Gaming Ringan", description: "Visual untuk kebutuhan gaming kasual." },
];

const BUCKET = "product-images";

export default function SiteImagesManager() {
  const [images, setImages] = useState({});
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const previewUrls = useRef(new Set());

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("site_images")
        .select("image_key,image_url");
      if (!active) return;
      if (error) {
        setMessage("Gagal memuat foto: " + error.message);
        return;
      }
      const result = {};
      (data || []).forEach((item) => { result[item.image_key] = item.image_url; });
      setImages(result);
    }
    load();
    return () => {
      active = false;
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    };
  }, []);

  function chooseFile(key, file) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Format foto harus JPEG, PNG, atau WebP.");
      setFiles((old) => ({ ...old, [key]: null }));
      setPreviews((old) => {
        if (old[key]) {
          URL.revokeObjectURL(old[key]);
          previewUrls.current.delete(old[key]);
        }
        return { ...old, [key]: "" };
      });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 8 MB.");
      setFiles((old) => ({ ...old, [key]: null }));
      setPreviews((old) => {
        if (old[key]) {
          URL.revokeObjectURL(old[key]);
          previewUrls.current.delete(old[key]);
        }
        return { ...old, [key]: "" };
      });
      return;
    }
    setFiles((old) => ({ ...old, [key]: file }));
    setPreviews((old) => {
      if (old[key]) {
        URL.revokeObjectURL(old[key]);
        previewUrls.current.delete(old[key]);
      }
      const nextUrl = URL.createObjectURL(file);
      previewUrls.current.add(nextUrl);
      return { ...old, [key]: nextUrl };
    });
    setMessage("");
  }

  function clearSelectedFile(key) {
    setFiles((old) => ({ ...old, [key]: null }));
    setPreviews((old) => {
      if (old[key]) {
        URL.revokeObjectURL(old[key]);
        previewUrls.current.delete(old[key]);
      }
      return { ...old, [key]: "" };
    });
  }

  async function save(key) {
    setBusy(key);
    setMessage("");
    try {
      let url = (images[key] || "").trim();
      const file = files[key];
      if (file) {
        const extension = (file.name.split(".").pop() || "jpg")
          .toLowerCase().replace(/[^a-z0-9]/g, "");
        const path = `website/${key}-${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" });
        if (uploadError) throw uploadError;
        url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
      if (!url) throw new Error("Pilih foto atau masukkan URL gambar terlebih dahulu.");
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        throw new Error("Masukkan URL gambar yang valid.");
      }
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("URL gambar harus menggunakan HTTP atau HTTPS.");
      }
      const { error } = await supabase.from("site_images").upsert(
        { image_key: key, image_url: url, updated_at: new Date().toISOString() },
        { onConflict: "image_key" }
      );
      if (error) throw error;
      setImages((old) => ({ ...old, [key]: url }));
      setFiles((old) => ({ ...old, [key]: null }));
      setPreviews((old) => {
        if (old[key]) {
          URL.revokeObjectURL(old[key]);
          previewUrls.current.delete(old[key]);
        }
        return { ...old, [key]: "" };
      });
      setMessage("Foto berhasil disimpan. Muat ulang website untuk melihat hasilnya.");
    } catch (error) {
      setMessage("Gagal menyimpan foto: " + error.message);
    } finally {
      setBusy("");
    }
  }

  return (
    <section id="ap-site-images" className="ap-panel ap-site-images-panel">
      <div className="ap-panel-heading ap-site-images-heading">
        <div className="ap-site-images-heading-icon" aria-hidden="true"><Images size={23} strokeWidth={1.8} /></div>
        <div>
          <span className="ap-eyebrow">KONTEN WEBSITE</span>
          <h3>Manajemen foto website</h3>
          <p>Perbarui visual homepage tanpa mengubah data produk.</p>
        </div>
      </div>

      <div className="ap-site-image-list">
        {ITEMS.map((item, index) => {
          const preview = previews[item.key] || images[item.key];
          const hasImage = Boolean(images[item.key]);
          return (
            <details className="ap-site-image-item" key={item.key}>
              <summary className="ap-site-image-summary">
                <span className="ap-site-image-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="ap-site-image-summary-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                {preview ? (
                  <img className="ap-site-image-thumb" src={preview} alt="" />
                ) : (
                  <span className="ap-site-image-placeholder">+</span>
                )}
                <span className={hasImage ? "ap-site-image-status is-set" : "ap-site-image-status"}>
                  {hasImage ? <><CheckCircle2 size={13} /> Tersimpan</> : <><CircleDashed size={13} /> Belum diatur</>}
                </span>
                <span className="ap-site-image-chevron" aria-hidden="true"><ChevronDown size={18} /></span>
              </summary>

              <div className="ap-site-image-editor">
                {preview && <img className="ap-site-image-preview" src={preview} alt={item.label} />}
                <label className="ap-label" htmlFor={`site-file-${item.key}`}>Pilih gambar dari galeri</label>
                <input
                  id={`site-file-${item.key}`}
                  className="ap-input ap-file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  disabled={busy === item.key}
                  onChange={(event) => {
                    chooseFile(item.key, event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                <label className="ap-label" htmlFor={`site-url-${item.key}`}>Atau gunakan URL gambar</label>
                <input
                  id={`site-url-${item.key}`}
                  className="ap-input"
                  type="url"
                  value={images[item.key] || ""}
                  disabled={busy === item.key}
                  onChange={(event) => {
                    clearSelectedFile(item.key);
                    setImages((old) => ({ ...old, [item.key]: event.target.value }));
                  }}
                  placeholder="https://contoh.com/foto.jpg"
                />
                <button
                  type="button"
                  className="ap-button ap-button-primary ap-site-image-save"
                  disabled={busy === item.key}
                  onClick={() => save(item.key)}
                >
                  {busy === item.key ? "Menyimpan..." : "Simpan perubahan"}
                </button>
              </div>
            </details>
          );
        })}
      </div>

      {message && <p className="ap-site-image-message" role="status">{message}</p>}
    </section>
  );
}
