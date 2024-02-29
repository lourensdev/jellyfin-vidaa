'use client';

export interface TextInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TextInput({
  placeholder,
  value,
  onChange,
}: TextInputProps) {
  return (
    <input
      className="bg-gray text-white rounded-lg py-2 px-4 w-full"
      placeholder={placeholder}
      value={value}
      onKeyUp={e => {
        onChange?.(e.currentTarget.value);
      }}
    />
  );
}
