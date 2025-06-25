import moment from "moment";
import { ProjectConfig } from "./Constants";
import { ServerAPI } from "./ServerAPI";
import { FormDataTypes } from "./DataTypes";
import toast from "react-hot-toast";

export const getURLExtension = (url: string) => {
  if (typeof url === "string") {
    return url.split(/[#?]/)[0].split(".").pop()?.trim();
  }
  return "";
};

export const getFormattedLocalDate = (utcDateTime: string) => {
  if (utcDateTime !== undefined && utcDateTime !== "" && utcDateTime != null) {
    return moment.utc(utcDateTime).local().format("DD/MM/YYYY");
  } else {
    return "N/A";
  }
};

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export const formatDateRange = (dateRangeStr: string) => {
  const [startDate, endDate] = dateRangeStr.split(" - ");
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return `${formattedStartDate} - ${formattedEndDate}`;
};

export const getUserToken = () => {
  let token = localStorage.getItem("access_token");
  if (token === null) {
    token = "";
  }
  return token;
};

export const getRole = () => {
  let rolename = localStorage.getItem("admin_role_name");
  if (rolename === null) {
    rolename = "";
  }
  return rolename;
};

export const getUserProfile = () => {
  let rolename = localStorage.getItem("profile");
  if (rolename === null) {
    rolename = "";
  }
  return rolename;
};

export const getFilenameExtension = (filename: string) => {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(filename);
  return ext && ext.length > 1 ? ext[1] : "";
};

export const getFormattedLocalDateTime = (utcDateTime: string) => {
  if (utcDateTime && utcDateTime !== "") {
    return moment
      .utc(utcDateTime)
      .utcOffset("05:30")
      .format("DD/MM/YYYY hh:mm a");
    // return moment.utc(utcDateTime).local().format('DD/MM/YYYY hh:mm a');
  }
  return "N/A";
};

export const getFormattedLocalTime = (utcDateTime: string) => {
  if (utcDateTime && utcDateTime !== "") {
    return moment.utc(utcDateTime).utcOffset("05:30").format("hh:mm a");
    // return moment.utc(utcDateTime).local().format('hh:mm a');
  }
  return "N/A";
};

export const getStringTruncated = (data: string) => {
  if (data !== undefined && data !== "" && data !== null) {
    let txt = data;
    if (txt.length > ProjectConfig.tableCellTruncateLength) {
      let newText =
        txt.substr(0, ProjectConfig.tableCellTruncateLength) + " ...";
      data = newText;
    }
    return data;
  } else {
    return "";
  }
};

export const getDisplayImageByURL = (url: string, extension?: string) => {
  const extn = extension ? extension : getURLExtension(url);
  if (extn === "png" || extn === "jpg" || extn === "jpeg") {
    return url;
    //return window.location.origin + "/assets/images/file_types/unknown.png";
  } else if (
    extn === "xls" ||
    extn === "xlsx" ||
    extn === "xlsm" ||
    extn === "xlsb" ||
    extn === "xltx" ||
    extn === "csv"
  ) {
    return window.location.origin + "/assets/images/file_types/xls.png";
  } else if (extn === "doc" || extn === "docx" || extn === "odt") {
    return window.location.origin + "/assets/images/file_types/doc.png";
  } else if (extn === "pdf") {
    return window.location.origin + "/assets/images/file_types/pdf.png";
  } else if (extn === "ppt" || extn === "pptx" || extn === "pptm") {
    return window.location.origin + "/assets/images/file_types/ppt.png";
  } else {
    return window.location.origin + "/assets/images/file_types/unknown.png";
  }
};

export const persistLoginDetail = (
  login: boolean,
  userID: string,
  userRole: string,
  token: string,
  profile: string
) => {
  localStorage.setItem("login", login ? "1" : "0");
  localStorage.setItem("user_id", userID);
  localStorage.setItem("admin_role_name", userRole);
  localStorage.setItem("profile", profile);
  localStorage.setItem("access_token", login && token ? token : "");
};
// export const persistLoginDetail = (login: boolean, firstName: string, middleName: string, lastName: string, accessToken: string, refreshToken: string) => {
//     localStorage.setItem('login', login ? '1' : '0');
//     localStorage.setItem('employee_first_name', firstName);
//     localStorage.setItem('employee_middle_name', middleName);
//     localStorage.setItem('employee_last_name', lastName);
//     localStorage.setItem('access_token', login && accessToken ? accessToken : '');
//     localStorage.setItem('refresh_token', login && refreshToken ? refreshToken : '');
// }

export const logout = () => {
  localStorage.removeItem("login");
  localStorage.removeItem("user_id");
  localStorage.removeItem("admin_role_name");
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};

export const getAccessToken = () => {
  let token = localStorage.getItem("access_token");
  if (token === null) {
    token = "";
  }
  return token;
};

export const getLoginEmployeeDetails = () => {
  let firstName = localStorage.getItem("employee_first_name");
  let middleName = localStorage.getItem("employee_middle_name");
  let lastName = localStorage.getItem("employee_last_name");
  return {
    first_name: firstName ? firstName : "",
    middle_name: middleName ? middleName : "",
    last_name: lastName ? lastName : "",
  };
};

export const frameSelectOptions = (
  data: any[],
  value_param: number | string,
  label_param: string,
  add_labels?: string[],
  separator?: string,
  separatorEnd?: string
) => {
  const selectOptions: FormDataTypes.SelectOption1[] = data.map((entry) => {
    let labelData = entry[label_param];
    if (add_labels) {
      add_labels.forEach((add_label) => {
        if (entry[add_label]) {
          labelData +=
            (separator ? separator : "-") +
            entry[add_label] +
            (separatorEnd ? separatorEnd : "");
        }
      });
    }

    return {
      value:
        typeof value_param === "number"
          ? Number(entry[value_param])
          : entry[value_param],
      label: labelData,
    };
  });
  return selectOptions;
};

export const getDataFromAPI = (
  apiEndPoint: string,
  stateSetter: any,
  addProcessing: any,
  reduceProcessing: any,
  params?: any,
  convertToSelectOptions?: boolean,
  key?: string | number,
  value?: string,
  responseKeyLevel1?: string,
  responseKeyLevel2?: string
) => {
  const respKeyLevel1 =
    responseKeyLevel1 !== undefined ? responseKeyLevel1 : "data";
  console.log("endpoint", apiEndPoint);
  addProcessing();
  ServerAPI.executeAPI(apiEndPoint, ServerAPI.APIMethod.GET, true, null, params)
    .then((response) => {
      let responseData: any[] = [];
      if (responseKeyLevel2 !== undefined) {
        responseData = response[respKeyLevel1][responseKeyLevel2];
      } else {
        responseData = response[respKeyLevel1];
      }
      if (responseData !== undefined) {
        if (convertToSelectOptions) {
          let options = frameSelectOptions(
            responseData,
            (typeof key === "number" ? key : 0) ||
              (typeof key === "string" ? key : ""),
            value ? value : ""
          );

          stateSetter(options);
        } else {
          stateSetter(responseData);
        }
      } else {
        toast.error("Could not fetch the data");
      }
    })
    .finally(() => {
      reduceProcessing();
    });
};

export const getObjectKeyByValue = (
  object: { [key: string]: number },
  value: number
): string => {
  const matched = Object.keys(object).find((key) => object[key] === value);
  return matched ? matched : "";
};

export const dateFormatter = () => {
  const dateObj = new Date();
  const date = `${dateObj.getFullYear()}-${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
  return date;
};

export const extractKeys = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> =>
  keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
