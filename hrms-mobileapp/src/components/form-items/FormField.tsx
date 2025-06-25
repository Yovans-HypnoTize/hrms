import { ErrorMessage, Field, FormikProps } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import * as ThemeData from '../../common/ThemeData';
import Select, { components, StylesConfig } from 'react-select';
import { Box, Checkbox, FormHelperText, Input, InputLabel } from '@mui/material';
// import { uploadImageType } from '../../common/Constants';
import { getDisplayImageByURL, getFilenameExtension } from '../../common/Utilities';
import { TextField } from 'formik-material-ui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { ChangeEvent, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ServerAPI } from '../../common/ServerAPI';
import { useAppStateAPI } from '../../common/AppStateAPI';
import toast from 'react-hot-toast';

const FormField: React.FC<{ formik: FormikProps<any>, fieldProps: ThemeData.FormFieldProps }> = ({ formik, fieldProps }) => {
    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const currentDate = new Date(); // Current date
    const futureDate = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(currentDate.getFullYear() - 100);
    futureDate.setFullYear(futureDate.getFullYear() + 100);


    const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const selectedFile = selectedFiles[0];
            addProcessingRequests();
            ServerAPI.uploadFileAndGetPath(selectedFile).then((response: any) => {
                if (response) {
                    formik.setFieldValue(otherProps.name, response['file_path']);
                    const previewURL: string = response['preview_url'];
                    const extn = previewURL.includes('filename=') ? getFilenameExtension(previewURL.split('filename=')[1]) : undefined;
                    if (setPreviewImage) {
                        //setPreviewImage(response['download_url']);
                        setPreviewImage(getDisplayImageByURL(previewURL, extn));
                    }
                    //setFieldPreviewImage(response['download_url']);
                    setFieldPreviewImage(getDisplayImageByURL(previewURL, extn));
                    setChangeFile(false);
                }
            }).finally(() => {
                reduceProcessingRequests();
            });
        }
    };


    const customStyles: StylesConfig = {
        control: (provided: Record<string, unknown>, state: any) => ({
            ...provided,
            minHeight: 47,
            // border: state.isFocused ? "2px solid #14408B" : "2px solid rgba(37, 37, 37, 0.2)",
            border: "2px solid rgba(37, 37, 37, 0.2)",
            boxShadow: state.isFocused ? "none" : "none",
            borderRadius: 8,
            paddingLeft: 9,
            fontWeight: 'lighter',
            fontFamily: 'Roboto',
            fontSize: 14,
            "&:hover": {
                border: "2px solid #0E7AD5",
                boxShadow: "none",
            },
        }),
        option: (styles, { isSelected }) => {
            return {
                ...styles,
                cursor: 'default',
                minHeight: 40,
                paddingTop: 0,
                paddingBottom: 0,
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400',
                color: isSelected ? '#fff' : '#252525',
            };
        },
        valueContainer: (provided: Record<string, unknown>) => ({
            ...provided,
            maxHeight: 40,
            paddingTop: 0,
            paddingLeft: 3,
            color: 'rgb(37, 37, 37)'
        }),
        placeholder: (provided: Record<string, unknown>) => ({
            ...provided,
            maxHeight: 40,
            fontFamily: 'Roboto',
            fontSize: 14,
            fontWeight: 400,
            color: 'rgb(37, 37, 37, 0.7)'
        }),
        input: (provided: Record<string, unknown>) => ({
            ...provided,
            maxHeight: 40,
            padding: 0,
            margin: 0,
        }),
        menuList: (provided: Record<string, unknown>) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0
        })
    };

    const ValueContainer = ({ children, ...props }: any) => {
        let [values, input] = children;

        if (Array.isArray(values)) {
            const plural = values.length === 1 ? "" : "s";
            values = `${values.length} item${plural} selected`;
        }

        return (
            <components.ValueContainer {...props}>
                {values}
                {input}
            </components.ValueContainer>
        );
    };

    const { fieldType, error, errorText, label, initialValue, readOnly, options, imageType, previewImage, setPreviewImage, ...otherProps } = fieldProps;

    const [selectKey, setSelectKey] = useState(Math.random());
    const [changeFile, setChangeFile] = useState(false);
    const [fieldPreviewImage, setFieldPreviewImage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setSelectKey(Math.random());
    }, [options]);



    if (fieldType === 'textbox') {
        return (
            <div className='mb-24'>
                <Field
                    type="text"
                    fullWidth
                    component={TextField}
                    inputProps={{
                        id: otherProps.name,
                        readOnly: readOnly ? true : false,
                        style: {
                            fontWeight: 400, color: '#252525', fontFamily: 'Montserrat',
                            fontSize: 14,
                        }
                    }}
                    autoComplete="off"
                    {...otherProps}
                    name={otherProps.name}
                    label={label}
                    sx={{
                        '& label': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 14,
                        },
                        '& label.Mui-focused': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            transform: 'translate(14px, -5px) scale(0.85)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 13,
                            letterSpacing: 0,
                            // marginTop: '4px'
                        },

                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: '2px solid rgba(37, 37, 37, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            '&.Mui-error fieldset': {
                                borderColor: '#2525254d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            marginTop: '3px',
                            paddingLeft: '1px',
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '14px'
                        },
                        '& .MuiFormHelperText-root': {
                            display: 'none'
                        },
                    }}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div >
        )
    } else if (fieldType === 'number') {
        return (
            <div className='mb-24'>
                <Field
                    type="number"
                    fullWidth
                    component={TextField}
                    inputProps={{
                        id: otherProps.name,
                        readOnly: readOnly ? true : false,
                        style: {
                            fontWeight: 400, color: '#252525', fontFamily: 'Montserrat',
                            fontSize: 14,
                        }
                    }}
                    autoComplete="off"
                    {...otherProps}
                    name={otherProps.name}
                    label={label}
                    sx={{
                        '& label': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 14,
                        },
                        '& label.Mui-focused': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            transform: 'translate(14px, -5px) scale(0.85)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 13,
                            letterSpacing: 0,
                            // marginTop: '4px'
                        },

                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: '2px solid rgba(37, 37, 37, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            '&.Mui-error fieldset': {
                                borderColor: '#2525254d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            marginTop: '3px',
                            paddingLeft: '1px',
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '14px'
                        },
                        '& .MuiFormHelperText-root': {
                            display: 'none'
                        },
                    }}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div >
        )
    } else if (fieldType === 'password') {
        return (
            <div className='mb-24'>
                {/* <label htmlFor={otherProps.name} className="form-label">
                    {label} {otherProps.required && (<span className="text-danger me-4">*</span>)}
                </label> */}
                <Field
                    type="password"
                    // id={otherProps.name}
                    // className="form-control"
                    // {...otherProps}
                    // name={otherProps.name}
                    readOnly={readOnly ? true : false}
                    helperText=""
                    component={TextField}
                    inputProps={{
                        id: otherProps.name,
                        readOnly: readOnly ? true : false,
                        style: {
                            fontWeight: 400, color: '#252525', fontFamily: 'Montserrat',
                            fontSize: 14,
                        }
                    }}
                    autoComplete="off"
                    {...otherProps}
                    name={otherProps.name}
                    label={label}
                    sx={{
                        '& label': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 14,
                        },
                        '& label.Mui-focused': {
                            color: 'rgba(37, 37, 37, 0.7)',
                            transform: 'translate(14px, -5px) scale(0.85)',
                            fontWeight: 400, fontFamily: 'Montserrat',
                            fontSize: 13,
                            letterSpacing: 0,
                            // marginTop: '4px'
                        },

                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: '2px solid rgba(37, 37, 37, 0.2)'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            '&.Mui-error fieldset': {
                                borderColor: '#2525254d',
                            },
                            '&:hover fieldset': {
                                borderColor: '#0E7AD5',
                            },
                            marginTop: '3px',
                            paddingLeft: '1px',
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '14px'
                        },
                        '& .MuiFormHelperText-root': {
                            display: 'none'
                        },
                    }}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div >
        )
    } else if (fieldType === 'textarea') {
        return (
            <div className='mb-24'>
                <label htmlFor={otherProps.name} className="form-label">
                    {otherProps.required && (<span className="text-danger me-4">*</span>)}
                    {label}
                </label>
                <Field
                    component="textarea"
                    className="form-control"
                    cols={40}
                    rows={5}
                    readOnly={readOnly ? true : false}
                    {...otherProps}
                    inputProps={{
                        id: otherProps.name,
                        style: {
                            fontWeight: 400, color: '#252525', borderColor: otherProps.required ? '#d32f2f' : '#d32f2f'
                        }
                    }}
                >
                    {initialValue}
                </Field >
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div >
        )
    } else if (fieldType === 'select') {
        return (

            <div className="mb-24" key={selectKey}>
                <label htmlFor={otherProps.name} className="label-custom">
                    {label} {otherProps.required && (<span className="text-danger">*</span>)}
                </label>
                <Select
                    styles={customStyles}
                    name={otherProps.name}
                    options={options}
                    isDisabled={readOnly ? true : false}
                    defaultValue={options?.filter(option => formik.getFieldProps(fieldProps.name).value + '' == option.value + '')}
                    value={options?.filter(option => formik.getFieldProps(fieldProps.name).value + '' == option.value + '')}
                    className="basic-multi-select"
                    placeholder={otherProps.placeholder}
                    onChange={(option: any) => {
                        formik.setFieldValue(otherProps.name, option.value);
                        setTimeout(() => formik.setFieldTouched(otherProps.name, true), 100);
                    }}
                    onBlur={() => formik.handleBlur(otherProps.name)}
                    closeMenuOnSelect={true}
                    components={{
                        ValueContainer,
                        MultiValue: () => null
                    }}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div>

        )

    }
    else if (fieldType === 'multiselect') {
        const maxOptions = otherProps.limitedOptions || (options ?? []).length; // Set the maximum number of selectable options

        return (
            <div className='mb-24' key={selectKey}>
                <label htmlFor={otherProps.name} className="label-custom">
                    {label} {otherProps.required && (<span className="text-danger">*</span>)}
                </label>
                <Select
                    styles={customStyles}
                    isMulti
                    name={otherProps.name}
                    options={options ?? []}
                    // isDisabled={formik.getFieldProps(fieldProps.name).value.length >= maxOptions || readOnly ? true : false}
                    isDisabled={(formik.getFieldProps(fieldProps.name).value?.length || 0) >= maxOptions || readOnly ? true : false}
                    defaultValue={(options ?? []).filter(option => formik.getFieldProps(fieldProps.name) && formik.getFieldProps(fieldProps.name).value && formik.getFieldProps(fieldProps.name).value.includes(option.value))}
                    className="basic-multi-select"
                    hideSelectedOptions={true}
                    placeholder={`Select ${label}`}
                    onChange={(selectedOptions: any) => {
                        // Enforce the limitation on the number of selectable options
                        const selectedCount = selectedOptions.length;
                        if (selectedCount <= maxOptions) {
                            formik.setFieldValue(otherProps.name, selectedOptions.map((option: { value: any; }) => option.value));
                            setTimeout(() => formik.setFieldTouched(otherProps.name, true), 100);
                        }
                    }}
                    onBlur={() => formik.handleBlur(otherProps.name)}
                    closeMenuOnSelect={true}
                    // menuIsOpen={true}
                    components={{
                        ValueContainer,
                        MultiValue: () => null
                    }}
                />
                <div className='row'>
                    {formik.getFieldProps(fieldProps.name) && formik.getFieldProps(fieldProps.name).value && Array.isArray(formik.getFieldProps(fieldProps.name).value) && formik.getFieldProps(fieldProps.name).value.map((optionValue: string, index: number) => {
                        const selectedOption = (options ?? []).filter(option => option.value === optionValue);
                        if (selectedOption && selectedOption.length > 0) {
                            return (
                                <div key={index}>
                                    <div className='selected-options-container'>
                                        <span className='select-size'>{selectedOption[0].label}</span>
                                        {!readOnly && (
                                            <div className='cancel-button'>
                                                <button className='cancelbutton' onClick={() => {
                                                    formik.setFieldValue(otherProps.name, formik.getFieldProps(fieldProps.name).value.filter((optValue: string) => optValue !== selectedOption[0].value));
                                                    setSelectKey(Math.random());
                                                }}>X</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div>
        )
    }

    else if (fieldType === 'datepicker') {
        return (
            <div className='mb-24'>
                <label htmlFor={otherProps.name} className="label-custom">
                    {label} {otherProps.required && (<span className="text-danger">*</span>)}
                </label>
                <div  >
                    <DatePicker
                        {...fieldProps}
                        {...otherProps}
                        value={formik.getFieldProps(fieldProps.name).value}
                        selected={formik.values[otherProps.name] ? new Date(formik.values[otherProps.name]) : null}
                        onChange={(date) => {
                            const formattedDate = date
                                ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
                                : null;
                            formik.setFieldValue(otherProps.name, formattedDate);
                            setTimeout(() => formik.setFieldTouched(otherProps.name, true), 100);
                            //formik.validateField(otherProps.name);
                        }}
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="scroll"
                        yearDropdownItemNumber={100}
                        scrollableYearDropdown
                        className="form-control"
                        placeholderText={otherProps.placeholder}
                        minDate={otherProps.allowPastDate ? null:new Date()}
                        maxDate={otherProps.allowFutureDate ? futureDate : currentDate} // Conditionally set maxDate
                    />
                </div>
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div>
        );
    }
    else if (fieldType === 'timepicker') {
        return (
            <div className='mb-24'>
                <label htmlFor={otherProps.name} className="label-custom">
                    {label} {otherProps.required && (<span className="text-danger">*</span>)}
                </label>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label={label}
                            // className='form-control'
                            value={formik.getFieldProps(fieldProps.name).value ? dayjs(dayjs().format('YYYY-MM-DD') + 'T' + formik.getFieldProps(fieldProps.name).value) : ''}
                            onChange={(date) => {
                                if (date) {
                                    const selTime = dayjs(date);
                                    const formattedTime = selTime.format('HH:mm:ss');
                                    formik.setFieldValue(otherProps.name, formattedTime);
                                    formik.setFieldTouched(otherProps.name, true);
                                }
                            }}
                            ampm={otherProps.timepicker24HFormat ? false : true}
                        />
                    </LocalizationProvider>

                </div>
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div>
        );
    } else if (fieldType === 'autocomplete') {
        let initialOption = { label: '', value: '0' }
        if (options !== undefined) {
            const filtered = options.filter(option => option.value == formik.getFieldProps(fieldProps.name).value);
            if (filtered.length > 0) {
                initialOption = filtered[0];
            }
        }
        return (
            // <Autocomplete
            //     className="country-select"
            //     options={options !== undefined ? options : []}
            //     getOptionLabel={option => option.label}
            //     value={initialOption}
            //     onChange={(e, selectedOption) => {
            //         let selectedValue = "0";
            //         if (selectedOption) {
            //             selectedValue = selectedOption.value
            //         }
            //         formik.setFieldValue(otherProps.name, selectedValue)
            //     }}
            //     renderInput={params => (
            //         <Field component={TextField} {...params} name={otherProps.name} label={label} readOnly={readOnly ? true : false} margin="normal" fullWidth />
            //     )}
            // />

            <Autocomplete
                className="country-select"
                options={options !== undefined ? options : []}
                getOptionLabel={option => option.label}
                value={initialOption}
                onChange={(e, selectedOption) => {
                    let selectedValue = "0";
                    if (selectedOption) {
                        selectedValue = selectedOption.value
                    }
                    formik.setFieldValue(otherProps.name, selectedValue);
                    formik.handleChange(e); // Update input value
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        margin="normal"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            readOnly: readOnly ? true : false,
                        }}
                        inputProps={{
                            ...params.inputProps,
                            name: otherProps.name,
                        }}
                        field={formik.getFieldProps(otherProps.name)}
                        form={formik}
                        meta={formik.getFieldMeta(otherProps.name)}
                    />
                )}
            />

        )
    } else if (fieldType === 'radio') {
        return (
            <div className='mb-24 d-flex flex-wrap'>
                <label htmlFor={otherProps.name} className="form-label side-headings">
                    {label} {otherProps.required && (<span className="text-danger me-4">*</span>)}
                </label>&nbsp;
                {/* <Field component={RadioGroup} name={otherProps.name} readOnly={readOnly ? true : false} row >
                    {options && options.map((option, index) => {
                        return (
                            <FormControlLabel key={`${otherProps.name}-option-${index}`} value={option.value + ""} control={<Radio />} label={option.label} />
                        )
                    })}
                </Field> */}
                &nbsp;
                <div role="group" className='d-flex flex-wrap' aria-labelledby={otherProps.name + "-group"}>

                    {options && options.map((option, index) => (
                        <label className='mr-3 side-heading-label d-flex align-items-center' key={index}><Field type="radio" className="me-2" name={otherProps.name} value={option.value} checked={formik.getFieldProps(fieldProps.name).value == option.value ? true : false} readOnly={readOnly ? true : false} />{option.label}</label>
                    ))}

                </div>
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </div>
        )
    } else if (fieldType === 'checkbox') {
        return (
            <div className='mb-24'>
                <InputLabel>
                    <Field
                        type="checkbox"
                        component={Checkbox}
                        checked={formik.getFieldProps(fieldProps.name).value && formik.getFieldProps(fieldProps.name).value !== "0" ? true : false}
                        readOnly={readOnly ? true : false}
                        indeterminate={false}
                        {...otherProps}
                        onChange={() => {
                            if (!readOnly) {
                                formik.setFieldValue(otherProps.name, formik.getFieldProps(fieldProps.name).value ? 0 : 1)
                            }
                        }}
                    />
                    {label}
                </InputLabel>
            </div>
        )
    } else if (fieldType === 'switch') {
        return (
            <div className='d-flex'>
                <p className="side-headings mr-25">{label}:</p>
                <div className='toggle-switch'>

                    <label className='toggle-label'>
                        <input type='checkbox' className="toggle-switch-input" id="customSwitchSuccess"
                            checked={formik.getFieldProps(fieldProps.name).value ? true : false}
                            onChange={() => {
                                if (!readOnly) {
                                    formik.setFieldValue(otherProps.name, formik.getFieldProps(fieldProps.name).value ? 0 : 1)
                                }
                            }}
                        />
                        <span className='slider'></span>
                    </label>
                    <label className="custom-control-label text-muted table-text" htmlFor="customSwitchSuccess">{formik.getFieldProps(fieldProps.name).value ? 'Active' : 'Inactive'}</label>
                </div>
            </div>
        )
    }
    else if (fieldType === 'fileupload') {
        return (
            <div className='mb-24'>
                <InputLabel htmlFor={otherProps.name} className="form-upload-label">{label}</InputLabel>
                {uploading && (
                    <img src={window.location.origin + "/assets/images/uploading.gif"} style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '10px' }} />
                )}
                {!uploading && ((previewImage !== undefined && previewImage !== '') || fieldPreviewImage !== '') && !changeFile && (
                    <>
                        {(previewImage !== undefined && previewImage !== '') ?
                            <img src={previewImage} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                            :
                            <img src={fieldPreviewImage} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                        }
                        <a href="#" onClick={(e) => { e.preventDefault(); setChangeFile(true) }}><i className="fas fa-edit text-info font-16" aria-hidden="true"></i></a>
                    </>
                )}
                {!uploading && !previewImage && !fieldPreviewImage && formik.getFieldProps(fieldProps.name).value && !changeFile && (
                    <>
                        <img src={getDisplayImageByURL(formik.getFieldProps(fieldProps.name).value, formik.getFieldProps(fieldProps.name).value.includes('filename=') ? getFilenameExtension(formik.getFieldProps(fieldProps.name).value.split('filename=')[1]) : undefined)} style={{ maxWidth: '150px', maxHeight: '150px', marginRight: '10px' }} />
                        {!readOnly && <a href="#" onClick={(e) => { e.preventDefault(); setChangeFile(true) }}><i className="fas fa-edit text-info font-16" aria-hidden="true"></i></a>}
                    </>
                )}
                {!uploading && ((!formik.getFieldProps(fieldProps.name).value && !previewImage) || changeFile) &&
                    <input type="file" {...otherProps} readOnly={readOnly ? true : false} className='form-file-upload' onChange={handleFileSelect} />
                }
            </div>
        )
    }
    // else if (fieldType === 'fileupload') {
    //     return (
    //         <div className='mb-24'>
    //             <InputLabel htmlFor={otherProps.name} className="form-upload-label">{label}</InputLabel>
    //             {uploading && (
    //                 <img src={window.location.origin + "/assets/images/uploading.gif"} style={{ maxWidth: '50px', maxHeight: '50px', marginRight: '10px' }} />
    //             )}
    //             {!uploading && ((previewImage !== undefined && previewImage !== '') || fieldPreviewImage !== '') && !changeFile && (
    //                 <>
    //                     {(previewImage !== undefined && previewImage !== '') ?
    //                         <img src={previewImage} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
    //                         :
    //                         <img src={fieldPreviewImage} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
    //                     }
    //                     <a href="#" onClick={(e) => { e.preventDefault(); setChangeFile(true) }}><i className="fas fa-edit text-info font-16" aria-hidden="true"></i></a>
    //                 </>
    //             )}
    //             {!uploading && !previewImage && !fieldPreviewImage && formik.getFieldProps(fieldProps.name).value !== undefined && formik.getFieldProps(fieldProps.name).value !== '' && !changeFile && (
    //                 <>
    //                     <img src={getDisplayImageByURL(formik.getFieldProps(fieldProps.name).value)} style={{ maxWidth: '150px', maxHeight: '150px', marginRight: '10px' }} />
    //                     {!readOnly && <a href="#" onClick={(e) => { e.preventDefault(); setChangeFile(true) }}><i className="fas fa-edit text-info font-16" aria-hidden="true"></i></a>}
    //                 </>
    //             )}
    //             {!uploading && ((!formik.getFieldProps(fieldProps.name).value && !previewImage) || changeFile) &&
    //                 <input type="file" {...otherProps} readOnly={readOnly ? true : false} className='form-file-upload' onChange={(event) => {
    //                     // const target = event.target as HTMLInputElement;
    //                     if (event.target.files && event.target.files.length > 0) {
    //                         var uploadedFile = event.target.files[0];
    //                         const objURL = URL.createObjectURL(uploadedFile);
    //                         if (uploadedFile.type.startsWith('image/')) {
    //                             setPreviewImage(objURL);
    //                             setFieldPreviewImage(objURL);
    //                         }
    //                         setUploading(true);
    //                         ServerAPI.fileUpload(objURL).then(response => {
    //                             if (response && response['download_url']) {
    //                                 formik.setFieldValue(otherProps.name, response['download_url']);
    //                                 if (setPreviewImage) {
    //                                     setPreviewImage(response['download_url']);
    //                                 }
    //                                 setFieldPreviewImage(response['download_url']);
    //                                 setChangeFile(false);
    //                             } else if (response['message']) {
    //                                 toast.error(response['error_messages']);
    //                                 formik.setFieldValue(otherProps.name, '');
    //                             } else {
    //                                 toast.error('Could not upload image!');
    //                                 formik.setFieldValue(otherProps.name, '');
    //                             }
    //                         }).finally(() => {
    //                             setUploading(false);
    //                         });
    //                     } else {
    //                         console.error("File could not be read.");
    //                     }
    //                 }

    //                 } />
    //             }
    //         </div>
    //     )
    // }

    else if (fieldType === 'date') {
        return (
            <Box>
                <InputLabel htmlFor={otherProps.name}>{label}</InputLabel>
                <Field
                    //readOnly={readOnly ? true : false}
                    // component={DatePicker}
                    //variant="outlined"
                    onChange={(newValue: any) => { }}
                    format="dd/MM/yyyy"
                    className="form-control"
                    {...otherProps}
                />
                {/* <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" /> */}
            </Box>
        )
    } else if (fieldType === 'time') {
        return (
            <Box>
                <InputLabel htmlFor={otherProps.name}>{label}</InputLabel>
                <Field
                    readOnly={readOnly ? true : false}
                    // component={}
                    {...otherProps}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </Box>
        )
    } else if (fieldType === 'datetime') {
        return (
            <Box>
                <InputLabel htmlFor={otherProps.name}>{label}</InputLabel>
                <Field
                    readOnly={readOnly ? true : false}
                    // component={
                    //     DateTimePicker
                    // }
                    format="dd/MM/yyyy hh:mm a"
                    {...otherProps}
                />
                <ErrorMessage component={FormHelperText} name={otherProps.name} className="form-error-text" />
            </Box>
        )
    } else {
        return (<></>)
    }
}

export default FormField;