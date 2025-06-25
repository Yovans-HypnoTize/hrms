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

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = await Utilities.getRefreshToken();
      if (!refreshToken) return false;

      const response = await axios.post(API.EndPoint.REFRESH_TOKEN, null, {
        headers: {
          Authorization: refreshToken,
        },
      });

      if (response.status === 200 && response.data.data.access_token) {
        console.log("set", response);
        await Utilities.removeAccessToken();
        await Utilities.setUserToken(response.data.data.access_token);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Refresh token failed", err);
      return false;
    }
  };

let isRefreshing = false;
let refreshTokenPromise: Promise<boolean> | null = null;

  // export const executeAPI = async (
  //   endpoint: string,
  //   method: APIMethod,
  //   authRequired?: boolean,
  //   data?: any,
  //   params?: any,
  //   suppressError?: boolean
  // ) => {
  //   let headers: { [k: string]: any } = {};
  //   if (authRequired) {
  //     const userToken = await Utilities.getUserToken();
  //     if (userToken) {
  //       headers["Authorization"] = userToken;
  //     }
  //   }

  //   if (method === APIMethod.POST || method === APIMethod.PUT) {
  //     headers["Content-Type"] = "application/json";
  //   }
  //   try {
  //     const response = await axios({
  //       method: method,
  //       url: endpoint,
  //       ...(method !== APIMethod.DELETE && { data: JSON.stringify(data) }),
  //       // data: JSON.stringify(data),
  //       headers: headers,
  //       params: params,
  //     });
  //     if (response.status === 201 || response.status === 200) {
  //       return response.data;
  //     } else {
  //       if (response.data.message) {
  //         toast.error(response.data.message);
  //       } else {
  //         toast.error("Something went wrong!");
  //       }
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response && !suppressError) {
  //       let errorMsg = "";
  //       if (error.response.data) {
  //         const errorData: any = error.response.data;
  //         if (errorData.message) {
  //           errorMsg = errorData.message;
  //         } else if (errorData.error) {
  //           errorMsg = errorData.error;
  //         }
  //       }
  //       if (errorMsg === "") {
  //         errorMsg = "Error Occurred in the Request!";
  //       }
  //       toast.error(errorMsg);
  //     }
  //   }
  // };
  export const executeAPI = async (
    endpoint: string,
    method: APIMethod,
    authRequired?: boolean,
    data?: any,
    params?: any,
    suppressError?: boolean
  ) => {
    let headers: { [k: string]: any } = {};
  
    const addAuthHeader = async () => {
      const token = await Utilities.getUserToken();
      if (token) headers["Authorization"] = token;
    };
  
    if (authRequired) await addAuthHeader();
    if (method === APIMethod.POST || method === APIMethod.PUT) {
      headers["Content-Type"] = "application/json";
    }
  
    const makeRequest = async () => {
      return await axios({
        method,
        url: endpoint,
        ...(method !== APIMethod.DELETE && { data: JSON.stringify(data) }),
        headers,
        params,
      });
    };
  
    try {
      const response = await makeRequest();
      if ([200, 201].includes(response.status)) return response.data;
      toast.error(response.data.message || "Something went wrong!");
    } catch (error: any) {
      const status = error?.response?.status;
      const isAuthError = axios.isAxiosError(error) && status === 401;
  
      if (isAuthError && authRequired) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenPromise = tryRefreshToken().finally(() => {
            isRefreshing = false;
          });
        }
  
        const success = await refreshTokenPromise;
        if (success) {
          // Retry the original request after refresh
          headers = {};
          await addAuthHeader();
          const retryResponse = await makeRequest();
          if ([200, 201].includes(retryResponse.status)) return retryResponse.data;
        } else {
          toast.error("Session expired. Please login again.");
          return;
        }
      }
  
      if (axios.isAxiosError(error) && error.response && !suppressError) {
        const msg =
          error.response.data?.message ||
          error.response.data?.error ||
          "Error Occurred in the Request!";
        toast.error(msg);
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
      const userToken = await Utilities.getUserToken();
      if (userToken) {
        headers["Authorization"] = userToken;
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
        fileLink.setAttribute("download", filename); // or extract the filename from response.headers['content-disposition']
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
    // fd.append("file", file);
    fd.append("image", file);

    if (params) {
      endpoint = `${endpoint}?company_id=${params}`;
    }

    try {
      const response = await axios.post(endpoint, fd, config);

      if (response.status === 201 || response.status === 200) {
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
        if (errorMsg === "") {
          errorMsg = "Error Occurred in the Request!";
        }
        toast.error(errorMsg);
      }
    }
  };

  export const uploadSeperateFile = async (
    endpoint: string,
    file: any,
    authRequired?: boolean,
    companyId?: string,
    fileUploadKey?: string,
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

    const config = { headers };

    let fd = new FormData();
    fd.append(`${fileUploadKey}`, file);
    if (companyId) {
      fd.append("company_id", companyId);
    }

    try {
      const response = await axios.post(endpoint, fd, config);

      if (response.status === 201 || response.status === 200) {
        return response.data;
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response && !suppressError) {
        let errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          "Error Occurred in the Request!";
        toast.error(errorMsg);
      }
    }
  };

  export const uploadFileAndGetPath = async (file: any) => {
    const role = await localStorage.getItem("admin_role_name");

    switch (role) {
      case "ADMIN":
      case "EMPLOYEE":
        return uploadFile(API.EndPoint.FILE_UPLOAD, file, true);
      case "CLIENT/EMPLOYER":
        return uploadFile(API.EndPoint.CLIENT_FILE_UPLOAD, file, true);
    }
  };

  // export const uploadFileAndGetPath = async (file: any) => {
  //   return uploadFile(API.EndPoint.FILE_UPLOAD, file, true);
  // };

  // export const clientUploadFileAndGetPath = async (file: any) => {
  //   return uploadFile(API.EndPoint.CLIENT_FILE_UPLOAD, file, true);
  // };

  export const AdminLogin = async (userName: string, password: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = userName;
    data["user_password"] = password;
    return executeAPI(API.EndPoint.EMPLOYER_LOGIN, APIMethod.POST, false, data);
  };

  export const Logout = async () => {
    return executeAPI(API.EndPoint.LOGOUT, APIMethod.POST, true);
  };

  export const ForgotPassword = async (userName: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = userName;
    return executeAPI(
      API.EndPoint.FORGOT_PASSWORD,
      APIMethod.POST,
      false,
      data
    );
  };

  export const OtpVerification = async (email: string, otp: string) => {
    let data: { [k: string]: any } = {};
    data["user_email"] = email;
    data["otp"] = otp;
    return executeAPI(API.EndPoint.OTP_VERIFY, APIMethod.POST, false, data);
  };

  export const ResetPassword = async (
    USERID: string,
    confirmPassword: string,
    newPassword: string
  ) => {
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
    return executeAPI(API.EndPoint.EMPLOYER_LOGIN, APIMethod.POST, false, data);
  };

  export const getCompaniesList = async () => {
    let params: { [k: string]: any } = {};
    return executeAPI(
      API.EndPoint.COMPANY_LIST,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getCountriesDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.COUNTRY_LIST}/${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateCountries = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.COUNTRY_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addCountries = async (data: any) => {
    return executeAPI(API.EndPoint.COUNTRY_LIST, APIMethod.POST, true, data);
  };

  export const addState = async (data: any) => {
    return executeAPI(API.EndPoint.STATE_LIST, APIMethod.POST, true, data);
  };

  export const getStateDetail = async (id: number) => {
    return executeAPI(`${API.EndPoint.STATE_LIST}/${id}`, APIMethod.GET, true);
  };

  export const updateState = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.STATE_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getClientsDetail = async (id: number) => {
    return executeAPI(`${API.EndPoint.CLIENT_LIST}/${id}`, APIMethod.GET, true);
  };

  export const updateClients = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addClients = async (data: any) => {
    return executeAPI(API.EndPoint.CLIENT_LIST, APIMethod.POST, true, data);
  };

  export const getBanksDetail = async (id: number) => {
    return executeAPI(`${API.EndPoint.BANK_LIST}/${id}`, APIMethod.GET, true);
  };

  export const updateBanks = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.BANK_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addBanks = async (data: any) => {
    return executeAPI(API.EndPoint.BANK_LIST, APIMethod.POST, true, data);
  };

  // export const getCompanyDetail = async (id: number) => {
  //   return executeAPI(
  //     `${API.EndPoint.CLIENT_COMPANY_LIST}?company_id=${id}`,
  //     APIMethod.GET,
  //     true
  //   );
  // };

  export const getCompanyDetail = async (id: number) => {
    const role = await localStorage.getItem("admin_role_name");
    switch (role) {
      case "ADMIN":
      case "EMPLOYEE":
        return executeAPI(
          `${API.EndPoint.COMPANY_LIST}?company_id=${id}`,
          APIMethod.GET,
          true
        );
      case "CLIENT/EMPLOYER":
        return executeAPI(
          `${API.EndPoint.CLIENT_COMPANY_LIST}?company_id=${id}`,
          APIMethod.GET,
          true
        );
    }
  };

  export const updateCompany = async (data: any, id?: number) => {
    const role = await localStorage.getItem("admin_role_name");
    switch (role) {
      case "ADMIN":
      case "EMPLOYEE":
        return executeAPI(
          `${API.EndPoint.COMPANY_LIST}?company_id=${id}`,
          APIMethod.PUT,
          true,
          data
        );
      case "CLIENT/EMPLOYER":
        return executeAPI(
          `${API.EndPoint.CLIENT_COMPANY_LIST}?company_id=${id}`,
          APIMethod.PUT,
          true,
          data
        );
    }
  };

  // export const updateCompany = async (data: any, id?: number) => {
  //   return executeAPI(
  //     `${API.EndPoint.COMPANY_LIST}?company_id=${id}`,
  //     APIMethod.PUT,
  //     true,
  //     data
  //   );
  // };

  // export const updateClientCompany = async (data: any, id?: number) => {
  //   return executeAPI(
  //     `${API.EndPoint.CLIENT_COMPANY_LIST}?company_id=${id}`,
  //     APIMethod.PUT,
  //     true,
  //     data
  //   );
  // };

  export const addCompany = async (data: any) => {
    return executeAPI(API.EndPoint.COMPANY_LIST, APIMethod.POST, true, data);
  };

  export const getCompanyLocationDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.COMPANY_LOCATION}/${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateCompanyLocation = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.COMPANY_LOCATION}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addCompanyLocation = async (data: any) => {
    return executeAPI(
      API.EndPoint.COMPANY_LOCATION,
      APIMethod.POST,
      true,
      data
    );
  };

  // export const getHolidayGroupDetail = async (id: number) => {
  //   return executeAPI(
  //     `${API.EndPoint.HOLIDAY_GROUPS}/${id}`,
  //     APIMethod.GET,
  //     true
  //   );
  // };

  export const getHolidayGroupDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_GROUPS}?company_holiday_group_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateHolidayGroup = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_GROUPS}?company_holiday_group_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addHolidayGroup = async (data: any) => {
    return executeAPI(API.EndPoint.HOLIDAY_GROUPS, APIMethod.POST, true, data);
  };

  export const getHolidayTypes = async () => {
    return executeAPI(API.EndPoint.HOLIDAY_TYPES, APIMethod.GET, true);
  };

  export const getHolidayTypeDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_TYPES}?company_holiday_type_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateHolidayType = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_TYPES}?company_holiday_type_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addHolidayType = async (data: any) => {
    return executeAPI(API.EndPoint.HOLIDAY_TYPES, APIMethod.POST, true, data);
  };

  export const getHolidayDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_LIST}?company_holiday_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateHoliday = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.HOLIDAY_LIST}?company_holiday_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addHoliday = async (data: any) => {
    return executeAPI(API.EndPoint.HOLIDAY_LIST, APIMethod.POST, true, data);
  };

  export const getPartnerDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.PARTNER_LIST}/${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updatePartner = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.PARTNER_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addPartner = async (data: any) => {
    return executeAPI(API.EndPoint.PARTNER_LIST, APIMethod.POST, true, data);
  };

  export const getDepartmentDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_DEPARTMENT_LIST}?company_department_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateDepartment = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_DEPARTMENT_LIST}?company_department_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addDepartment = async (data: any) => {
    return executeAPI(
      API.EndPoint.CLIENT_DEPARTMENT_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const getLeaveTypeDetail = async (id: number) => {
    return executeAPI(`${API.EndPoint.LEAVE_TYPES}/${id}`, APIMethod.GET, true);
  };

  export const updateLeaveType = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.LEAVE_TYPES}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addLeaveType = async (data: any) => {
    return executeAPI(API.EndPoint.LEAVE_TYPES, APIMethod.POST, true, data);
  };

  export const getRestDayGroupDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.REST_DAY_GROUPS}?company_weekoff_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateRestDayGroup = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.REST_DAY_GROUPS}?company_weekoff_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addRestDayGroup = async (data: any) => {
    return executeAPI(API.EndPoint.REST_DAY_GROUPS, APIMethod.POST, true, data);
  };

  export const getAttendancePolicyDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.ATTENDANCE_POLICY}?company_attendance_policy_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateAttendancePolicy = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.ATTENDANCE_POLICY}?company_attendance_policy_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addAttendancePolicy = async (data: any) => {
    return executeAPI(
      API.EndPoint.ATTENDANCE_POLICY,
      APIMethod.POST,
      true,
      data
    );
  };

  export const getWorkShiftDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.WORK_SHIFTS}?company_workshift_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateWorkShift = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.WORK_SHIFTS}?company_workshift_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addWorkShift = async (data: any) => {
    return executeAPI(API.EndPoint.WORK_SHIFTS, APIMethod.POST, true, data);
  };

  export const getSalaryComponentDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.SALARY_COMPONENTS}/${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateSalaryComponent = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.SALARY_COMPONENTS}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addSalaryComponent = async (data: any) => {
    return executeAPI(
      API.EndPoint.SALARY_COMPONENTS,
      APIMethod.POST,
      true,
      data
    );
  };

  export const getSalaryGroupDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.SALARY_GROUP}/${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateSalaryGroup = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.SALARY_GROUP}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addSalaryGroup = async (data: any) => {
    return executeAPI(API.EndPoint.SALARY_GROUP, APIMethod.POST, true, data);
  };

  export const getSalaryGroupComponents = async (
    salaryGroupID: number,
    componentCalcType?: number
  ) => {
    let params: { [k: string]: any } = {};
    params["salary_group_id"] = salaryGroupID;
    if (componentCalcType) {
      params["salary_component_calc_type"] = componentCalcType;
    }
    return executeAPI(
      API.EndPoint.SALARY_GROUP_COMPONENTS,
      ServerAPI.APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getPayrollGroups = async () => {
    return executeAPI(API.EndPoint.PAYROLL_GROUP, APIMethod.GET, true);
  };

  export const getFilteredPayrollGroups = async (
    payrollID: number,
    payrollCalcDaytype: number
  ) => {
    let params: { [k: string]: any } = {};
    params["payroll_group_id"] = payrollID;
    params["payroll_group_calc_per_day_salary_by"] = payrollCalcDaytype;
    return executeAPI(
      API.EndPoint.PAYROLL_GROUP,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getPayrollGroupDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.PAYROLL_GROUP}?company_payroll_group_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updatePayrollGroup = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.PAYROLL_GROUP}?company_payroll_group_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addPayrollGroup = async (data: any) => {
    return executeAPI(API.EndPoint.PAYROLL_GROUP, APIMethod.POST, true, data);
  };

  export const getUserDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.USER}?user_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateUser = async (data: any, id?: number) => {
    return executeAPI(`${API.EndPoint.USER}`, APIMethod.PUT, true, data);
  };

  export const addUser = async (data: any) => {
    return executeAPI(API.EndPoint.USER, APIMethod.POST, true, data);
  };

  export const getDesignationDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_DESIGNATION_LIST}?company_designation_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateDesignation = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_DESIGNATION_LIST}?company_designation_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addDesignation = async (data: any) => {
    return executeAPI(
      API.EndPoint.CLIENT_DESIGNATION_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const getLeaveCreditDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.LEAVE_CREDITS}?leave_credit_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateLeaveCredit = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.LEAVE_CREDITS}?leave_credit_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addLeaveCredit = async (data: any) => {
    return executeAPI(API.EndPoint.LEAVE_CREDITS, APIMethod.POST, true, data);
  };

  export const getLeavePlanDetail = async (id: number) => {
    return executeAPI(`${API.EndPoint.LEAVE_PLAN}/${id}`, APIMethod.GET, true);
  };

  export const updateLeavePlan = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.LEAVE_PLAN}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addLeavePlan = async (data: any) => {
    return executeAPI(API.EndPoint.LEAVE_PLAN, APIMethod.POST, true, data);
  };
  export const getworkShiftCompensationDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_WORK_TIME_COMPENSATIONS_LIST}?company_workshift_pay_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const updateworkShiftCompensation = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_WORK_TIME_COMPENSATIONS_LIST}?company_workshift_pay_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addworkShiftCompensation = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYER_WORK_TIME_COMPENSATIONS_LIST,
      APIMethod.POST,
      true,
      data
    );
  };
  export const getLeaveRequestDetail = async (id: number) => {
    let params: { [k: string]: any } = {};
    params["leave_request_id"] = id;
    return executeAPI(
      API.EndPoint.LEAVE_REQUEST,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const updateLeaveRequest = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.LEAVE_REQUEST}?leave_request_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addLeaveRequest = async (data: any) => {
    return executeAPI(API.EndPoint.LEAVE_REQUEST, APIMethod.POST, true, data);
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

  export const getEmployeeReportList = async () => {
    return executeAPI(`${API.EndPoint.EMPLOYEE_REPORT}`, APIMethod.GET, true);
  };

  export const getEmployeeReportDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_REPORT}?employee_report_id=${id}`,
      APIMethod.GET,
      true
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

  // export const addLeaveRequest = async (data: any, id: number) => {
  //   let params: { [k: string]: any } = {};
  //   params["employee_id"] = id;
  //   return executeAPI(
  //     API.EndPoint.LEAVE_REQUEST,
  //     APIMethod.POST,
  //     true,
  //     data,
  //     params
  //   );
  // };

  export const addEmployee = async (data: any) => {
    return executeAPI(API.EndPoint.EMPLOYEES_LIST, APIMethod.POST, true, data);
  };

  export const generatePayroll = async (data: any) => {
    return executeAPI(
      API.EndPoint.CLIENT_PAYROLL_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployee = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_LIST}?employee_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeDetails = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_LIST}?employee_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const downloadEmployeeExcelTemplate = async () => {
    return downloadFile(
      `${API.EndPoint.EMPLOYEES_DOWNLOAD_TEMPLATE}`,
      APIMethod.GET,
      true
    );
  };

  export const downloadAttendanceExcelTemplate = async () => {
    return downloadFile(
      `${API.EndPoint.EMPLOYEES_ATTENDANCE_DOWNLOAD_TEMPLATE}`,
      APIMethod.GET,
      true
    );
  };

  export const deleteMultipleEntry = async (data: any) => {
    return executeAPI(
      API.EndPoint.ATTENDANCE_BULK_DELETE,
      APIMethod.POST,
      true,
      data
    );
  };

  export const downloadEmpoyeePayrollExcelTemplate = async (id: number) => {
    let params: { [k: string]: any } = {};
    params["payroll_id"] = id;
    return downloadFile(
      `${API.EndPoint.EMPLOYEES_PAYROLL_DOWNLOAD_TEMPLATE}`,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const addSuperiorEmployee = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEES_SUPERIOR_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const getEmployeeSuperior = async (employeeSuperiorID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_SUPERIOR_LIST}/${employeeSuperiorID}`,
      APIMethod.GET,
      true
    );
  };

  export const updateSuperiorEmployee = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_SUPERIOR_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };
  export const getSuperiorEmployeeHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEES_SUPERIOR_LIST,
      APIMethod.GET,
      true
    );
  };
  export const getEmployeePayrollHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEE_PAYROLL_GROUPS,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const addEmployeePayrollGroup = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_PAYROLL_GROUPS,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeePayrollGroup = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PAYROLL_GROUPS}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeePayrollGroup = async (employeePayrollID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PAYROLL_GROUPS}/${employeePayrollID}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeAttendanceHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYER_ATTENDANCE_POLICIES,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const employeeAttendanceBulkUpload = async (
    file: any,
    companyID: number
  ) => {
    return uploadFile(
      API.EndPoint.ATTENDANCE_BULK_ADD + "/" + companyID,
      file,
      true
    );
  };
  // export const employeesBulkUpload = async (file: any) => {
  //   // let params: { [k: string]: any } = {};
  //   // params["company_id"] = employeeID;
  //   const companyId = Utilities.getLoginCompanyID();
  //   return uploadFile(API.EndPoint.EMPLOYEE_BULK_ADD, file, true, companyId);
  // };

  export const employeesBulkUpload = async (file: any, companyId: string) => {
    console.log("server api", file, companyId);
    const fileUploadKey = "employee_excel";
    return await uploadSeperateFile(
      API.EndPoint.CLIENT_EMPLOYEE_BULK_ADD,
      file,
      true,
      companyId,
      fileUploadKey
    );
  };

  export const employeesAttendanceBulkUpload = async (
    file: any,
    companyId: string
  ) => {
    console.log("server api", file, companyId);
    const fileUploadKey = "employee_attendance_excel";
    return await uploadSeperateFile(
      API.EndPoint.EMPLOYEE_ATTENDANCE_BULK_ADD,
      file,
      true,
      companyId,
      fileUploadKey
    );
  };

  export const addEmployeeAttendancePolicy = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYER_ATTENDANCE_POLICIES,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeAttendancePolicy = async (
    data: any,
    id?: number
  ) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_ATTENDANCE_POLICIES}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeAttendandePolicy = async (
    employeeAttendanceID: number
  ) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_ATTENDANCE_POLICIES}/${employeeAttendanceID}`,
      APIMethod.GET,
      true
    );
  };

  export const addEmployerProject = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYER_PROJECT_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployerProject = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_PROJECT_LIST}?company_project_id=${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployerProjectListById = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_PROJECT_LIST}?company_project_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeStatusHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEE_STATUS,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const addEmployeeStatus = async (data: any) => {
    return executeAPI(API.EndPoint.EMPLOYEE_STATUS, APIMethod.POST, true, data);
  };

  export const updateEmployeeStatus = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_STATUS}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeStatus = async (employeeStatusID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_STATUS}/${employeeStatusID}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeLocationHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEE_LOCATION,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const addEmployeeLocation = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_LOCATION,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeLocation = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_LOCATION}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };
  export const getEmployeeLocation = async (employeeLocationID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_LOCATION}/${employeeLocationID}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeDepartmentHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEE_DEPARTMENT,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const addEmployeeDepartment = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_DEPARTMENT,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeDepartment = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DEPARTMENT}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeDepartment = async (employeeDepartmentID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DEPARTMENT}/${employeeDepartmentID}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeDesignationHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      API.EndPoint.EMPLOYEE_DESIGNATION,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getEmployeeDesignation = async (
    employeeDesignationID: number
  ) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DESIGNATION}/${employeeDesignationID}`,
      APIMethod.GET,
      true
    );
  };

  export const addEmployeeDesignation = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEE_DESIGNATION,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeDesignation = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_DESIGNATION}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const addEmployeeSalary = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEES_SALARY_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeSalary = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_SALARY_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeSalaryGroup = async (employeeSalaryID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_SALARY_LIST}/${employeeSalaryID}`,
      APIMethod.GET,
      true
    );
  };

  export const getEmployeeSalaryHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_SALARY_LIST}`,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getLeavePlanHistory = async (employeeID: number) => {
    let params: { [k: string]: any } = {};
    params["employee_id"] = employeeID;
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_LEAVE_PLAN_LIST}`,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getDashboard = async () => {
    return executeAPI(
      `${API.EndPoint.EMPLOYER_DASHBOARD}`,
      APIMethod.GET,
      true
    );
  };

  export const getAdminDashboard = async (params: any) => {
    // return executeAPI(API.EndPoint.EMPLOYEE_DASHBOARD_LOG, APIMethod.GET, true);
    return executeAPI(
      `${API.EndPoint.ADMIN_DASHBOARD}?page_size=${params.page_size}&page_number=${params.page_number}&search=${params.search}`,
      APIMethod.GET,
      true
    );
  };

  // export const getAdminDashboard = async () => {
  //   return executeAPI(
  //     `${API.EndPoint.ADMIN_DASHBOARD}`,
  //     APIMethod.GET,
  //     true
  //   );
  // };

  // export const getDashboard = async () => {
  //   return executeAPI(
  //     `${API.EndPoint.EMPLOYEES_DASHBOARD}`,
  //     APIMethod.GET,
  //     true
  //   );
  // };

  export const addEmployeeLeavePlan = async (data: any) => {
    return executeAPI(
      API.EndPoint.EMPLOYEES_LEAVE_PLAN_LIST,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updateEmployeeLeavePlan = async (data: any, id?: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_LEAVE_PLAN_LIST}/${id}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getEmployeeLeavePlan = async (employeeLeavePlanID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEES_LEAVE_PLAN_LIST}/${employeeLeavePlanID}`,
      APIMethod.GET,
      true
    );
  };

  export const getPayrollManualComponents = async (
    payrollGroupID: number,
    month: string
  ) => {
    let params: { [k: string]: any } = {};
    params["payroll_group_id"] = payrollGroupID;
    params["pay_run_month"] = month;
    return executeAPI(
      API.EndPoint.EMPLOYEE_PAYROLL_MANUAL_COMPONENTS,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const getPayslipDetail = async (id: number) => {
    return executeAPI(
      `${API.EndPoint.PAYSLIP_GENERATE}?payslip_id=${id}`,
      APIMethod.GET,
      true
    );
  };

  export const getPayrollManualComponentValues = async (payrollID: number) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PAYROLL_MANUAL_VALUES}/${payrollID}`,
      APIMethod.GET,
      true
    );
  };

  export const getPayslipGenerate = async (payrollID: number) => {
    return executeAPI(
      `${API.EndPoint.PAYSLIP_REGENERATE}/${payrollID}`,
      APIMethod.GET,
      true
    );
  };

  export const addPayrollManualValues = async (data: any) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PAYROLL_MANUAL_VALUES}`,
      APIMethod.POST,
      true,
      data
    );
  };

  export const updatePayrollManualValues = async (
    data: any,
    payrollID: number
  ) => {
    return executeAPI(
      `${API.EndPoint.EMPLOYEE_PAYROLL_MANUAL_VALUES}/${payrollID}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const regeneratePayrun = async (data: any) => {
    return executeAPI(
      `${API.EndPoint.MONTH_PAYROLLS}`,
      APIMethod.PUT,
      true,
      data
    );
  };

  export const getMonthlyPayrollList = async (params: any) => {
    return executeAPI(
      `${API.EndPoint.CLIENT_PAYROLL_LIST}?page_size=${params.page_size}&page_number=${params.page_number}&payroll_month=${params.payroll_month}&search=${params.search}`,
      APIMethod.GET,
      true
    );
  };

  // export const addCheckInOut = async (data: any) => {
  //   return executeAPI(
  //     API.EndPoint.EMPLOYEE_CHECKIN_OUT_STATUS,
  //     APIMethod.POST,
  //     true,
  //     data
  //   );
  // };

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

  // export const getMonthlyPayrollListByGroup = async (
  //   payrollGroupID: number,
  //   month: string
  // ) => {
  //   let params: { [k: string]: any } = {};
  //   params["payroll_group_id"] = payrollGroupID;
  //   params["pay_run_month"] = month;
  //   return executeAPI(
  //     API.EndPoint.MONTH_PAYROLLS,
  //     APIMethod.GET,
  //     true,
  //     null,
  //     params
  //   );
  // };

  export const getTotalPayrun = async (payrollID: number) => {
    let params: { [k: string]: any } = {};
    params["payroll_id"] = payrollID;
    return executeAPI(
      API.EndPoint.TOTAL_PAYRUN,
      APIMethod.GET,
      true,
      null,
      params
    );
  };

  export const createMonthlyPayRun = async (data: any) => {
    return executeAPI(API.EndPoint.MONTH_PAYROLLS, APIMethod.POST, true, data);
  };
}
