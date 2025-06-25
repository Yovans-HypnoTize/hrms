import { FormDataTypes } from "./DataTypes"

export interface FormFieldConfig {
    fieldType: 'textbox' | 'number' | 'password' | 'textarea' | 'select' | 'multiselect' | 'autocomplete' | 'radio' | 'checkbox' | 'date' | 'datetime' | 'time' | 'fileupload' | 'switch' | 'datepicker' | "timepicker",
    name: string,
    label?: string,
    initialValue?: any,
    required?: boolean,
    disabled?: boolean,
    readOnly?: boolean,
    placeholder?: string,
    options?: FormDataTypes.SelectOption[],
    // option?: FormDataTypes.SelectOption1[],
    className?: string,
    accept?: string;
    imageType?: number,
    previewImage?: string,
    setPreviewImage?: any,
    allowFutureDate?: boolean,
    allowPastDate?: boolean,
    timepicker24HFormat?: boolean
    limitedOptions?: number
}

export interface FormFieldProps extends FormFieldConfig {
    error?: boolean,
    errorText?: boolean
}