// src/ui/components/UserForm.tsx
import { useState } from "react";
import { z } from "zod";
import { entities } from "../../../shared/entities";

const userSchema = entities.user;
type User = z.infer<typeof userSchema>;

export default function UserForm() {
  const [form, setForm] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const parsed = userSchema.safeParse(form);
    if (!parsed.success) {
      setError("Formulario inválido");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error("Error en el servidor");
      alert("Usuario creado");
      setForm({});
    } catch (err) {
      setError("No se pudo crear el usuario");
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
      <input
        placeholder="Nombre"
        value={form.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <select
        value={form.role || ""}
        onChange={(e) => handleChange("role", e.target.value)}
      >
        <option value="">Selecciona un rol</option>
        <option value="ADMIN">ADMIN</option>
        <option value="CAJERO">CAJERO</option>
      </select>
      <input
        placeholder="ID Turno"
        type="number"
        value={form.shiftId || ""}
        onChange={(e) => handleChange("shiftId", Number(e.target.value))}
      />
      <button onClick={handleSubmit}>Crear</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
