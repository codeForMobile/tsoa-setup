export interface ValidateErrorJSON {
    message: 'Validation Failed',
    details: {
        [name: string]: unknown
    }
}