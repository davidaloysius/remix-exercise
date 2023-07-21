interface ErrorMessageProps {
    message: string;
  }
  
  export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
      <label
        htmlFor="title"
        className="block w-full mt-1 leading-4 tracking-tight text-red-600 text-xs"
      >
        {message}
      </label>
    );
  }
  