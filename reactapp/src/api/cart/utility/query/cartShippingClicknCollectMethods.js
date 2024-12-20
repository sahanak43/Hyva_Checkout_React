export const cartShippingClicknCollectMethods = `
    shipping_clickncollect(cart_id: $cartId) {
        pickup_locations {
            source_code
            name
            street
            city
            country
            country_id
            region
            pickup_timings
            phone
            email
            contact_name
            display_order
            is_warehouse
            map_coordinates {
                latitude
                longitude
            }
            pickup_datetime {
                date_incl_hours {
                    value
                    label,
                    hours {
                        value,
                        label
                    }
                }
            }
        }
    }
`;
