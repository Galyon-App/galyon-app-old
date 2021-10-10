export class Product {
    uuid: string;
    store_id: string;
    store_name: string;
    name: string;
    description: string;
    features: string;
    disclaimer: string;
    orig_price: number;
    sell_price = () => {
        if(this.discount_type == 'fixed') {
            return this.orig_price - this.discount;
        } else if(this.discount_type == 'percent') {
            let discount = this.discount/100;
            return this.orig_price - (this.orig_price * discount);
        } else {
            return this.orig_price;
        }
    }
    discount_type: string;
    discount: number;

    cover: string;
    images: any = '';
    category_id: string;
    subcategory_id: string;

    have_pcs: boolean;
    pcs: number;
    have_kg: boolean;
    kg: number;
    have_gram: boolean;
    gram: number;
    have_liter: boolean;
    liter: number;
    have_ml: boolean;
    ml: number;

    type_of: string;
    variations: any = '';
    in_stock: boolean;
    is_featured: boolean;
    in_home: boolean;
    is_single: boolean;
    status: string;
    timestamp: string;
    verified_at: string;
    updated_at: string;

    avg_rating: number = 0;
    total_rating: number = 0;

    quantity: number = 0;
}
