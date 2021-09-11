export class Product {
    uuid: string;
    store_id: string;
    name: string;
    descriptions: string;
    feature: string;
    disclaimer: string;
    orig_price: number;
    sell_price: number;
    cover: string;
    images: string;
    discount_type: string;
    discount: number;
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
    variations: string;
    in_stock: boolean;
    is_featured: boolean;
    in_home: boolean;
    is_single: boolean;
    status: string;
    timestamp: string;
    verified_at: string;
    updated_at: string;
}
