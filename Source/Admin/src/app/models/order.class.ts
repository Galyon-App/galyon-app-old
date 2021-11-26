export class Order {
    uuid: string = '';
    uid: string = '';
    driver_id: string = '';

    address_id: string = '';
    coupon: string = '';
    delivery: any;

    factor: any;
    items: any;
    progress: any;

    store_cover: string = '';
    store_id: string = '';
    store_name: string = '';

    discount: number = 0;
    tax: number = 0;
    total: number = 0;
    grand_total: number = 0;

    pay_key: any;
    paid_method: any;
    matrix: any;

    status: boolean = false;
    stage: any = 'draft';

    timestamp: any;
    updated_at: any;
    deleted_at: any;
}
