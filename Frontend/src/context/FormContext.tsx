import React, { createContext, useState, ReactNode } from 'react';

type FormData = {
  title: string;
  category: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl?: string | null;
};

type FormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  resetForm: () => void;
};

const defaultForm: FormData = {
  title: '',
  category: '',
  description: '',
  latitude: null,
  longitude: null,
  imageUrl: null,
};

export const FormContext = createContext<FormContextType>({
  formData: defaultForm,
  setFormData: () => {},
  resetForm: () => {},
});

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(defaultForm);

  const resetForm = () => setFormData(defaultForm);

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export type { FormData };
