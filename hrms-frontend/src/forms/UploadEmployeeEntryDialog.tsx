import { Drawer } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import Select from "react-select";
import { ServerAPI } from "../common/ServerAPI";
import { useAppStateAPI } from "../common/AppStateAPI";
import toast from "react-hot-toast";
import { FormDataTypes } from "../common/DataTypes";
import { getDataFromAPI } from "../common/Utilities";
import { API } from "../common/Constants";

const UploadEmployeeEntryDialog: React.FC<{
  showDialog: boolean;
  closeDialog: () => void;
  id?: number;
  reloadData: any;
}> = ({ showDialog, closeDialog, reloadData }) => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [companyOption, setCompanyOption] = useState<
    FormDataTypes.SelectOption[]
  >([]);
  const formRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      console.log("Selected File:", file); // Debugging
      setSelectedFile(file);
      setFieldValue("file", file);

      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    } else {
      setSelectedFile(null);
      setFieldValue("file", null);
      setFilePreview(null);
    }
  };

  const validationSchema = Yup.object().shape({
    company_id: Yup.string().required("Company Name is required"),
    // file: Yup.mixed()
    //   .required("File is required")
    //   .test("fileSize", "File size too large", (value: any) => {
    //     return value && value.size <= 5 * 1024 * 1024; // 5MB max
    //   })
    //   .test("fileType", "Unsupported file format", (value: any) => {
    //     return (
    //       value && ["application/vnd.ms-excel", "text/csv"].includes(value.type)
    //     );
    //   }),
  });

  const handleFileUploadContainer = () => {
    if (formRef.current) {
      formRef.current.click();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={showDialog}
      onClose={closeDialog}
      className="drawer-min"
    >
      <Formik
        initialValues={{ company_id: "", file: null }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!values.file) {
            toast.error("Please select a file first.");
            return;
          }

          addProcessingRequests();

          // Ensure both arguments are passed
          ServerAPI.employeesBulkUpload(values.file, values.company_id)
            .then((response: any) => {
              if (response?.message) {
                toast.success(response.message);
              }
              closeDialog();
              reloadData();
            })
            .catch((error: any) => {
              toast.error("Upload failed. Please try again.");
              console.error("Upload error:", error);
            })
            .finally(() => {
              reduceProcessingRequests();
              setSubmitting(false);
            });
        }}
      >
        {({
          handleSubmit,
          setFieldValue,
          isSubmitting,
          values,
          touched,
          errors,
        }) => (
          <Form className="tabdetails">
            <p className="detailed-heading mt-3">Upload Employee</p>
            <div className="custom-border-grey my-2"></div>
            <div className="px-2 form-field-container">
              <div className="row py-3 personal-detail-field">
                <div className="text-field-empty-custom-user">
                  <label htmlFor="company_id" className="label-custom">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="company_id"
                    options={companyOption}
                    isDisabled={false}
                    value={
                      companyOption?.find(
                        (option) => values.company_id === option.value
                      ) || null
                    }
                    className="basic-multi-select"
                    placeholder="Select Company Name"
                    onChange={(option: any) => {
                      setFieldValue("company_id", option.value);
                    }}
                    closeMenuOnSelect={true}
                  />
                  <ErrorMessage
                    name="company_id"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="row py-3">
                <div className="col-lg-12 col-md-12 col-xl-12 text-field-empty-custom-user">
                <p>Employee Details</p>
                <div
                className="form-file-upload-container"
                onClick={handleFileUploadContainer}
              >
                Choose File
              </div>
                  <input
                  style={{display:"none"}}
                   ref={formRef}
                    type="file"
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-danger"
                  />
                </div>
                {filePreview && (
                  <div className="file-preview mt-2">
                    <p>
                      <strong>Selected File:</strong>{" "}
                      <a
                        href={filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedFile?.name}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="row btn-form-submit">
              <button
                type="button"
                className="button1"
                onClick={closeDialog}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button2"
                disabled={isSubmitting || !selectedFile}
              >
                Upload
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

export default UploadEmployeeEntryDialog;
