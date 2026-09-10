export default {
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { publicApiKey } = settings.publicData;
                    const { privateApiKey } = settings.privateData;
                    return !!publicApiKey && !!privateApiKey;
                },
            },
        ],
        designSystemId: '48b73e9d-9636-4e13-8125-f6433265a97d',
    },
    actions: [
        {
            name: 'Checkout',
            code: 'checkout',
            isAsync: true,
        },
        {
            name: 'Customer portal',
            code: 'customerPortal',
            isAsync: true,
        },
        {
            name: 'Create payment intent',
            code: 'createPaymentIntent',
            isAsync: true,
        },
        {
            name: 'Retrieve payment intent',
            code: 'retrievePaymentIntent',
            isAsync: true,
        },
        {
            name: 'Confirm payment',
            code: 'confirmPayment',
            isAsync: true,
        },
        {
            name: 'Confirm card payment',
            code: 'confirmCardPayment',
            isAsync: true,
        },
    ],
};
