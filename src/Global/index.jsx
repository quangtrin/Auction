import Swal from "sweetalert2";
const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    var start = text.substring(0, startChars);
    var end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};
function formatDate(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }

  function messageSwal(message, isSuccess) {
    Swal.fire({
      icon: isSuccess ? 'success' : "error",
      title: message,
      showConfirmButton: true,
      width: 450
    })
  }
export {truncate, formatDate, messageSwal}