
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const ITEMS = [
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
  const [previews, setPreviews] = useState({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

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
      (data || []).forEach((item) => {
        result[item.image_key] = item.image_url;
      });

      setImages(result);
    }

    load();

    return () => {
      active = false;
      Object.values(previews).forEach(URL.revokeObjectURL);
    };
  }, []);

  function chooseFile(key, file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Pilih file gambar yang valid.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 8 MB.");
      return;
    }

    setFiles((old) => ({ ...old, [key]: file }));
    setPreviews((old) => {
      if (old[key]) URL.revokeObjectURL(old[key]);
      return { ...old, [key]: URL.createObjectURL(file) };
    });
    setMessage("");
  }

  async function save(key) {
    setBusy(key);
    setMessage("");

    try {
      let url = (images[key] || "").trim();
      const file = files[key];

      if (file) {
        const extension = (
          file.name.split(".").pop() || "jpg"
        ).toLowerCase().replace(/[^a-z0-9]/g, "");

        const path = `website/${key}-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            upsert: false,
            contentType: file.type || "image/jpeg",
          });

        if (uploadError) throw uploadError;

        url = supabase.storage.from(BUCKET).getPublicUrl(path)
          .data.publicUrl;
      }

      if (!url) {
        throw new Error("Pilih foto atau masukkan URL gambar terlebih dahulu.");
      }

      const { error } = await supabase.from("site_images").upsert(
        {
          image_key: key,
          image_url: url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "image_key" }
      );

      if (error) throw error;

      setImages((old) => ({ ...old, [key]: url }));
      setFiles((old) => ({ ...old, [key]: null }));
      setPreviews((old) => {
        if (old[key]) URL.revokeObjectURL(old[key]);
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
    <section
      id="ap-site-images"
      className="ap-panel"
      style={{ marginTop: 28, padding: 24 }}
    >
      <div className="ap-panel-heading">
        <div className="ap-panel-icon">▧</div>
        <div>
          <h3>Manajemen foto website</h3>
          <p>Ganti gambar tanpa mengubah data produk.</p>
        </div>
      </div>

      {ITEMS.map((item) => (
        <article
          key={item.key}
          style={{
            padding: "20px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <label
            className="ap-label"
            htmlFor={`site-url-${item.key}`}
          >
            {item.label}
          </label>

          {(previews[item.key] || images[item.key]) && (
            <img
              src={previews[item.key] || images[item.key]}
              alt={item.label}
              style={{
                display: "block",
                width: "100%",
                maxWidth: 440,
                height: 190,
                objectFit: "cover",
                borderRadius: 14,
                margin: "12px 0",
                background: "#f3f4f6",
              }}
            />
          )}

          <label className="ap-label">
            Pilih gambar dari galeri HP
          </label>
          <input
            className="ap-input ap-file-input"
            type="file"
            accept="image/*"
            onChange={(event) =>
              chooseFile(item.key, event.target.files?.[0])
            }
          />

          <label
            className="ap-label"
            htmlFor={`site-url-${item.key}`}
          >
            Atau masukkan URL gambar
          </label>
          <input
            id={`site-url-${item.key}`}
            className="ap-input"
            type="url"
            value={images[item.key] || ""}
            onChange={(event) =>
              setImages((old) => ({
                ...old,
                [item.key]: event.target.value,
              }))
            }
            placeholder="https://contoh.com/foto.jpg"
          />

          <button
            type="button"
            className="ap-button ap-button-primary"
            disabled={busy === item.key}
            onClick={() => save(item.key)}
            style={{ marginTop: 12 }}
          >
            {busy === item.key ? "Menyimpan..." : "Simpan foto"}
          </button>
        </article>
      ))}

      {message && (
        <p role="status" style={{ marginTop: 18, overflowWrap: "anywhere" }}>
          {message}
        </p>
      )}
    </section>
  );
                          }
        
