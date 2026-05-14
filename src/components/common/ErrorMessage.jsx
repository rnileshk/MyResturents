const ErrorMessage = ({ message = "Something went wrong." }) => {
  return (
    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
      {typeof message === "string" ? message : "Something went wrong."}
    </div>
  );
};

export default ErrorMessage;