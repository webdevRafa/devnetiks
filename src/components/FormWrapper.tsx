import React from "react";

interface FormWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-xl mx-auto"
    >
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <div className="space-y-4">{children}</div>
    </form>
  );
};

export default FormWrapper;
