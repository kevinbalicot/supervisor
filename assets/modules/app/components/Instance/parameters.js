export const eventName = action => `modal:${action}-instance:show`;
export const modalId = action => `${action}-instance`;
export const countUrl = () => '/instances/count';
export const findUrl = () => '/instances';
export const deleteUrl = id => `/instance/${id}`
export const getUrl = id => `/instance/${id}`;
export const createUrl = () => '/instances';
export const statusUrl = id => `/instance/${id}/status`;
export const statsUrl = id => `/instance/${id}/stats`;
export const deployUrl = id => `/instance/${id}/deploy`;
export const startUrl = id => `/instance/${id}/start`;
export const restartUrl = id => `/instance/${id}/restart`;
export const stopUrl = id => `/instance/${id}/stop`;
export const getForm = translate => {
    return {
        icon: {
            type: 'text',
            label: translate('icon'),
            required: true,
            col: 'col-3',
            placeholder: 'server'
        },
        name: {
            type: 'text',
            label: translate('name'),
            required: true,
            col: 'col-9',
        },
        repository: {
            type: 'text',
            label: translate('repository'),
            required: true,
            col: 'col-8 mt-2',
        },
        branch: {
            type: 'text',
            label: translate('branch'),
            required: true,
            col: 'col-4 mt-2',
            placeholder: 'master'
        },
        server: {
            type: 'select',
            label: translate('server'),
            values: {},
            required: true,
            col: 'col-12 mt-2'
        },
        dockerfile: {
            type: 'text',
            label: translate('dockerfile'),
            required: true,
            col: 'col-8 mt-2',
        },
        port: {
            type: 'text',
            label: translate('port'),
            required: true,
            col: 'col-4 mt-2',
        },
        env: {
            type: 'object',
            parameters: {
                APP_ENV: { type: 'text', label: 'APP_ENV' },
                LOCALE: { type: 'text', label: 'LOCALE' },
            },
            label: translate('env'),
            col: 'col-12 mt-2',
        },
    };
};
