export const eventName = action => `modal:${action}-server:show`;
export const modalId = action => `${action}-server`;
export const countUrl = () => '/servers/count';
export const findUrl = () => '/servers';
export const deleteUrl = id => `/server/${id}`
export const getUrl = id => `/server/${id}`;
export const createUrl = () => '/servers';
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
        host: {
            type: 'text',
            label: translate('host'),
            required: true,
            col: 'col-9 mt-2',
        },
        port: {
            type: 'number',
            label: translate('port'),
            required: true,
            placeholder: 22,
            col: 'col-3 mt-2',
        },
        user: {
            type: 'text',
            label: translate('user'),
            required: true,
            col: 'col-8 mt-2',
        },
    };
};
