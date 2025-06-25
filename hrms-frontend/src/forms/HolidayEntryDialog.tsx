import { Drawer } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import FormField from "../components/form-items/FormField";
import { APIData, FormDataTypes } from "../common/DataTypes";
import { InitialData } from "./InitialData";
import { useAppStateAPI } from "../common/AppStateAPI";
import toast from "react-hot-toast";
import { ServerAPI } from "../common/ServerAPI";
import { API, ProjectStrings } from "../common/Constants";
import { extractKeys, getDataFromAPI } from "../common/Utilities";

const HolidayEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.Holiday>(
    InitialData.Holiday
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [holidayGroupOption, setHolidayGroupOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const [holidayTypeOption, setHolidayTypeOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);

  useEffect(() => {
    getDataFromAPI(
      API.EndPoint.HOLIDAY_GROUPS,
      setHolidayGroupOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_holiday_group_id",
      "company_holiday_group_name",
      "data",
      "groups"
    );
    getDataFromAPI(
      API.EndPoint.HOLIDAY_TYPES,
      setHolidayTypeOption,
      addProcessingRequests,
      reduceProcessingRequests,
      null,
      true,
      "company_holiday_type_id",
      "company_holiday_type_name",
      "data",
      "types"
    );
    setFormDataSet(true);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getHolidayDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue(response);
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
  }, [id]);

  const yupSchema = Yup.object().shape({
    company_holiday_type_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_holiday_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_holiday_date: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
    company_holiday_group_id: Yup.number()
      .notOneOf([0], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
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
          validateOnChange={false}
          validationSchema={yupSchema}
          initialValues={initialValue}
          onSubmit={(values, { setSubmitting }) => {
            let submitValues: any = { ...values };
            if (submitValues["company_holiday_date"] === "") {
              toast.error("Holiday Date Required");
              setSubmitting(false);
              return;
            }
            if (id != undefined && id != 0) {
              addProcessingRequests();
              const keysToExtract = [
                "company_holiday_id",
                "company_holiday_group_id",
                "company_holiday_type_id",
                "company_holiday_name",
                "company_holiday_date",
                "company_holiday_description",
                "company_holiday_status",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateHoliday(updateValues, id)
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
              addProcessingRequests();
              ServerAPI.addHoliday(submitValues)
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
                  {editMode ? "Edit" : "Add New"} Holiday
                </p>
                <div className="custom-border-grey my-2"></div>
                <Form className="pl-2 pr-2">
                  <div className="px-2 form-field-container">
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Holiday Type",
                            name: "company_holiday_type_id",
                            placeholder: "Select Type",
                            options: holidayTypeOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Holiday Name",
                            name: "company_holiday_name",
                            placeholder: "Enter Holiday Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "datepicker",
                            label: "Holiday Date",
                            name: "company_holiday_date",
                            placeholder: "Select Date",
                            required: true,
                            allowFutureDate: true,
                            allowPastDate: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Description",
                            name: "company_holiday_description",
                            placeholder: "Enter Description",
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "select",
                            label: "Holiday Group",
                            name: "company_holiday_group_id",
                            placeholder: "Select Group",
                            options: holidayGroupOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
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
                        formikProps.submitForm();
                        if (!formikProps.isValid) {
                          toast.error(
                            "Please ensure all fields are Filled and Valid!"
                          );
                        }
                      }}
                    >
                      {editMode ? "Save Changes" : "Add Now"}
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

export default HolidayEntryDialog;
