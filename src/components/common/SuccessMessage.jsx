const SuccessMessage = ({ message = "Success!" }) => {
  return (
    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
};

export default SuccessMessage;