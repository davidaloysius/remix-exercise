interface LabelProps {
  name: string;
}

export default function Label({ name }: LabelProps) {
  return (
    <label
      htmlFor="title"
      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
    >
      {name}
    </label>
  );
}
