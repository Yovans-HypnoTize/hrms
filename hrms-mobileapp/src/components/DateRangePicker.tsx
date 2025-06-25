import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const { RangePicker } = DatePicker;

const DateRangePicker = ({ tiggerAPIRequest }: any) => {
  const [dateRangeFrom, setDateRangeFrom] = useState("");
  const [dateRangeTo, setDateRangeTo] = useState("");
  const [dateRangeSet, setDateRangeSet] = useState(false);
  const [dayJSRange, setDayJSRange] = useState<[Dayjs?, Dayjs?]>([]);
  const handleRangeChange = (value: any) => {
    event?.stopPropagation();
    if (value) {
      setDateRangeFrom(dayjs(value[0]).format("YYYY-MM-DD"));
      setDateRangeTo(dayjs(value[1]).format("YYYY-MM-DD"));
      setDateRangeSet(true);
    } else {
      setDateRangeSet(false);
    }
  };

  useEffect(() => {
    if (dateRangeFrom && dateRangeTo) {
      tiggerAPIRequest({ dateRangeFrom, dateRangeTo });
    }
  }, [dateRangeFrom, dateRangeTo]);

  useEffect(() => {
    if (dateRangeFrom && dateRangeTo) {
      setDayJSRange([dayjs(dateRangeFrom), dayjs(dateRangeTo)]);
    }
  }, [dateRangeFrom, dateRangeTo]);

  const clearDateRange = () => {
    setDateRangeFrom("");
    setDateRangeTo("");
  };
  const reloadDataset = () => {
    let dateRange = { dateRangeFrom: "", dateRangeTo: "" };
    tiggerAPIRequest(dateRange);
  };
  return (
    <div
      className="d-flex align-items-center gap-3 my-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <RangePicker
        value={dateRangeSet ? (dayJSRange as [Dayjs, Dayjs]) : undefined}
        onChange={handleRangeChange}
        allowClear={false}
        getPopupContainer={() => document.body}
        popupStyle={{
          width: "100px",
        }}
      />
      {dateRangeSet && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDateRangeSet(false);
            clearDateRange();
            reloadDataset();
          }}
        >
          <CloseOutlinedIcon />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
