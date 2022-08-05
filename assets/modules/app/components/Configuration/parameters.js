export const eventName = action => `modal:${action}-configuration:show`;
export const modalId = action => `${action}-configuration`;
export const countUrl = () => '/configurations/count';
export const findUrl = () => '/configurations';
export const deleteUrl = id => `/configuration/${id}`
export const getUrl = id => `/configuration/${id}`;
export const createUrl = () => '/configurations';
export const generateCertificateUrl = id => `/configuration/${id}/certificate`;
export const getForm = translate => {
    return {
        name: {
            type: 'text',
            label: translate('name'),
            required: true,
            col: 'col-9',
        },
        icon: {
            type: 'text',
            label: translate('icon'),
            required: true,
            col: 'col-3',
            placeholder: 'server'
        },
        domain: {
            type: 'text',
            label: translate('domain'),
            required: true,
            col: 'col-6 mt-2',
        },
        instance: {
            type: 'select',
            label: translate('instance'),
            values: {},
            required: true,
            col: 'col-6 mt-2'
        }
    };
};
