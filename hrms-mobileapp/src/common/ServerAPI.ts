import axios from "axios";
import { API } from "./Constants";
import toast from "react-hot-toast";
import * as Utilities from "./Utilities";

export namespace ServerAPI {
  export enum APIMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }

  export const executeAPI = async (
    endpoint: string,
    method: APIMethod,
    authRequired?: boolean,
    data?: any,
    params?: any,
    suppressError?: boolean
  ) => {
    let headers: { [k: string]: any } = {};
    if (authRequired) {
      const accessToken = await Utilities.getAccessToken();
      if (accessToken) {
        headers["Authorization"] = accessToken;
      }
    }

    if (method === APIMethod.POST || method === APIMethod.PUT) {
      headers["Content-Type"] = "application/json";
    }
    try {
      const response = await axios({
        method: method,
        url: endpoint,
        data: JSON.stringify(data),
        headers: headers,
        params: params,
      });
      if (response.status == 201 || response.status == 200) {
        return response.data;
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && !suppressError) {
        let errorMsg = "";
        if (error.response.data) {
          const errorData: any = error.response.data;
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        }
        if (errorMsg == "") {
          errorMsg = "Error Occurred in the Request!";
        }
        toast.error(errorMsg);
      }
    }
  };

  const downloadFile = async (
    endpoint: string,
    method: APIMethod,
    authRequired?: boolean,
    data?: any,
    params?: any,
    suppressError?: boolean
  ) => {
    let headers: { [k: string]: any } = {};
    if (authRequired) {
      const accessToken = await Utilities.getAccessToken();
      if (accessToken) {
        headers["Authorization"] = accessToken;
      }
    }

    axios({
      url: endpoint, // Replace 'YOUR_API_ENDPOINT' with the actual endpoint
      method: method,
      responseType: "blob", // Important
      params: params,
      data: JSON.stringify(data),
      headers: headers,
    })
      .then((response) => {
        // Create a new Blob object using the response data of the file
        const contentType = response.headers["content-type"];

        const contentDisposition = response.headers["content-disposition"];
        let filename = "download.xlsx"; // Default filename if not found
        if (contentDisposition) {
          const filenameMatch =
            contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch.length === 2) {
            filename = filenameMatch[1];
          }
        }

        const file = new Blob([response.data], { type: contentType });

        // Create a URL for the file
        const fileURL = URL.createObjectURL(file);

        // Create a temp <a> tag to trigger download
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.target = "_blank";
        fileLink.setAttribute("download", "employee_column_names.xlsx"); // or extract the filename from response.headers['content-disposition']
        document.body.appendChild(fileLink);

        fileLink.click();

        // Clean up and remove the link
        if (fileLink.parentNode) fileLink.parentNode.removeChild(fileLink);
        URL.revokeObjectURL(fileURL); // Free up memory
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
  };

  export const uploadFile = async (
    endpoint: string,
    file: any,
    authRequired?: boolean,
    params?: any,
    suppressError?: boolean
  ) => {
    let headers: { [k: string]: any } = {};
    headers["Content-Type"] = "multipart/form-data";
    if (authRequired) {
      const userToken = await Utilities.getUserToken();
      if (userToken) {
        headers["Authorization"] = userToken;
      }
    }
    const config = { headers: headers };

    let fd = new FormData();
    fd.append("file", file);

    if (params) {
      const queryString = new URLSearchParams(params).toString();
      endpoint = `${endpoint}?${queryString}`;
    }

    try {
      const response = await axios.post(endpoint, fd, config);

      if (response.status == 201 || response.status == 200) {
        return response.data;
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && !suppressError) {
        let errorMsg = "";
        if (error.response.data) {
          const errorData: any = error.response.data;
          if (errorData.message) {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          }
        }
        if (errorMsg == "") {
          errorMsg = "Error Occurred in the Request!";
        }
        toast.error(errorMsg);
      }
    }
  };

  export const uploadFileAndGetPath = async (file: any) => {
    return uploadFile(API.EndPoint.FILE_UPLOAD, file, true);
  };

  //testing-hrm
  export const userLogin = async (userName: string, password: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = userName;
    data["user_password"] = password;
    return executeAPI(API.EndPoint.USER_LOGIN, APIMethod.POST, false, data);
  };

  export const Logout = async () => {
    return executeAPI(API.EndPoint.LOGOUT, APIMethod.POST, true);
  };

  export const forgotPassword = async (userName: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = userName;
    return executeAPI(
      API.EndPoint.FORGOT_PASSWORD,
      APIMethod.POST,
      false,
      data
    );
  };

  export const otpVerify = async (userName: string, otp: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = userName;
    data["otp"] = otp;
    return executeAPI(API.EndPoint.OTP_VERIFY, APIMethod.POST, false, data);
  };

  export const resetPassword = async (USERID: string, newPassword: string, confirmPassword:string) => {
    let data: { [k: string]: any } = {};
    data["user_id"] = USERID;
    data["new_password"] = newPassword;
    data["confirm_password"] = confirmPassword;
    return executeAPI(API.EndPoint.RESET_PASSWORD, APIMethod.POST, false, data);
  };

  export const employeeLogin = async (userName: string, password: string) => {
    let data: { [k: string]: any } = {};
    data["username"] = userName;
    data["password"] = password;
    return executeAPI(API.EndPoint.EMPLOYEE_LOGIN, APIMethod.POST, false, data);
  };

  export const getEmployeeReportList = async () => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_REPORT}`,
      APIMethod.GET,
      true
    );
  };

  export const addCheckInOut = async (data: any) => {
    return executeAPI(
      API.EndPoint.CHECKIN_CHECKOUT,
      APIMethod.POST,
      true,
      data
    );
  };

  
  export const getEmployeeAttendenceHistoryLog = async (params: any) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DASHBOARD_LOG}?page_size=${params.page_size}&page_number=${params.page_number}&from_date=${params.from_date}&to_date=${params.to_date}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeCheckInOutStatus = async () => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_CHECKIN_OUT_STATUS}`,
      APIMethod.GET,
      true
    );
  };

  // export const addEmployeeReport = async (data: any) => {
  //   return executeAPI(API.EndPoint.EMPLOYEE_REPORT, APIMethod.POST, true, data);
  // };

  export const getEmployeeReportDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_REPORT}?employee_report_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const addLeaveRequest = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_LEAVE_REQUEST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeLeaveRequest = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_LEAVE_REQUEST}?leave_request_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addEmployeeLeaveRequest = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_LEAVE_REQUEST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeePendingLeaveRequest = async (
    data: any,
    id?: number
  ) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PENDING_LEAVE_REQUEST}?leave_request_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeLeaveRequestDetail = async (id: number) => {
    let params: { [k: string]: any } = {};
    params["leave_request_id"] = id;
    return executeAPI(
      API.EndPoint.EMPLOYEE_LEAVE_REQUEST,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const updateEmployeeReport = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_REPORT}?employee_report_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addEmployeeReport = async (data: any) => {
    return executeAPI(API.EndPoint.EMPLOYEE_REPORT, APIMethod.POST, true, data);
  };

  export const addCertifications = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_DOCUMENT,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateCertifications = async (data: any, id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DOCUMENT}/${id}`,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeAttendance = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_PENDING_ATTENDANCE,
      APIMethod.POST,
      true,
      data
    );
  };

  export const attendancePunch = async (punch: any) => {
    let data: { [k: string]: any } = {};
    data["state"] = punch;
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_ATTENDANCE_PUNCH}/${punch}`,
      APIMethod.POST,
      true,
      data
    );
  };

  export const employeeDashboard = async () => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_DASHBOARD,
      APIMethod.GET,
      true,
      false
    );
  };

  export const getEmployeeDetails = async () => {
    return executeAPI(API.EndPoint.EMPLOYEE_DETAIL, APIMethod.GET, true, false);
  };

  export const employeeLeaveRequest = async () => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_LEAVE_REQUEST,
      APIMethod.GET,
      true,
      false
    );
  };

  export const subordinateleaveRequestUpdate = async (
    id: number,
    status: number,
    remarks: string
  ) => {
    let data: { [k: string]: any } = {};
    data["approval_status"] = status;
    data["employee_leave_req_status_remarks"] = remarks;
    return executeAPI(
      `${API.EndPoint.SUBORDINATE_LEAVE_REQUEST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const updateSubordinateAttendance = async (data: any) => {
    return executeAPI(
      API.EndPoint.SUBORDINATE_PENDING_ATTENDANCE,
      APIMethod.PUT,
      true,
      data
    );
  };
}
