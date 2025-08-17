// src/pages/projects/ProjectFormPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";
import FormWrapper from "@/components/FormWrapper";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";

type Project = import("@/types/types").Project;
type Organization = import("@/types/types").Organization;

const ProjectFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState<Partial<Project>>({
    name: "",
    organizationId: "",
  });
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const os = await getDocs(
        collection(db, paths.organizations()).withConverter(
          passthroughConverter<Organization>()
        )
      );
      setOrgs(os.docs.map((d) => d.data()));
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, paths.project(id)).withConverter(
        passthroughConverter<Project>()
      );
      const snap = await getDoc(ref);
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const entityId = id ?? newEntityId("prj");
      const ref = doc(db, paths.project(entityId)).withConverter(
        passthroughConverter<Project>()
      );
      const payload: Project = {
        ...(form as Project),
        id: entityId,
        name: form.name ?? "",
        organizationId: form.organizationId ?? "",
        status: (form as any)?.status ?? "active",
        createdAt: (form as any)?.createdAt ?? new Date().toISOString(),
      };
      await setDoc(ref, payload, { merge: true });
      navigate(`/projects/${entityId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormWrapper
      title={editing ? "Edit Project" : "New Project"}
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Project name"
          value={form.name ?? ""}
          onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          required
        />
        <SelectInput
          label="Organization"
          value={form.organizationId ?? ""}
          onChange={(e) =>
            setForm((v) => ({ ...v, organizationId: e.target.value }))
          }
          options={[
            { label: "Select…", value: "" },
            ...orgs.map((o) => ({ label: o.name, value: o.id })),
          ]}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-[var(--accent-color1)] hover:bg-[var(--accent-color1-hover)] text-white text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
        </button>
        {editing && (
          <Link
            to={`/projects/${id}`}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-[var(--color-card-hover)]"
          >
            Cancel
          </Link>
        )}
      </div>
    </FormWrapper>
  );
};

export default ProjectFormPage;
