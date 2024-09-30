import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatStatus = (status: string) => {
  let color = "";
  let label = "";

  switch (status) {
    case "WAITING":
      color = "bg-yellow-300";
      label = "Chờ đợi";
      break;
    case "WORKING":
      color = "bg-green-500";
      label = "Đang làm việc";
      break;
    case "STOPPED":
      color = "bg-red-500";
      label = "Dừng lại";
      break;
  }

  return (
    <Badge className={color} variant="outline">
      {status}
    </Badge>
  );
};

const formatStatusPath = (status: boolean) => {
  let color = "";
  let label = "";

  switch (status) {
    case true:
      color = "bg-green-300";
      label = "Bật";
      break;
    case false:
      color = "bg-red-500";
      label = "Tắt";
      break;
  }

  return (
    <Badge className={color} variant="outline">
      {label}
    </Badge>
  );
};

const formatType = (status: string) => {
  let color = "";
  let label = "";

  switch (status) {
    case "LINK":
      color = "bg-blue-500";
      label = "Chờ đợi";
      break;
    case "NEW":
      color = "bg-green-500";
      label = "Đang làm việc";
      break;
  }

  return (
    <Badge className={color} variant="outline">
      {status}
    </Badge>
  );
};

export { formatDate, formatStatus, formatType, formatStatusPath };
