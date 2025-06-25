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

const HolidayTypeEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, id, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [initialValue, setInitialValue] = useState<APIData.HolidayType>(
    InitialData.HolidayType
  );
  const [formDataSet, setFormDataSet] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const restrictedHolidayOptions: FormDataTypes.SelectOption[] = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  useEffect(() => {
    setFormDataSet(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (id !== undefined && id !== 0) {
      addProcessingRequests();
      ServerAPI.getHolidayTypeDetail(id)
        .then((response) => {
          if (response) {
            setInitialValue({
              ...response,
              company_holiday_type_status:
                response.company_holiday_type_status === true ? "1" : "0",
            });
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
    company_id: Yup.string()
      .notOneOf(["0"], ProjectStrings.ValidationSelect)
      .required(ProjectStrings.ValidationRequired),
    company_holiday_type_name: Yup.string().required(
      ProjectStrings.ValidationRequired
    ),
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

            if (id !== undefined && id !== 0) {
              submitValues["company_holiday_type_status"] =
                submitValues.company_holiday_type_status === "1" ? true : false;
              addProcessingRequests();
              const keysToExtract = [
                "company_holiday_type_id",
                "company_holiday_type_name",
                "company_holiday_type_status",
                "company_holiday_type_uid",
              ];
              const updateValues = extractKeys(submitValues, keysToExtract);
              ServerAPI.updateHolidayType(updateValues, id)
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
              submitValues["company_holiday_type_status"] =
                submitValues.company_holiday_type_status === "1" ? true : false;
              addProcessingRequests();
              ServerAPI.addHolidayType(submitValues)
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
                  {editMode ? "Edit" : "Add New"} Holiday Type
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
                            label: "Company Name",
                            name: "company_id",
                            placeholder: "Select Company Name",
                            options: companyOption,
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Holiday Type Name",
                            name: "company_holiday_type_name",
                            placeholder: "Enter Type Name",
                            required: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user holiday-group">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "textbox",
                            label: "Holiday Type Abbreviation",
                            name: "company_holiday_type_uid",
                            placeholder: "Enter Type Abbreviation",
                          }}
                        />
                      </div>
                    </div>
                    <div className="row py-3">
                      <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                        <FormField
                          formik={formikProps}
                          fieldProps={{
                            fieldType: "radio",
                            label: "Holiday Type is Restricted",
                            name: "company_holiday_type_status",
                            options: restrictedHolidayOptions,
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

export default HolidayTypeEntryDialog;
