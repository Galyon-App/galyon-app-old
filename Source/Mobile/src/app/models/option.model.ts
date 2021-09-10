
export class General {
    address: any ='';
    city: any ='';
    country: any ='';
    email: any ='';
    free_delivery: any ='';
    minimum_order: any ='';
    phone: any ='';
    province: any ='';
    shipping: any ='';
    shippingPrice: any ='';
    tax: any ='';
    zipcode: any ='';
}

export class Manage {
    app_close: any ='';
    app_close_message: any ='';
}

export class Payment {
    cod_enable: any ='';
    cod_data: any ='';
    gcash_enable: any ='';
    gcash_data: any ='';
    paypal_enable: any ='';
    paypal_data: any ='';
    paymongo_enable: any ='';
    paymongo_data: any ='';
    stripe_enable: any ='';
    stripe_data: any ='';
}

export class Setting {
    appDirection: any ='';
    currencySide: any ='';
    currencySymbol: any ='';
    delivery: any ='';
    driver_login: any ='';
    logo: any ='';
    reset_pwd: any ='';
    store_login: any ='';
    user_login: any ='';
    web_login: any ='';
}

export class Option {
    file: any ='';
    lang: {};
    general: General;
    manage: Manage;
    payment: Payment;
    settings: Setting;
}