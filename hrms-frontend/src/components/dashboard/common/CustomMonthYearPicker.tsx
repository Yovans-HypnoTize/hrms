import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { currentMonthYearFormatter } from "../../../common/Utilities";

interface CustomMonthYearPickerProps {
  reloadData: (value: any) => void;
}

const CustomMonthYearPicker: React.FC<CustomMonthYearPickerProps> = ({
  reloadData,
}) => {
  const [dateMonth, setDateMonth] = useState("");
  const handleMonthChange = (value: any) => {
    const formattedDate = dayjs(value).format("YYYY-MM");
    if (value) {
      setDateMonth(formattedDate);
      reloadData(formattedDate);
    } else {
      setDateMonth("");
      reloadData(formattedDate);
    }
  };

  useEffect(() => {
    const date = currentMonthYearFormatter();
    setDateMonth(date);
  }, []);
  return (
    <DatePicker
      value={dateMonth ? dayjs(dateMonth, "YYYY-MM") : null}
      onChange={handleMonthChange}
      allowClear={false}
      defaultValue={dayjs(dayjs().format("YYYY/MM"), "YYYY/MM")}
      format={"YYYY/MM"}
      picker="month"
    />
  );
};

export default CustomMonthYearPicker;
