import React, { useEffect, useState } from "react";

import { db } from "../../firebase/firebaseConfig"; // adjust path if needed
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";

import FormWrapper from "@/components/FormWrapper";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";
import { useNavigate, useParams } from "react-router-dom";

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <FormWrapper
      title={editing ? "Edit Project" : "New Project"}
      onSubmit={onSubmit}
    >
      <TextInput
        label="Name"
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
          { label: "Select...", value: "" },
          ...orgs.map((o) => ({ label: o.name, value: o.id })),
        ]}
      />
      <button
        className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
        type="submit"
      >
        {editing ? "Save Changes" : "Create"}
      </button>
    </FormWrapper>
  );
};

export default ProjectFormPage;
