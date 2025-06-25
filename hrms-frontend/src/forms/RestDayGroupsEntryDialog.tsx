import { Drawer, FormHelperText } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import toast from "react-hot-toast";
import {
  getDataFromAPI,
} from "../common/Utilities";
import { useAppStateAPI } from "../common/AppStateAPI";
import {
  API,
  ProjectStrings,

} from "../common/Constants";
import { ServerAPI } from "../common/ServerAPI";
import * as Yup from "yup";

const RestDayGroupsEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  reloadData: any;
  id?: number;
}> = ({ showDialog, closeDialog, reloadData, id }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<any>(
    InitialData.RestDayGroups
  );
  const [editMode, setEditMode] = useState(false);
  const [formDataSet, setFormDataSet] = useState(false);

  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [weekDayOptions, setWeekDayOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [dayTypeOptions, setDayTypeOptions] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [groupDetailResponse, setGroupDetailResponse] = useState<any>();
  const [validateFieldOnChange, setValidateFieldOnchange] = useState<boolean>(false)
  // const weekOffAliveOptions: FormDataTypes.SelectOption[] = [
  //   { label: "Yes", value: "1" },
  //   { label: "No", value: "0" },
  // ];

  useEffect(() => {
    getDataFromAPI(
      API.EndPoint.CLIENT_COMPANY_LIST,
      setCompanyOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_id",
      "company_name",
      "data",
      "companies"
    );
    setFormDataSet(true);
    getDataFromAPI(
      API.EndPoint.MASTER_WEEKDAY_TYPE,
      setWeekDayOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "weekday_id",
      "weekday_name",
      "data"
    );
    getDataFromAPI(
      API.EndPoint.MASTER_DAY_TYPE,
      setDayTypeOptions,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "day_type_id",
      "day_type_name",
      "data"
    );
    setFormDataSet(true);
    setInitialValue((prev:any) => {return {...prev}})
    // setInitialValue((prev:any) => {return {...prev, company_weekoff_status:"0"}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getRestDayGroupDetail(id)
        .then((response) => {
          if (response) {
            setGroupDetailResponse(response);
            const newData: any = {
              company_id: response.company_id,
              company_weekoff_id: response.company_weekoff_id,
              company_weekoff_name: response.company_weekoff_name,
              // company_weekoff_status:
              //   response.company_weekoff_status === true ? "1" : "0",
            };

            // Extract day_type_id for each weekday and add it to newData
            response.company_weekoff_day.forEach((day: any) => {
              console.log(`weekday_id${day.weekday_id}`, day.day_type_id);
              newData[`weekday_id${day.weekday_id}`] = day.day_type_id;
            });

            console.log("data for update", newData);
            setInitialValue(newData);
            // setInitialValue(response);
            setFormDataSet(true);
            setEditMode(true);
          }
        })
        .finally(() => {
          reduceProcessingRequests();
        });
    } else {
      setFormDataSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setFormDataSet(true);
  }, []);

  const yupSchema = Yup.object().shape({
    company_weekoff_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    ...weekDayOptions.reduce((acc: any, day: any) => {
      acc[`weekday_id${day.value}`] = Yup.string().required(
        ProjectStrings.ValidationRequired
      );
      return acc;
    }, {}),
  });
  

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-min"
    >
      {formDataSet && (
        <Formik
          enableReinitialize={true}
          validateOnChange={validateFieldOnChange}
          // validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            const result = Object.keys(submitValues)
              .filter((key) => key.startsWith("weekday_id"))
              .map((key) => {
                const weekday_id = Number(key.replace("weekday_id", ""));
                const day_type_id = submitValues[key];
                delete submitValues[key]; // Remove the key from submitValues
                return { weekday_id, day_type_id };
              });

            submitValues["company_weekoff_day"] = result;

            if (id !== undefined && id !== 0) {
              submitValues["company_weekoff_day"] =
                submitValues.company_weekoff_day.map((item: any) => {
                  return {
                    ...item,
                    company_weekoff_day_id:
                      groupDetailResponse.company_weekoff_day.find(
                        (day: any) => day.weekday_id === item.weekday_id
                      )?.company_weekoff_day_id || null,
                  };
                });
              // submitValues["company_weekoff_status"] =
              //   submitValues.company_weekoff_status === "1" ? true : false;
              console.log("values to update", submitValues);
              addProcessingRequests();
              ServerAPI.updateRestDayGroup(submitValues, id)
                .then((response) => {
                  if (response && response["message"]) {
                    toast.success(response["message"]);
                    reloadData();
                    closeDialog();
                  } else if (response && response["message"]) {
                    toast.error(response["message"]);
                  }
                })
                .finally(() => {
                  setSubmitting(false);
                  reduceProcessingRequests();
                });
            } else {
              // submitValues["company_weekoff_status"] =
              //   submitValues.company_weekoff_status === "1" ? true : false;

              addProcessingRequests();
              ServerAPI.addRestDayGroup(submitValues)
                .then((response) => {
                  if (response && response["message"]) {
                    toast.success(response["message"]);
                    reloadData();
                    closeDialog();
                  } else if (response && response["message"]) {
                    toast.error(response["message"]);
                  }
                })
                .finally(() => {
                  setSubmitting(false);
                  reduceProcessingRequests();
                });
            }
          }}
        >
          {(formikProps) => {
            return (
              <div className="tabdetails">
                <p className="detailed-heading mt-3">
                  {editMode ? "Edit" : "Add New"} Rest Day Group
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row px-2 py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Company",
                            name: "company_id",
                            placeholder: "Select Company",
                            options: companyOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-2">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Rest Group Name",
                            name: "company_weekoff_name",
                            placeholder: "Enter rest group Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row px-1">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">

                    {weekDayOptions.map((day) => {
                      return (
                        <div className="pt-2 ">
                          <div className="row px-2">
                            <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                              <FormField
                                formik={formikProps}
                                fieldProps={{
                                  fieldType: "radioGroupOptions",
                                  label: `${day.label}`,
                                  name: `weekday_id${day.value}`,
                                  placeholder: "Select Day Type",
                                  options: dayTypeOptions.filter(
                                    // eslint-disable-next-line array-callback-return
                                    (item: any) => {
                                      if (
                                        item.value !== 1 &&
                                        item.value !== 4
                                      ) {
                                        return item;
                                      }
                                    }
                                  ),
                                  required: true,
                                }}
                              />
                               {/* <ErrorMessage
                                        component={FormHelperText}
                                        name={`weekday_id${day.value}`}
                                        className="form-error-text"
                                      /> */}
                              {validateFieldOnChange && formikProps.errors[`weekday_id${day.value}`] && formikProps.errors[`weekday_id${day.value}`] && <div id="feedback" className="required-text">Required</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </div>  
                   
                    {/* <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "radio",
                            label: "Workshift Status",
                            name: "company_weekoff_status",
                            options: weekOffAliveOptions,
                            required: true,
                          }}
                        />
                      </div>
                    </div> */}
                    
                  </div>
                  <div className="row btn-form-submit">
                    <button
                      type="button"
                      className="button1"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button2"
                      disabled={formikProps.isSubmitting}
                      onClick={() => {
                        setValidateFieldOnchange(true)
                        formikProps.submitForm();
                        if (!formikProps.isValid) {
                          toast.error(
                            "Please ensure all fields are Filled and Valid!"
                          );
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </Drawer>
  );
};

export default RestDayGroupsEntryDialog;

// import { Drawer, FormHelperText } from "@mui/material";
// import { ErrorMessage, Form, Formik } from "formik";
// import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from "formik";
// import React, { useEffect, useState } from "react";
// import FormField from "../components/form-items/FormField";
// import { APIData, FormDataTypes } from "../common/DataTypes";
// import { InitialData } from "./InitialData";
// import toast from "react-hot-toast";
// import {
//   getDataFromAPI,
//   getObjectKeyByValue,
//   getLoginCompanyID,
// } from "../common/Utilities";
// import { useAppStateAPI } from "../common/AppStateAPI";
// import {
//   API,
//   ProjectStrings,
//   ProjectStrings,
//   RestDays,
//   RestrictedWeeks,
//   WorkTimeDayType,
// } from "../common/Constants";
// import { ServerAPI } from "../common/ServerAPI";
// import * as Yup from "yup";

// const RestDayGroupsEntryDialog: React.FC<{
//   showDialog: boolean;
//   closeDialog: () => void;
//   reloadData: any;
//   id?: number;
// }> = ({ showDialog, closeDialog, reloadData, id }) => {
//   const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
//   const [initialValue, setInitialValue] = useState<APIData.RestDayGroups>(
//     InitialData.RestDayGroups
//   );
//   const [editMode, setEditMode] = useState(false);
//   const [formDataSet, setFormDataSet] = useState(false);

//   const restDayOptions: FormDataTypes.SelectOption[] = [
//     { label: "Sunday", value: RestDays.Sunday + "" },
//     { label: "Monday", value: RestDays.Monday + "" },
//     { label: "Tuesday", value: RestDays.Tuesday + "" },
//     { label: "Wednesday", value: RestDays.Wednesday + "" },
//     { label: "Thursday", value: RestDays.Thursday + "" },
//     { label: "Friday", value: RestDays.Friday + "" },
//     { label: "Saturday", value: RestDays.Saturday + "" },
//     { label: "Sunday", value: RestDays.Sunday + "" },
//   ];

//   const weekTypeOptions: FormDataTypes.SelectOption[] = [
//     { label: "All", value: RestrictedWeeks.All + "" },
//     { label: "Restricted", value: RestrictedWeeks.Restricted + "" },
//   ];
//   const restrictedWeeksOptions: FormDataTypes.SelectOption[] = [
//     { label: "1", value: "1" },
//     { label: "2", value: "2" },
//     { label: "3", value: "3" },
//     { label: "4", value: "4" },
//     { label: "5", value: "5" },
//     { label: "6", value: "6" },
//     { label: "7", value: "7" },
//   ];
//   const [companyOption, setCompanyOption] = useState<
//     FormDataTypes.SelectOption[]
//   >([]);
//   const [weekDayOptions, setWeekDayOptions] = useState<
//     FormDataTypes.SelectOption[]
//   >([]);
//   const [dayTypeOptions, setDayTypeOptions] = useState<
//     FormDataTypes.SelectOption[]
//   >([]);
//   const [groupDetailResponse, setGroupDetailResponse] = useState<any>();
//   const weekOffAliveOptions: FormDataTypes.SelectOption[] = [
//     { label: "Yes", value: "1" },
//     { label: "No", value: "0" },
//   ];

//   useEffect(() => {
//     getDataFromAPI(
//       API.EndPoint.CLIENT_COMPANY_LIST,
//       setCompanyOption,
//       addProcessingRequests,
//       reduceProcessingRequests,
//       null,
//       true,
//       "company_id",
//       "company_name",
//       "data",
//       "companies"
//     );
//     setFormDataSet(true);
//     getDataFromAPI(
//       API.EndPoint.MASTER_WEEKDAY_TYPE,
//       setWeekDayOptions,
//       addProcessingRequests,
//       reduceProcessingRequests,
//       null,
//       true,
//       "weekday_id",
//       "weekday_name",
//       "data"
//     );
//     getDataFromAPI(
//       API.EndPoint.MASTER_DAY_TYPE,
//       setDayTypeOptions,
//       addProcessingRequests,
//       reduceProcessingRequests,
//       null,
//       true,
//       "day_type_id",
//       "day_type_name",
//       "data"
//     );
//     setFormDataSet(true);
//     setInitialValue(prev => {return {...prev, company_weekoff_status:"0"}})
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (id !== undefined && id !== 0) {
//       addProcessingRequests();
//       ServerAPI.getRestDayGroupDetail(id)
//         .then((response) => {
//           if (response) {
//             setGroupDetailResponse(response);
//             const newData: any = {
//               company_id: response.company_id,
//               company_weekoff_id: response.company_weekoff_id,
//               company_weekoff_name: response.company_weekoff_name,
//               company_weekoff_status:
//                 response.company_weekoff_status === true ? "1" : "0",
//             };

//             // Extract day_type_id for each weekday and add it to newData
//             response.company_weekoff_day.forEach((day: any) => {
//               console.log(`weekday_id${day.weekday_id}`, day.day_type_id);
//               newData[`weekday_id${day.weekday_id}`] = day.day_type_id;
//             });

//             console.log("data for update", newData);
//             setInitialValue(newData);
//             // setInitialValue(response);
//             setFormDataSet(true);
//             setEditMode(true);
//           }
//         })
//         .finally(() => {
//           reduceProcessingRequests();
//         });
//     } else {
//       setFormDataSet(true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   useEffect(() => {
//     setFormDataSet(true);
//   }, []);

//   useEffect(() => {
//     if (id !== undefined && id !== 0) {
//       addProcessingRequests();
//       ServerAPI.getRestDayGroupDetail(id)
//         .then((response) => {
//           if (response) {
//             let restDayGroup: APIData.RestDayGroups = { ...response };
//             let populateDays = Object.entries(RestDays).map(([key, value]) => {
//               const matchWeek = restDayGroup.rest_days.find(
//                 (day) => day.rest_day_of_week === value
//               );
//               if (matchWeek) {
//                 return {
//                   rest_day_of_week: matchWeek.rest_day_of_week,
//                   rest_day_type: WorkTimeDayType.RestDay,
//                   rest_day_week_type: matchWeek.rest_day_week_type,
//                   rest_day_restricted_weeks: matchWeek.rest_day_restricted_weeks
//                     ? matchWeek.rest_day_restricted_weeks
//                     : [],
//                 };
//               } else {
//                 return {
//                   rest_day_of_week: value,
//                   rest_day_type: WorkTimeDayType.RegularDay,
//                   rest_day_week_type: 0,
//                   rest_day_restricted_weeks: [],
//                 };
//               }
//             });
//             console.log("Framed Rest Days", populateDays);
//             restDayGroup.rest_days = populateDays;
//             setInitialValue(restDayGroup);
//             setFormDataSet(true);
//             setEditMode(true);
//           }
//         })
//         .finally(() => {
//           reduceProcessingRequests();
//         });
//     } else {
//       setInitialValue({
//         ...initialValue,
//         rest_days: Object.entries(RestDays).map(([key, value]) => ({
//           rest_day_of_week: value,
//           rest_day_type: 0,
//           rest_day_week_type: 0,
//           rest_day_restricted_weeks: [],
//         })),
//       });
//       setFormDataSet(true);
//     }
//   }, [id]);

//   useEffect(() => {
//     console.log("Initial Values", initialValue);
//   }, [initialValue]);

//   const yupSchema = Yup.object().shape({
//     company_weekoff_name: Yup.string().required(
//       ProjectStrings.ValidationRequired
//     ),
//     company_id: Yup.string()
//       .notOneOf(["0"], ProjectStrings.ValidationSelect)
//       .required(ProjectStrings.ValidationRequired),
//     ...weekDayOptions.reduce((acc: any, day: any) => {
//       acc[`weekday_id${day.value}`] = Yup.string().required(
//         ProjectStrings.ValidationRequired
//       );
//       return acc;
//     }, {}),
//     rest_days: Yup.array().of(
//       Yup.object().shape({
//         rest_day_type: Yup.number()
//           .notOneOf([0], ProjectStrings.ValidationSelect)
//           .required(ProjectStrings.ValidationRequired),
//       })
//     ),
//   });

//   return (
//     <Drawer
//       anchor="right"
//       open={showDialog}
//       onClose={closeDialog}
//       className="drawer-min"
//     >
//       {formDataSet && (
//         <Formik
//           enableReinitialize={true}
//           validateOnChange={false}
//           validationSchema={yupSchema}
//           initialValues={initialValue}
//           onSubmit={(values, { setSubmitting }) => {
//             // console.log(values)
//             let submitValues: any = { ...values };
//             const result = Object.keys(submitValues)
//               .filter((key) => key.startsWith("weekday_id"))
//               .map((key) => {
//                 const weekday_id = Number(key.replace("weekday_id", ""));
//                 const day_type_id = submitValues[key];
//                 delete submitValues[key]; // Remove the key from submitValues
//                 return { weekday_id, day_type_id };
//               });

//             submitValues["company_weekoff_day"] = result;

//             // submitValues.rest_days = values.rest_days.filter(
//             //   (restDay) =>
//             //     parseInt(restDay.rest_day_type + "") === WorkTimeDayType.RestDay
//             // );
//             if (id !== undefined && id !== 0) {
//               submitValues["company_weekoff_day"] =
//                 submitValues.company_weekoff_day.map((item: any) => {
//                   return {
//                     ...item,
//                     company_weekoff_day_id:
//                       groupDetailResponse.company_weekoff_day.find(
//                         (day: any) => day.weekday_id === item.weekday_id
//                       )?.company_weekoff_day_id || null,
//                   };
//                 });
//               submitValues["company_weekoff_status"] =
//                 submitValues.company_weekoff_status === "1" ? true : false;
//               console.log("values to update", submitValues);
//               addProcessingRequests();
//               ServerAPI.updateRestDayGroup(submitValues, id)
//                 .then((response) => {
//                   if (response && response["message"]) {
//                     toast.success(response["message"]);
//                     reloadData();
//                     closeDialog();
//                   } else if (response && response["message"]) {
//                     toast.error(response["message"]);
//                   }
//                 })
//                 .finally(() => {
//                   setSubmitting(false);
//                   reduceProcessingRequests();
//                 });
//             } else {
//               submitValues["company_weekoff_status"] =
//                 submitValues.company_workshift_status === "1" ? true : false;
//               // submitValues['company_id'] = getLoginCompanyID();

//               addProcessingRequests();
//               ServerAPI.addRestDayGroup(submitValues)
//                 .then((response) => {
//                   if (response && response["message"]) {
//                     toast.success(response["message"]);
//                     reloadData();
//                     closeDialog();
//                   } else if (response && response["message"]) {
//                     toast.error(response["message"]);
//                   }
//                 })
//                 .finally(() => {
//                   setSubmitting(false);
//                   reduceProcessingRequests();
//                 });
//             }
//           }}
//         >
//           {(formikProps) => {
//             return (
//               <div className="tabdetails">
//                 {/* <h4 className="title-text text-center">{editMode ? 'Edit' : 'Add New'} Rest Days Group</h4> */}
//                 <p className="detailed-heading mt-3">
//                   {editMode ? "Edit" : "Add New"} Rest Day Group
//                 </p>
//                 <div className="custom-border-grey my-2"></div>
//                 <Form className="pl-2 pr-2">
//                   <div className="px-2 form-field-container">
//                     <div className="row px-2 py-3">
//                       <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
//                         <FormField
//                           formik={formikProps}
//                           fieldProps={{
//                             fieldType: "select",
//                             label: "Company",
//                             name: "company_id",
//                             placeholder: "Select Company",
//                             options: companyOption,
//                             required: true,
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div className="row px-2">
//                       <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
//                         <FormField
//                           formik={formikProps}
//                           fieldProps={{
//                             fieldType: "textbox",
//                             label: "Rest Group Name",
//                             name: "company_weekoff_name",
//                             placeholder: "Enter rest group Name",
//                             required: true,
//                           }}
//                         />
//                       </div>
//                     </div>
//                     {weekDayOptions.map((day) => {
//                       return (
//                         <div className="pt-2 ">
//                           <div className="row px-2">
//                             <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
//                               <FormField
//                                 formik={formikProps}
//                                 fieldProps={{
//                                   fieldType: "radio",
//                                   label: `${day.label}`,
//                                   name: `weekday_id${day.value}`,
//                                   placeholder: "Select Day Type",
//                                   options: dayTypeOptions.filter(
//                                     // eslint-disable-next-line array-callback-return
//                                     (item: any) => {
//                                       if (
//                                         item.value !== 1 &&
//                                         item.value !== 4
//                                       ) {
//                                         return item;
//                                       }
//                                     }
//                                   ),
//                                   required: true,
//                                 }}
//                               />
//                               <p>hello</p>
//                               <ErrorMessage
//                                         component={FormHelperText}
//                                         name={`weekday_id${day.value}`}
//                                         className="form-error-text"
//                                       />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <FieldArray name="leave_plan_leave_types">
//                       {({ insert, remove, push }) => (
//                         <div>
//                           {formikProps.values.rest_days != undefined &&
//                             formikProps.values.rest_days.length > 0 && (
//                               <>
//                                 {formikProps.values.rest_days.map(
//                                   (data, index) => {
//                                     const uniqueKey = `${index}-${data.rest_day_of_week}`;
//                                     return (
//                                       <div key={uniqueKey}>
//                                         <div className="row px-2 py-3">
//                                           <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                             <FormField
//                                               formik={formikProps}
//                                               fieldProps={{
//                                                 fieldType: "radio",
//                                                 label: getObjectKeyByValue(
//                                                   RestDays,
//                                                   data.rest_day_of_week
//                                                 ),
//                                                 name: `rest_days.${index}.rest_day_type`,
//                                                 options: [
//                                                   {
//                                                     label: "Rest Day",
//                                                     value:
//                                                       WorkTimeDayType.RestDay.toString(),
//                                                   },
//                                                   {
//                                                     label: "Working Day",
//                                                     value:
//                                                       WorkTimeDayType.RegularDay.toString(),
//                                                   },
//                                                 ],
//                                                 required: true,
//                                               }}
//                                             />
//                                           </div>
//                                         </div>
//                                         {formikProps.values.rest_days[index] &&
//                                           formikProps.values.rest_days[index]
//                                             .rest_day_type ==
//                                             WorkTimeDayType.RestDay && (
//                                             <>
//                                               <div className="row px-2 py-3">
//                                                 <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                                   <FormField
//                                                     formik={formikProps}
//                                                     fieldProps={{
//                                                       fieldType: "select",
//                                                       label: "Week Type",
//                                                       name: `rest_days.${index}.rest_day_week_type`,
//                                                       placeholder:
//                                                         "Enter Week Type",
//                                                       options: weekTypeOptions,
//                                                       required: true,
//                                                     }}
//                                                   />
//                                                 </div>
//                                               </div>
//                                               {formikProps.values.rest_days[
//                                                 index
//                                               ] &&
//                                                 formikProps.values.rest_days[
//                                                   index
//                                                 ].rest_day_week_type ==
//                                                   RestrictedWeeks.Restricted && (
//                                                   <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                                     <FormField
//                                                       formik={formikProps}
//                                                       fieldProps={{
//                                                         fieldType:
//                                                           "multiselect",
//                                                         label:
//                                                           "Restricted Weeks",
//                                                         name: `rest_days.${index}.rest_day_restricted_weeks`,
//                                                         placeholder:
//                                                           "Select Restricted Weeks",
//                                                         options:
//                                                           restrictedWeeksOptions,
//                                                         required: true,
//                                                       }}
//                                                     />
//                                                   </div>
//                                                 )}
//                                             </>
//                                           )}
//                                       </div>
//                                     );
//                                   }
//                                 )}
//                               </>
//                             )}
//                         </div>
//                       )}
//                     </FieldArray>
//                     <div className="row py-3">
//                       <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                         <FormField
//                           formik={formikProps}
//                           fieldProps={{
//                             fieldType: "radio",
//                             label: "Workshift Status",
//                             name: "company_weekoff_status",
//                             options: weekOffAliveOptions,
//                             required: true,
//                           }}
//                         />
//                       </div>
//                     </div>
//                     {Object.entries(RestDays).map(([key, value]) => (
//                                             <div key={value}>
//                                                 <div className="row px-2 py-3">
//                                                     <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                                         <FormField
//                                                             formik={formikProps}
//                                                             fieldProps={{
//                                                                 fieldType: "radio",
//                                                                 label: key,
//                                                                 name: `rest_days[${value}].rest_day_of_week`,
//                                                                 options: [
//                                                                     { label: 'Rest Day', value: WorkTimeDayType.RestDay.toString() },
//                                                                     { label: 'Working Day', value: WorkTimeDayType.RegularDay.toString() }
//                                                                 ],
//                                                                 required: true
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 {formikProps.values.rest_days[value] && formikProps.values.rest_days[value].rest_day_of_week == WorkTimeDayType.RestDay && (
//                                                     <>
//                                                         <div className="row px-2 py-3">
//                                                             <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                                                 <FormField
//                                                                     formik={formikProps}
//                                                                     fieldProps={{
//                                                                         fieldType: "select",
//                                                                         label: "Week Type",
//                                                                         name: `rest_days[${value}].rest_day_week_type`,
//                                                                         placeholder: "Enter Week Type",
//                                                                         options: weekTypeOptions,
//                                                                         required: true
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         {formikProps.values.rest_days[value] && formikProps.values.rest_days[value].rest_day_week_type == RestrictedWeeks.Restricted && <div className="row px-2 py-3">
//                                                             <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
//                                                                 <FormField
//                                                                     formik={formikProps}
//                                                                     fieldProps={{
//                                                                         fieldType: "multiselect",
//                                                                         label: "Restricted Weeks",
//                                                                         name: `rest_days[${value}].rest_day_restricted_weeks`,
//                                                                         placeholder: "Select Restricted Weeks",
//                                                                         options: restrictedWeeksOptions,
//                                                                         required: true
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </div>}
//                                                     </>
//                                                 )}
//                                             </div>
//                                         ))}
//                   </div>
//                   <div className="row btn-form-submit">
//                     <button
//                       type="button"
//                       className="button1"
//                       onClick={closeDialog}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="button"
//                       className="button2"
//                       disabled={formikProps.isSubmitting}
//                       onClick={() => {
//                         formikProps.submitForm();
//                         if (!formikProps.isValid) {
//                           toast.error(
//                             "Please ensure all fields are Filled and Valid!"
//                           );
//                         }
//                       }}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </Form>
//               </div>
//             );
//           }}
//         </Formik>
//       )}
//     </Drawer>
//   );
// };

// export default RestDayGroupsEntryDialog;