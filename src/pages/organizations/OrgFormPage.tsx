import React, { useEffect, useState } from "react";

import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore"; // trimmed ✅
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";
import { newEntityId } from "@/utils/id";

import FormWrapper from "@/components/FormWrapper";
import TextInput from "@/components/TextInput";
import { useNavigate, useParams } from "react-router-dom";

type Organization = import("@/types/types").Organization;

const OrgFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // optional but nice
  const editing = Boolean(id);
  const [form, setForm] = useState<Partial<Organization>>({
    name: "",
    website: "",
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ref = doc(db, paths.organization(id)).withConverter(
        passthroughConverter<Organization>()
      );
      const snap = await getDoc(ref);
      if (snap.exists()) setForm(snap.data());
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entityId = id ?? newEntityId("org");
    const ref = doc(db, paths.organization(entityId)).withConverter(
      passthroughConverter<Organization>()
    );
    const payload: Organization = {
      ...(form as Organization),
      id: entityId,
      name: form.name ?? "",
      website: form.website ?? "",
      createdAt: (form as any)?.createdAt ?? new Date().toISOString(),
    };
    await setDoc(ref, payload, { merge: true });
    navigate(`/organizations/${entityId}`);
  };

  return (
    <FormWrapper
      title={editing ? "Edit Organization" : "New Organization"}
      onSubmit={onSubmit}
    >
      <TextInput
        label="Name"
        value={form.name ?? ""}
        onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
        required
      />
      <TextInput
        label="Website"
        value={form.website ?? ""}
        onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))}
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

export default OrgFormPage;
