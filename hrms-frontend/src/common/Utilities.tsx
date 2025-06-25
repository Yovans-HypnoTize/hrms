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

export const getFilenameExtension = (filename: string) => {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(filename);
  return ext && ext.length > 1 ? ext[1] : "";
};

export const getFormattedLocalDate = (utcDateTime: string) => {
  if (utcDateTime !== undefined && utcDateTime !== "" && utcDateTime != null) {
    return moment.utc(utcDateTime).local().format("DD/MM/YYYY");
  } else {
    return "N/A";
  }
};

export const getMonthDate = (utcDateTime: string) => {
  if (utcDateTime && utcDateTime !== "") {
    const dateObj = new Date(utcDateTime);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
    };
    return dateObj.toLocaleDateString("en-US", options);
  } else {
    return "N/A";
  }
};

export const getFormattedLocalMonth = (utcDateTime: string) => {
  if (utcDateTime !== undefined && utcDateTime !== "" && utcDateTime != null) {
    return moment.utc(utcDateTime).local().format("MM/YYYY");
  } else {
    return "N/A";
  }
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
    console.log(url);
    
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
  profile:string,
  refresh_token:string,
) => {
  localStorage.setItem("login", login ? "1" : "0");
  localStorage.setItem("user_id", userID);
  localStorage.setItem("admin_role_name", userRole);
  localStorage.setItem("profile", profile);
  localStorage.setItem("access_token", login && token ? token : "");
  localStorage.setItem("refresh_token", login && refresh_token ? refresh_token : "");
};

export const persistLoginClientDetail = (
  clientID: number,
  clientName: string,
  companyID: number,
  companyName: string,
  profile:string
) => {
  localStorage.setItem("client_id", clientID + "");
  localStorage.setItem("client_name", clientName);
  localStorage.setItem("company_id", companyID + "");
  localStorage.setItem("company_name", companyName);
  localStorage.setItem("profile", profile);
};

export const clearCookies = () => {
  localStorage.removeItem("login");
  localStorage.removeItem("user_id");
  localStorage.removeItem("admin_role_name");
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};

export const getUserToken = () => {
  let token = localStorage.getItem("access_token");
  if (token === null) {
    token = "";
  }
  return token;
};

export const getRefreshToken = async () => {
  return localStorage.getItem("refresh_token");
};

export const removeAccessToken = async() => {
  return localStorage.removeItem("access_token")
}

export const setUserToken = async (token: string) => {
  localStorage.setItem("access_token", token);
};

export const getAdminRole = () => {
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

export const getLoginClientID = () => {
  let companyID = localStorage.getItem("client_id");
  return companyID ? parseInt(companyID) : 0;
};

export const getLoginCompanyID = () => {
  let companyID = localStorage.getItem("company_id");
  return companyID ? parseInt(companyID) : 0;
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
      console.log(response)
      let responseData: any[] = [];
      if (responseKeyLevel2 !== undefined) {
        responseData = response[respKeyLevel1][responseKeyLevel2];
      } else {
        responseData = response[respKeyLevel1];
        console.log(responseData);
        
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

export const getSelectOptionsForObject = (object: {
  [key: string]: number | string;
}): FormDataTypes.SelectOption[] => {
  const options: FormDataTypes.SelectOption[] = Object.keys(object).map(
    (key) => ({ label: key, value: object[key] + "" })
  );
  return options;
};

// export const fileToBinaryString = (file: any) => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = function (event) {
//             if (event.target && event.target.result) {
//                 resolve(event.target.result);
//             } else {
//                 reject(new Error("File could not be read."));
//             }
//         };
//         reader.onerror = function (error) {
//             reject(error);
//         };
//         reader.readAsBinaryString(file);
//     });
// }

export const fileToBinaryString = (file: any): string | ArrayBuffer | null => {
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  return reader.result;
};

export const convertTimeDurationToDecimal = (time: string): number => {
  // Split the time string into [hours, minutes, seconds]
  const parts = time.split(":").map((part) => parseInt(part, 10));

  // Convert hours, minutes, and seconds to decimal
  const hours = parts[0];
  const minutes = parts[1] / 60;
  const seconds = parts[2] / 3600;

  // Calculate the total in decimal format
  const totalHours = parseFloat((hours + minutes + seconds).toFixed(2));

  return totalHours;
};

export const convertTimeDecimalToDuration = (hoursDecimal: number): string => {
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(hoursDecimal);
  const minutes = Math.floor((hoursDecimal - hours) * 60);
  const seconds = Math.round(((hoursDecimal - hours) * 60 - minutes) * 60);

  // Format hours, minutes, and seconds to two digits
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const extractKeys = <T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => keys.reduce((acc, key) => {
  if (key in obj) {
      acc[key] = obj[key];
  }
  return acc;
}, {} as Pick<T, K>);

export const getHourFromTime = (time: string): number => {
  return Number(time.split(":")[0]);
};

export const dateFormatter = () => {
    const dateObj = new Date();
    const date = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
    return date;
  };

export const currentMonthYearFormatter = () => {
    const dateObj = new Date();
    const date = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}`;
    return date;
  };

  export const barGraphValueFormatter = (value: number | null | undefined) => {
    return value != null ? `₹ ${value}` : '--';
  };
  
  